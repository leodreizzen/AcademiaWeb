import prisma from "@/lib/prisma";
import {Exam, ExamMark, Parent, Profile, Student, Subject} from "@prisma/client";

export interface ExamMarkWithStudentAndExam extends ExamMark {
    student: StudentWithProfileAndParents
    Exam: ExamWithSubject
}

export interface StudentWithProfileAndParents extends Student {
    parents: ParentWithProfileAndUser[]
    profile: ProfileWithUser
}

export interface ProfileWithUser extends Profile {
    user: {
        dni: number
        lastName: string
        firstName: string
    }
}

export interface ExamWithSubject extends Exam {
    subject: Subject
}

export interface ParentWithProfileAndUser extends Parent {

}

export async function fetchStudentMarkByParent(examMarkId: string): Promise<ExamMarkWithStudentAndExam | null> {
    return prisma.examMark.findUnique({
        where: {
            id: parseInt(examMarkId)
        },
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
                            user: true
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
                    },
                },
            }
        }
    });
}