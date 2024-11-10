"use server"

import {ExamMark, Grade, Prisma, Subject, Teacher} from "@prisma/client";
import {StudentMark} from "@/lib/models/examMarkAdd";
import prisma from "@/lib/prisma";
import {mapStudentWithUser} from "@/lib/data/mappings";
import {localDayStart} from "@/lib/dateUtils";
import { ExamMarkEdit } from "../models/examMark";

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

export async function updateMarks(marks: { id: number, examId: number, studentId: number, mark: number }[]) {
    try{
        const insertPromises = marks.filter(x => x.id === 0).map(item => {
            return prisma.examMark.create({
                data: {
                    examId: item.examId,
                    studentId: item.studentId,
                    mark: item.mark
                },
            })
        });
        const updatePromises = marks.filter(x => x.id !== 0).map((item) =>
            prisma.examMark.update({
                where: { id: item.id },
                data: { mark: item.mark },
            })
        );

        await prisma.$transaction(insertPromises);
        await prisma.$transaction(updatePromises);
        return {
            success: true,
            message: "Notas registradas"
        }
    } catch (e: any){
        return {
            success: false,
            message: e.message
        }
    }
}