import prisma from "@/lib/prisma";
import {ExamMarkWithExamStudentParentAndSignature, ExamMarkWithStudentParentAndSignature} from "@/lib/definitions/exam";
import {mapExamMarkWithStudentParentsAndSignature} from "@/lib/data/mappings";

export async function fetchStudentMarkByExamId(examMarkId: string): Promise<ExamMarkWithExamStudentParentAndSignature | null> {
    const mark = await prisma.examMark.findUnique({
        where: {
            id: parseInt(examMarkId)
        },
        include: {
            exam: {
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
                }
            }, signature: {
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
    return mark ? {
        ...mapExamMarkWithStudentParentsAndSignature(mark),
        exam: mark.exam
    }: null
}