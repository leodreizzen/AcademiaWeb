import prisma from "@/lib/prisma";
import {$Enums, AttendanceData, Student} from "@prisma/client";
import {ProfileWithUser} from "@/lib/actions/fetch-student-mark-by-parent";
import AttendanceStatus = $Enums.AttendanceStatus;

export interface AttendanceResponse {
    attendance: AttendanceDataWithItems[]
    student: StudentWithProfile
}

export interface AttendanceDataWithItems extends AttendanceData {
    items: AttendanceItemsWithStudentAndStatus[]
}

interface AttendanceItemsWithStudentAndStatus {
    student: StudentWithProfile
    status: AttendanceStatus
}

interface StudentWithProfile extends Student {
    profile: ProfileWithUser
}

export async function getAttendanceForStudent(studentId: number): Promise<AttendanceResponse | null> {
    const attendance =  await prisma.attendanceData.findMany({
        where: {
            items: {
                some: {
                    studentId: studentId
                }
            }
        },
        include: {
            items: {
                where: {
                    studentId: studentId
                },
                include: {
                    student: {
                        include: {
                            profile: {
                                include: {
                                    user: true,
                                }
                            },
                        }
                    },
                }
            }
        }
    });

    if(!attendance) return null;

    const student = await prisma.student.findUnique({
        where: {
            id: studentId
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            }
        }
    });

    if(!student) return null;

    return {attendance, student};

}