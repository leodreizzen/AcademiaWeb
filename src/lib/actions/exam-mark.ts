"use server"

import {Grade, Prisma, Subject, Teacher} from "@prisma/client";
import {StudentMark} from "@/lib/models/examMarkAdd";
import prisma from "@/lib/prisma";
import {mapStudentWithUser} from "@/lib/data/mappings";
import {localDayStart} from "@/lib/dateUtils";

export interface SubjectWithGradeAndTeachers extends Subject {
    grade: Grade
    teachers: Teacher[]
}

type RegisterMarksResponse = {
    success: boolean
    message: string
}

export interface GradeWithSubjects extends Grade {
    subjects: Subject[]
}

export async function fetchSubjectWithGrade(id: number) {
    const subject = await prisma.subject.findUnique({
        where: {
            id: id
        },
        include: {
            grade: true,
            teachers: true
        }
    })
    return subject as SubjectWithGradeAndTeachers
}

export async function fetchStudentsForSubject(subjectId: number) {
    const students = await prisma.student.findMany({
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
            profile: {
                include: {
                    user: true
                }
            }
        }
    });

    return students.map(mapStudentWithUser)
}

export async function registerMarks(subjectId: number, examDate: Date, students: StudentMark[]) {
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
                    date: localDayStart(examDate),
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

export async function fetchGradesWithSubjectsForStudent(gradeName: string): Promise<GradeWithSubjects[]> {
    return prisma.grade.findMany({
        where: {
            name: gradeName
        },
        include: {
            subjects: {
                where: {
                    gradeName: gradeName
                }
            }
        }
    })
}