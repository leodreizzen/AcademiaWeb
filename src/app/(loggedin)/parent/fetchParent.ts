'use server';

import {ParentWithUser} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {mapParentWithUser} from "@/lib/data/mappings";

export async function fetchParents(page: number): Promise<ParentWithUser[]> {
    const NUMBER_OF_PRODUCTS = 10;
    try {
        const parents =  await prisma.parent.findMany({
            skip: (page - 1) * NUMBER_OF_PRODUCTS,
            take: NUMBER_OF_PRODUCTS,
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return parents.map(mapParentWithUser)
    } catch (error) {
        console.error("Error fetching parents:", error);
        return [];
    }
}

export async function countParents() {
    try {
        return await prisma.parent.count();
    } catch (error) {
        console.error("Error counting parents:", error);
        return 0;
    }
}