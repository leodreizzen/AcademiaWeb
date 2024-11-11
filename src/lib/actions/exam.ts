"use server"

import { Exam, ExamMark } from "@prisma/client";
import prisma from "../prisma";
import { SubjectWithGradeAndTeachers } from "./exam-mark";

export interface ExamWithSubjectAndMarks extends Exam {
    subject: SubjectWithGradeAndTeachers;
    marks: ExamMark[]
}

export async function fetchExam(id: number) {
    const exam = await prisma.exam.findUnique({
        where: {
            id: id
        },
        include: {
            subject: {
                include: {
                    grade: true,
                    teachers: true
                }
            },
            marks: true
        }
    })
    if (!exam) {
        return null;
    }
    return exam as ExamWithSubjectAndMarks;
}