import prisma from "@/lib/prisma";
import {mapExamMarkWithExamStudentParentAndSignature, mapTeacherWithExamMarks} from "@/lib/data/mappings";
import {
    ExamMarkWithExamStudentAndParent,
    ExamMarkWithExamStudentParentAndSignature,
    ExamMarkWithStudentAndParent
} from "@/lib/definitions/exam";

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

export async function fetchExamMarkById(examMarkId: number): Promise<ExamMarkWithExamStudentParentAndSignature | null> {
    const mark = await prisma.examMark.findUnique({
        where: {id: examMarkId},
        include: {
            Exam: {
                include: {
                    subject: true
                }
            },
            student: {
                include: {
                    profile: {
                        include: {
                            user: true,
                        }
                    },
                    parents: {
                        include: {
                            profile: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            },
            signature: {
                include: {
                    parent: {
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
    });
    return mark ? mapExamMarkWithExamStudentParentAndSignature(mark) : null;
}