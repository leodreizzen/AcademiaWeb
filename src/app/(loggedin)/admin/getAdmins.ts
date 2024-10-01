"use server"

import { ADMINS_PER_PAGE } from "./adminConstants";
import { AdminQuery } from "./types";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";


export async function getAdmins({ page, dni, lastName }: AdminQuery) {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        return await prisma.administrator.findMany({
            skip: (page - 1) * ADMINS_PER_PAGE,
            take: ADMINS_PER_PAGE,
            where: {
                ...(dni && { dni: dni }),
                ...(lastName && {
                  lastName: {
                    contains: lastName,
                    mode: 'insensitive',
                  },
                }),
            },
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return [];
    }
}

export async function getTotalAdmins() {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        return await prisma.administrator.count();
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return 0;
    }
}