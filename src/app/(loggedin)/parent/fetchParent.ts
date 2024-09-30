'use server';



import getPrismaClient from "@/app/lib/prisma";

const prisma = getPrismaClient({id: 1, role: "Administrator"});



export async function fetchParents(page: number) {
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
    try {
        return await prisma.parent.count();
    } catch (error) {
        console.error("Error counting parents:", error);
        return 0;
    }
}