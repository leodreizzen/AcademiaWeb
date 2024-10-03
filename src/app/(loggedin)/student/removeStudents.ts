"use server"

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function removeStudent(id: number) {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        await prisma.student.delete({
            where: {
                id
            }
        });
        return true;
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return false;
    }
}