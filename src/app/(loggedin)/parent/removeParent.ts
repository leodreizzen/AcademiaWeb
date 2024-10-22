'use server';
import {revalidatePath} from "next/cache";
import prisma from "@/lib/prisma";


export async function removeParent(id: number): Promise<string | null> {
    try {
        const parent = await prisma.parent.findUnique({
            where: {
                id
            },
            include: {
                children: true,
                profile: {
                    include: {
                        user: {
                            include: {
                                profiles: true
                            }
                        }
                    }
                }
            }
        });
        if(!parent) {
            console.error("Error fetching parent");
            return "El padre no existe";
        }
        const students = await prisma.student.findMany({
            where: {
                parents: {
                    some: {
                        id: parent.id
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

        await prisma.profile.delete({
            where: {
                id: parent.id
            }
        })


        if (parent.profile.user.profiles.length === 1) {
            await prisma.user.delete({
                where: {
                    dni: parent.profile.user.dni
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