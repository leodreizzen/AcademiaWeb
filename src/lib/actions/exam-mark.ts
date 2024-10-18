"use server"

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {Grade, Prisma, Student, Subject, User} from "@prisma/client";
import {StudentMark} from "@/lib/models/examMarkAdd";

export interface SubjectWithGrade extends Subject {
    grade: Grade
}

export interface StudentWithUser extends Student {
    user: User
}

type RegisterMarksResponse = {
    success: boolean
    message: string
}

export interface GradeWithSubjects extends Grade {
    subjects: Subject[]
}

export async function fetchSubjectWithGrade(id: number) {
    const prisma = await getCurrentProfilePrismaClient();
    const subject = await prisma.subject.findUnique({
        where: {
            id: id
        },
        include: {
            grade: true
        }
    })
    return subject as SubjectWithGrade
}

export async function fetchStudentsForSubject(subjectId: number) {
    const prisma = await getCurrentProfilePrismaClient();
    return prisma.student.findMany({
        where: {
            grade: {
                subjects: {
                    some: {
                        id: subjectId
                    }
                }
            }
        },
        include: {
            user: true
        }
    });
}

export async function registerMarks(subjectId: number, examDate: Date, students: StudentMark[]) {
    const prisma = await getCurrentProfilePrismaClient();
    try{
        const res: RegisterMarksResponse = await prisma.$transaction(async tx => {
            const subject = await tx.subject.findUnique({
                where: {
                    id: subjectId
                }
            })

            if (!subject)
                return {
                    success: false,
                    message: "Materia no encontrada"
                }

            const exam = await tx.exam.create({
                data: {
                    date: examDate,
                    subject: {
                        connect: {
                            id: subjectId
                        }
                    }
                }
            })

            const filteredStudents = students.filter(student => student.grade !== null)

            const examMarks = filteredStudents.map(student => {
                return {
                    examId: exam.id,
                    studentId: student.id,
                    mark: student.grade??0
                }
            })

            await tx.examMark.createMany({
                data: examMarks
            })

            return {
                success: true,
                message: "Notas registradas"
            }
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 15000
        })
        return res
    } catch (e: any){
        return {
            success: false,
            message: e.message
        }
    }
}

export async function fetchGradesWithSubjectsForTeacher(teacherId: number): Promise<GradeWithSubjects[]> {
    const prisma = await getCurrentProfilePrismaClient();
    return prisma.grade.findMany({
        where: {
            subjects: {
                some: {
                    teachers: {
                        some: {
                            id: teacherId
                        }
                    }
                }
            },
        },
        include: {
            subjects: {
                where: {
                    teachers: {
                        some: {
                            id: teacherId
                        }
                    }
                }
            }
        }
    })
}