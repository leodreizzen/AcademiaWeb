import prisma from "@/lib/prisma";
import {mapTeacherWithExamMarks} from "@/lib/data/mappings";

export async function fetchExamMarksForStudent(studentId: number) {
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
    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId},
        include: {
            subjects: {
                orderBy: [{
                    gradeName: "asc"
                }, {
                    name: "asc"
                }],
                include: {
                    exams: {
                        include: {
                            marks: {
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
                    },
                    grade: true
                }
            },
        }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    return mapTeacherWithExamMarks(teacher);
}