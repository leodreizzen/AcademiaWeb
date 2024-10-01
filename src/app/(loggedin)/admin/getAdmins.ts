"use server"

import getPrismaClient from "@/app/lib/prisma";

const prisma = getPrismaClient({id: 1, role: "Administrator"});
const ITEMS_PER_PAGE = 10;


export async function getAdmins(page: number) {
    try {
        return await prisma.administrator.findMany({
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return [];
    }
}