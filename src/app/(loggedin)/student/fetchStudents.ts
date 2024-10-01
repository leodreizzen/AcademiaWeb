'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchStudents(page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    const NUMBER_OF_PRODUCTS = 10;
    try {

        return await prisma.student.findMany({
            skip: (page - 1) * NUMBER_OF_PRODUCTS,
            take: NUMBER_OF_PRODUCTS,
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}

export async function countStudents() {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        return await prisma.student.count();
    } catch (error) {
        console.error("Error counting students:", error);
        return 0;
    }
}

