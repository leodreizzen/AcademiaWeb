"use server"

import getPrismaClient from "@/app/lib/prisma";
import { ADMINS_PER_PAGE } from "./adminConstants";

const prisma = getPrismaClient({id: 1, role: "Administrator"});


export async function getAdmins(page: number) {
    try {
        return await prisma.administrator.findMany({
            skip: (page - 1) * ADMINS_PER_PAGE,
            take: ADMINS_PER_PAGE,
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
        return await prisma.administrator.count();
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return 0;
    }
}