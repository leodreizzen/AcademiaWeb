'use server';

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";


export async function removeParent(id: number): Promise<string | null> {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        const parent = await prisma.parent.findUnique({
            where: {
                id
            },
            include: {
                children: true
            }
        });
        const students = await prisma.student.findMany({
            where: {
                parents: {
                    some: {
                        id: parent!.id
                    }
                }
            },
            include: {
                parents: true
            }
        });
        if (students.some(x => x.parents.length === 1)) {
            return "No se puede eliminar, hay estudiantes con un solo padre";
        }
        await prisma.parent.delete({
            where: {
                id
            }
        });
        return null;
    } catch (error: any) {
        console.error("Error fetching parent:", error);
        return null;
    }
}