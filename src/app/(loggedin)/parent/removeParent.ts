'use server';

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function removeParent(id: number) {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        await prisma.parent.delete({
            where: {
                id
            }
        });
        return true;
    } catch (error) {
        console.error("Error fetching parent:", error);
        return false;
    }
}