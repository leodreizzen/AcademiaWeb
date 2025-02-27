import prisma from "@/lib/prisma";
import {$Enums, AttendanceData, Student} from "@prisma/client";
import AttendanceStatus = $Enums.AttendanceStatus;
import {PrismaProfileWithUser} from "@/lib/data/mappings";

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
    profile: PrismaProfileWithUser
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

export async function getAttendanceForGrade(gradeId: number): Promise<AttendanceDataWithItems[] | null> {
    const grade = await prisma.grade.findUnique({
        where: {
            id: gradeId
        },
    })

    if(!grade) return null;

    const attendanceResult = await prisma.attendanceData.findMany({
        where: {
            gradeName: grade.name
        },
        include: {
            items: {
                include: {
                    student: {
                        include: {
                            profile: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if(!attendanceResult) return null;

    return attendanceResult;
}