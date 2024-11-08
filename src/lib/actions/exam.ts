"use server"

import { Exam } from "@prisma/client";
import prisma from "../prisma";
import { SubjectWithGradeAndTeachers } from "./exam-mark";
import { mapStudentWithUser } from "../data/mappings";
import { StudentWithUser } from "../definitions/student";
import { ExamMarkWithStudent } from "@/app/api/internal/exam-marks/teacher/types";

export interface ExamWithSubjectAndMarks extends Exam {
    subject: SubjectWithGradeAndTeachers;
    marks: ExamMarkWithStudent[]
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
            marks: {
                include: {
                    student: true
                }
            }
        }
    })
    if (!exam) {
        return null;
    }
    const studentsIds = exam.marks.map(x => x.studentId);
    const students = await prisma.student.findMany({
        where: {
            id: {
                in: studentsIds
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

    exam.marks = exam?.marks.map(x => {
        const student = students.find(y => y.id === x.studentId);
        if (!student) {
            return x;
        }
        const studentWithUser = mapStudentWithUser(student) as StudentWithUser;
        const mark = {
            id: x.id,
            examId: x.examId,
            mark: x.mark,
            studentId: x.studentId,
            student: studentWithUser
        };
        return mark;
    })
    return exam as ExamWithSubjectAndMarks;
}