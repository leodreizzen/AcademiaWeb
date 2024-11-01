import {Exam, ExamMark, Subject, Teacher} from "@prisma/client";
import {StudentWithUser} from "@/lib/definitions/student";

export interface TeacherWithMarksPerSubject extends Teacher {
    subjects: SubjectWithExamsAndStudents[]
}

export interface SubjectWithExamsAndStudents extends Subject{
    exams: ExamWithMarksAndStudents[]
}

export interface ExamWithMarksAndStudents extends Exam {
    marks: ExamMarkWithStudent[]
}

export interface ExamMarkWithStudent extends ExamMark {
    student: StudentWithUser
}




export type TeacherMarkAPIResponse = TeacherWithMarksPerSubject