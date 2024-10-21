'use server';

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { Student } from "@prisma/client";
import { StudentWithUser } from "../student/data";
import {revalidatePath} from "next/cache";


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
        if (students.some((x: any) => x.parents.length === 1)) {
            return "No se puede eliminar, hay estudiantes con un solo padre";
        }
        await prisma.parent.delete({
            where: {
                id
            }
        });
        const user = await prisma.user.findUnique({
            where: {
                dni: parent!.dni
            },
            include: {
                profiles: true
            }
        });
        if (user?.profiles.length === 0) {
            await prisma.user.delete({
                where: {
                    dni: parent!.dni
                }
            });
        }
        revalidatePath("/parent");
        return null;
    } catch (error: any) {
        console.error("Error fetching parent:", error);
        return null;
    }
}