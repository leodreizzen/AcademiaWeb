'use server';

import {StudentWithUser} from "@/lib/definitions/student";
import prisma from "@/lib/prisma";
import {mapStudentWithUser} from "@/lib/data/mappings";

export async function fetchStudents(page: number): Promise<StudentWithUser[]> {
    const NUMBER_OF_PRODUCTS = 10;
    try {

        const students =  await prisma.student.findMany({
            skip: (page - 1) * NUMBER_OF_PRODUCTS,
            take: NUMBER_OF_PRODUCTS,
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return students.map(mapStudentWithUser)
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

