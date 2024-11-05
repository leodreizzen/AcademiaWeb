'use server';
import prisma from "@/lib/prisma";
import {PrismaStudentWithUser} from "@/lib/data/mappings";

export async function fetchStudentsByGrade(grade: string):Promise<PrismaStudentWithUser[]> {
    try {
        return await prisma.student.findMany({
            where: {
                gradeName: grade
            },
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }

}
