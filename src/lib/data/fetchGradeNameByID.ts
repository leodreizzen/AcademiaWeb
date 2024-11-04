'use server';
import prisma from "@/lib/prisma";
export async function fetchGradeNameByID(gradeID: number): Promise<string | null> {
    try {
        const grade = await prisma.grade.findUnique({
            where: {
                id: gradeID
            }
        });
        return grade?.name || null;
    }
    catch (error) {
        console.error("Error fetching grade name:", error);
        return null;
    }
}