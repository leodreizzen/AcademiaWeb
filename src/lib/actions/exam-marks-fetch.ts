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