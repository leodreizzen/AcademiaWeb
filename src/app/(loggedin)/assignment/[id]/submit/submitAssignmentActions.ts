"use server"
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const submitAssignment = async (fileUrl: string, assignmentId: number) => {
    const user = (await auth())?.user;
    if (!user) {
        throw new Error("Debes iniciar sesión para enviar el trabajo");
    }
    
    const userProfiles = await prisma.user.findUnique({
        where: {
            dni: user.dni
        },
        include: {
            profiles: true
        }
    });
    const studentId = userProfiles?.profiles.find(x => x.role === "Student")?.id;
    if (!studentId) {
        throw new Error("No puedes enviar el trabajo porque no eres estudiante");
    }

    await prisma.assignmentSubmission.create({
        data: {
            uploadDate: new Date(),
            fileUrl,
            student: {
                connect: {
                    id: studentId
                }
            },
            assignment: {
                connect: {
                    id: assignmentId
                }
            },
        },
    });
}