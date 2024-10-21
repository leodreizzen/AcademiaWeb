import {Exam, ExamMark, Grade, Student, Subject} from "@prisma/client";


export interface StudentWithMarksPerSubject extends Student {
    grade: GradeWithSubjectWithExams
}

export interface GradeWithSubjectWithExams extends Grade {
    subjects: SubjectWithExams[]
}

export interface SubjectWithExams extends Subject {
    exams: ExamWithMarks[]
}

export interface ExamWithMarks extends Exam {
    marks: ExamMark[]
}


export type ExamMarkAPIResponse = StudentWithMarksPerSubject