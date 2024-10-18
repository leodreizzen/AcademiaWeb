'use server';

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";


export async function fetchTeachersFiltered({dni, lastName}: {dni?: number, lastName?: string}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        if (dni !== undefined) {
            const NUMBER_OF_TEACHERS = 10;
            return await prisma.teacher.findMany({
                skip: (page - 1) * NUMBER_OF_TEACHERS,
                take: NUMBER_OF_TEACHERS,
                where: {
                    user: {
                        dni: Number(dni)
                    }
                },
                include : {
                    user: true
                }
            })
        } else {
            return await prisma.teacher.findMany({
                where: {
                    user: {
                        lastName: {
                            contains: lastName,
                            mode: 'insensitive',
                        },
                    },
                },
                include : {
                    user: true
                }
            })
        }
    }
    catch(error)
    {
        console.error("Error fetching teachers:", error);
        return [];
    }
}