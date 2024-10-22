"use server"

import {revalidatePath} from "next/cache";
import prisma from "@/lib/prisma";
export async function removeStudent(id: number) {
    try {
        await prisma.$transaction(async (tx) => {
            const student = await tx.student.findUnique({
                where: {
                    id
                },
                include: {
                    profile: {
                        include: {
                            user: {
                                include: {
                                    profiles: true
                                }
                            }
                        }
                    }
                }
            });
            if (!student) {
                console.error("Error fetching student");
                return false;
            }

            const submissions = await tx.assignmentSubmission.findMany({
                where: {
                    student: {
                        id: id
                    }
                }
            });

            await tx.assignmentSubmission.deleteMany({
                where: {
                    id: {
                        in: [...submissions.map(submission => submission.id)]
                    }
                }
            });

            const examMarks = await tx.examMark.findMany({
                where: {
                    student: {
                        id: id
                    }
                }
            });


            for (const examMark of examMarks) {
                await tx.examMark.delete({
                    where: {
                        examId_studentId: {
                            examId: examMark.examId,
                            studentId: examMark.studentId
                        }
                    }
                });
            }


            await tx.student.delete({
                where: {
                    id
                }
            });

            await tx.profile.delete({
                where: {
                    id: student.id
                }
            });

            if (student.profile.user.profiles.length === 1) {
                await tx.user.delete({
                    where: {
                        dni: student.profile.dni
                    }
                });
            }
            revalidatePath("/student");
        })
        return true;
    } catch (error) {
        return false;
    }
}