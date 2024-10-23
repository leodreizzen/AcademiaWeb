'use server';


import prisma from "@/lib/prisma";
import {TeacherWithUser} from "@/lib/definitions/teacher";
import {mapTeacherWithUser} from "@/lib/data/mappings";

export async function fetchTeachers(page: number): Promise<TeacherWithUser[]> {
    const NUMBER_OF_TEACHERS = 10;
    try {
        const teachers = await prisma.teacher.findMany({
            skip: (page - 1) * NUMBER_OF_TEACHERS,
            take: NUMBER_OF_TEACHERS,
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return teachers.map(mapTeacherWithUser)
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