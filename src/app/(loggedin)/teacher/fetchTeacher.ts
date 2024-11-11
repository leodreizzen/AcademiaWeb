'use server';


import prisma from "@/lib/prisma";
import {TeacherWithSubjects, TeacherWithUser} from "@/lib/definitions/teacher";
import {mapTeacherWithSubjects, mapTeacherWithUser} from "@/lib/data/mappings";

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


export async function fetchTeacherById(id: number): Promise<TeacherWithSubjects | null> {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: {id},
            include: {
                profile: {
                    include: {
                        user: true
                    }
                },
                subjects: true
            }
        });
        return teacher ? mapTeacherWithSubjects(teacher) : null;
    } catch (error) {
        console.error("Error fetching teacher by id:", error);
        return null;
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