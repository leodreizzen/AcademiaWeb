'use server';
import prisma from "@/lib/prisma";
import {AttendanceStatus, Grade} from "@prisma/client";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {localDayEnd, localDayStart} from "@/lib/dateUtils";
import {AttendanceCheckSchema} from "@/lib/actions/attendanceCheck";
import {fetchCurrentUser} from "@/lib/data/users";

export async function hasPreviousAttendace(gradeId:number, date: Date){
    return await prisma.attendanceData.findFirst({
        where: {
            grade: {
                id: gradeId
            },
            date: {
                gte: localDayStart(date),
                lte: localDayEnd(date)
            }
        },
    }) !== null;
}

export async function isItWeekend(date: Date){
    return date.getDay() === 0 || date.getDay() === 6;
}

export async function teacherCanRegisterAttendance(grade: Grade){
    const user = await fetchCurrentUser();
    let toReturn = false;
    if(user && user.role === "Teacher"){
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: user.id
            },
            include: {
                subjects: true
            }
        });
        if(teacher){
            toReturn = teacher.subjects.some(s => s.gradeName === grade.name);
        }

    }
    return toReturn;
}

interface Attendance {
    students : Record<number, AttendanceStatus>,
    gradeId: number,
}

export async function registerAttendance(attendance: Attendance, _date: Date): Promise<ActionResult> {
    const date = new Date();// ignore date for now
    console.log(attendance);
    const data = AttendanceCheckSchema.safeParse(attendance);
    if(!data.success){
        return {
            success: false,
            error: data.error.errors[0].message
        }
    }
    try {

        if(await isItWeekend(date)){
            return {
                success: false,
                error: "No se puede registrar asistencia en fin de semana"
            }
        }
        const hasPreviousAttendance = await hasPreviousAttendace(attendance.gradeId, date);
        if(hasPreviousAttendance){
            return {
                success: false,
                error: "Ya existe una asistencia registrada para esta fecha"
            }
        }

        await prisma.attendanceData.create({
            data: {
                grade: {
                    connect: {
                        id: attendance.gradeId
                    }
                },
                date,
                items: {
                    create: Object.entries(attendance.students).map(([studentId, status]) => ({
                        studentId: parseInt(studentId),
                        status,
                    })),
                },
            },
        });
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error registering attendance:', error);
        return{
            success: false,
            error: 'Error registering attendance',
        }
    }
}