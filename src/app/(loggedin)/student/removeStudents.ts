"use server"

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import {revalidatePath} from "next/cache";
export async function removeStudent(id: number) {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        prisma.$transaction(async (tx) => {
            const student = await tx.student.findUnique({
                where: {
                    id
                }
            });

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
            const user = await tx.user.findUnique({
                where: {
                    dni: student!.dni
                },
                include: {
                    profiles: true
                }
            });
            if (user?.profiles.length === 0) {
                await tx.user.delete({
                    where: {
                        dni: student!.dni
                    }
                });
            }
            revalidatePath("/student");
        })
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        return false;
    }
}