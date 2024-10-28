'use server';

import {PARENTS_PER_PAGE} from "@/lib/data/pagination";
import prisma from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {ParentWithUser} from "@/lib/definitions/parent";
import {mapParentWithUser} from "@/lib/data/mappings";
export async function fetchParentsFiltered({dni, lastName, exclude}: {dni?: number, lastName?: string, exclude?: number[]}, page: number): Promise<ParentWithUser[]> {
    try {
        const filters: Prisma.ParentWhereInput[] = [];
        if(dni !== undefined)
            filters.push({
                profile:{
                    user: {
                        dni: dni
                    }
                }
            })

        if(lastName !== undefined)
            filters.push({
                profile: {
                    user: {
                        lastName: {
                            contains: lastName,
                            mode: 'insensitive',
                        } as const
                    }
                }
            })
        if(exclude !== undefined)
            filters.push({
                profile: {
                    user: {
                        dni: {
                            not: {
                                in: exclude
                            }
                        }
                    }
                }
            })
        const parents =  await prisma.parent.findMany({
                skip: (page - 1) * PARENTS_PER_PAGE,
                take: PARENTS_PER_PAGE,
                where: {
                    AND: filters
                },
                include : {
                    profile: {
                        include:{
                            user: true
                        }
                    }
                }
            })
        return parents.map(mapParentWithUser)
    }
    catch(error)
    {
        console.error("Error fetching parents:", error);
        return [];
    }
}


export async function countParentsFiltered({dni, lastName, exclude}: {dni?: number, lastName?: string, exclude?: number[]}) {
    try {
        const filters: Prisma.ParentWhereInput[] = [];
        if(dni !== undefined)
            filters.push({
                profile:{
                    user: {
                        dni: dni
                    }
                }
            })

        if(lastName !== undefined)
            filters.push({
                profile: {
                    user: {
                        lastName: {
                            contains: lastName,
                            mode: 'insensitive',
                        } as const
                    }
                }
            })
        if(exclude !== undefined)
            filters.push({
                profile: {
                    user: {
                        dni: {
                            not: {
                                in: exclude
                            }
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
