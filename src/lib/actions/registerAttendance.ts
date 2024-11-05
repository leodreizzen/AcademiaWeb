'use server';
import prisma from "@/lib/prisma";
import {AttendanceStatus} from "@prisma/client";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {localDayEnd, localDayStart} from "@/lib/dateUtils";

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

export async function registerAttendance(attendance: Record<number, AttendanceStatus>, gradeId: number, _date: Date): Promise<ActionResult> {
    const date = new Date(); // ignore date for now
    try {
        const hasPreviousAttendance = await hasPreviousAttendace(gradeId, date);
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
                        id: gradeId
                    }
                },
                date,
                items: {
                    create: Object.entries(attendance).map(([studentId, status]) => ({
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