'use server';

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {PARENTS_PER_PAGE} from "@/lib/data/pagination";

export async function fetchParentsFiltered({dni, lastName, exclude}: {dni?: number, lastName?: string, exclude?: number[]}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        const filters = [];
        if(dni !== undefined)
            filters.push({
                user: {
                    dni: dni
                }
            })

        if(lastName !== undefined)
            filters.push({
                user: {
                    lastName: {
                        contains: lastName,
                        mode: 'insensitive',
                    } as const
                }
            })
        if(exclude !== undefined)
            filters.push({
                user: {
                    dni: {
                        not: {
                            in: exclude
                        }
                    }
                }
            })

        return await prisma.parent.findMany({
                skip: (page - 1) * PARENTS_PER_PAGE,
                take: PARENTS_PER_PAGE,
                where: {
                    AND: filters
                },
                include : {
                    user: true
                }
            })
    }
    catch(error)
    {
        console.error("Error fetching parents:", error);
        return [];
    }
}


export async function countParentsFiltered({dni, lastName, exclude}: {dni?: number, lastName?: string, exclude?: number[]}) {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        const filters = [];
        if (dni !== undefined)
            filters.push({
                user: {
                    dni: dni
                }
            })

        if (lastName !== undefined)
            filters.push({
                user: {
                    lastName: {
                        contains: lastName,
                        mode: 'insensitive',
                    } as const
                }
            })
        if (exclude !== undefined)
            filters.push({
                user: {
                    dni: {
                        not: {
                            in: exclude
                        }
                    }
                }
            })

        return await prisma.parent.count({
            where: {
                AND: filters
            }
        })
    }
    catch(error)
    {
        console.error("Error fetching parents:", error);
        throw error;
    }
}
