import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";


export async function fetchExamMarksForStudent(studentId: number) {
    const prisma = await getCurrentProfilePrismaClient();
    const student = await prisma.student.findUnique({
        where: {id: studentId},
        include: {
            grade: {
                include: {
                    subjects: {
                        include: {
                            exams: {
                                where: {
                                    marks: {
                                        some: {
                                            studentId: studentId
                                        }
                                    }
                                },
                                include: {
                                    marks: {
                                        where: {
                                            studentId: studentId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!student) {
        throw new Error("Student not found");
    }

    return student
}

export async function fetchExamMarksForTeacher(teacherId: number) {
    const prisma = await getCurrentProfilePrismaClient();
    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId},
        include: {
            subjects: {
                include: {
                    exams: {
                        include: {
                            marks: {
                                include: {
                                    student: {
                                        include: {
                                            user: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    grade: true
                }
            },
        }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    return teacher
}