'use server';



import getPrismaClient from "@/app/lib/prisma";

const prisma = getPrismaClient({id: 1, role: "Administrator"});



export async function fetchTeachers(page: number) {
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
    try {
        return await prisma.teacher.count();
    } catch (error) {
        console.error("Error counting teachers:", error);
        return 0;
    }
}