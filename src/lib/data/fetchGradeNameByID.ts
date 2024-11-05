'use server';
import prisma from "@/lib/prisma";
import {Grade} from "@prisma/client";

export async function fetchGradeByID(gradeID: number): Promise<Grade | null> {
    try {
        return await prisma.grade.findUnique({
            where: {
                id: gradeID
            }
        });
    }
    catch (error) {
        console.error("Error fetching grade name:", error);
        return null;
    }
}