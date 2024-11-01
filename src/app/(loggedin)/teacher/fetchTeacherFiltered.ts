'use server';

import prisma from "@/lib/prisma";

import {TeacherWithUser} from "@/lib/definitions/teacher";
import {mapTeacherWithUser, PrismaTeacherWithUser} from "@/lib/data/mappings";

export async function fetchTeachersFiltered({dni, lastName}: {dni?: number, lastName?: string}, page: number): Promise<TeacherWithUser[]> {
    try {
        let teachers: PrismaTeacherWithUser[];
        if (dni !== undefined) {
            const NUMBER_OF_TEACHERS = 10;
            teachers = await prisma.teacher.findMany({
                skip: (page - 1) * NUMBER_OF_TEACHERS,
                take: NUMBER_OF_TEACHERS,
                where: {
                    profile:{
                        user: {
                            dni: Number(dni)
                        }
                    }
                },
                include : {
                    profile: {
                        include: {
                            user: true
                        }
                    }
                }
            })
        } else {
            teachers = await prisma.teacher.findMany({
                where: {
                    profile:{
                        user: {
                            lastName: {
                                contains: lastName,
                                mode: 'insensitive',
                            },
                        },
                    }
                },
                include : {
                    profile: {
                        include: {
                            user: true
                        }
                    }
                }
            })
        }
        return teachers.map(mapTeacherWithUser)
    }
    catch(error)
    {
        console.error("Error fetching teachers:", error);
        return [];
    }
}