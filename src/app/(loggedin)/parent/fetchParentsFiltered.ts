'use server';

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";


export async function fetchParentsFiltered({dni, lastName}: {dni?: number, lastName?: string}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        if (dni) {
            const NUMBER_OF_PRODUCTS = 10;
            return await prisma.parent.findMany({
                skip: (page - 1) * NUMBER_OF_PRODUCTS,
                take: NUMBER_OF_PRODUCTS,
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
            return await prisma.parent.findMany({
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
        console.error("Error fetching parents:", error);
        return [];
    }
}