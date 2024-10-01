'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchParents(page: number) {
    const prisma = await getCurrentProfilePrismaClient();
    const NUMBER_OF_PRODUCTS = 10;
    try {
        return await prisma.parent.findMany({
            skip: (page - 1) * NUMBER_OF_PRODUCTS,
            take: NUMBER_OF_PRODUCTS,
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching parents:", error);
        return [];
    }
}
export async function countParents() {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        return await prisma.parent.count();
    } catch (error) {
        console.error("Error counting parents:", error);
        return 0;
    }
}