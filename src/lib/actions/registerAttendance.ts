'use server';
import prisma from "@/lib/prisma";
import {AttendanceStatus} from "@prisma/client";
import {ActionResult} from "@/app/(loggedin)/student/add/types";

export async function registerAttendance(attendance: Record<number, AttendanceStatus>, gradeName: string, date: Date, init: Date, end: Date): Promise<ActionResult> {
    try {

        const dateFilter = init && end ? {
            date: {
                gte: init,
                lte: end
            }
        } : {};


        const checkIfPreviousAttendance = await prisma.attendanceData.findFirst({
            where: {
                gradeName,
                ...dateFilter,
            },
        });
        if(checkIfPreviousAttendance){
            return {
                success: false,
                error: "Ya existe una asistencia registrada para esta fecha"
            }
        }


        await prisma.attendanceData.create({
            data: {
                gradeName,
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