import {Exam, ExamMark, Subject} from "@prisma/client";
import {StudentWithUser} from "@/lib/definitions/student";
import {SignatureWithParent} from "@/lib/definitions/signature";
import {StudentWithUserAndParent} from "@/lib/definitions/parent";

export type ExamMarkWithStudent = ExamMark & {
    student: StudentWithUser
}
export type ExamMarkWithExam = ExamMark & {
    exam: ExamWithSubject
}

export type ExamWithSubject = Exam & {
    subject : Subject
}

export type ExamMarkWithStudentAndSignature = ExamMarkWithStudent & {
    signature: SignatureWithParent | null
}

export type ExamMarkWithStudentAndParent = ExamMark & {
    student: StudentWithUserAndParent
}

export type ExamMarkWithExamStudentAndParent = ExamMarkWithExam & ExamMarkWithStudentAndParent;

export type ExamMarkWithStudentParentAndSignature = ExamMarkWithStudentAndParent & {
    signature: SignatureWithParent | null
}

export type ExamMarkWithExamStudentParentAndSignature = ExamMarkWithExam & ExamMarkWithStudentParentAndSignature;