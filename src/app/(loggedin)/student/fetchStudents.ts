'use server';



import getPrismaClient from "@/app/lib/prisma";

const prisma = getPrismaClient({id: 1, role: "Administrator"});



export async function fetchStudents(page: number) {
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
    try {
        return await prisma.student.count();
    } catch (error) {
        console.error("Error counting students:", error);
        return 0;
    }
}

