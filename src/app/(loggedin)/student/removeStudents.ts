"use server"

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function removeStudent(id: number) {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });
        await prisma.student.delete({
            where: {
                id
            }
        });
        const user = await prisma.user.findUnique({
            where: {
                dni: student!.dni
            },
            include: {
                profiles: true
            }
        });
        if (user?.profiles.length === 0) {
            await prisma.user.delete({
                where: {
                    dni: student!.dni
                }
            });
        }
        return true;
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return false;
    }
}