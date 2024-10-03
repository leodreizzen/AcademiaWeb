'use server';

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchTeachers(page: number) {
    const prisma = await getCurrentProfilePrismaClient();
    const NUMBER_OF_TEACHERS = 10;
    try {

        return await prisma.teacher.findMany({
            skip: (page - 1) * NUMBER_OF_TEACHERS,
            take: NUMBER_OF_TEACHERS,
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
}

export async function countTeachers() {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        return await prisma.teacher.count();
    } catch (error) {
        console.error("Error counting teachers:", error);
        return 0;
    }
}