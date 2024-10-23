'use server';

import prisma from "@/lib/prisma";

export async function fetchGrades() {
    try {
        return await prisma.grade.findMany({
            include: {students: false, subjects: false},
        });
    } catch (error) {
        console.error("Error fetching grades:", error);
        return [];
    }
}
