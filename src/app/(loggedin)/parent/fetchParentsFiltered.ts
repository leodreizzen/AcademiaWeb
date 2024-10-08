'use server';

import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";


export async function fetchParentsFiltered({dni, lastName}: {dni?: number, lastName?: string}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    try {
        if (lastName) {
            const NUMBER_OF_PRODUCTS = 10;
            return await prisma.parent.findMany({
                skip: (page - 1) * NUMBER_OF_PRODUCTS,
                take: NUMBER_OF_PRODUCTS,
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
        } else if(dni){
            return await prisma.parent.findMany({
                where: {
                    user: {
                        dni: Number(dni)
                    }
                },
                include : {
                    user: true
                }
            })
        }
        else{
            const NUMBER_OF_PRODUCTS = 10;
            return await prisma.parent.findMany({
                skip: (page - 1) * NUMBER_OF_PRODUCTS,
                take: NUMBER_OF_PRODUCTS,
                include: {
                    user: true
                }
            });
        }
    }
    catch(error)
    {
        console.error("Error fetching parents:", error);
        return [];
    }
}

