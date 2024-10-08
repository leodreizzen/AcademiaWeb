"use server"

import { ADMINS_PER_PAGE } from "./adminConstants";
import { AdminQuery } from "./types";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";


export async function getAdmins({ page, dni, lastName }: AdminQuery) {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        return await prisma.administrator.findMany({
            skip: (page - 1) * ADMINS_PER_PAGE,
            take: ADMINS_PER_PAGE,
            where: {
                ...(dni && { dni: dni }),
                ...(lastName && {
                    user: {
                        lastName: {
                          contains: lastName,
                          mode: 'insensitive',
                        },
                    }
                }),
            },
            include: {
                user: true
            }
        });
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return [];
    }
}

export async function getTotalAdmins() {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        return await prisma.administrator.count();
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return 0;
    }
}

export async function removeAdmin(id: number) {
    try {
        const prisma = await getCurrentProfilePrismaClient();
        const administrator = await prisma.administrator.findUnique({
            where: {
                id
            }
        });
        await prisma.administrator.delete({
            where: {
                id
            }
        });
        const user = await prisma.user.findUnique({
            where: {
                dni: administrator!.dni
            },
            include: {
                profiles: true
            }
        });
        if (user?.profiles.length === 0) {
            await prisma.user.delete({
                where: {
                    dni: administrator!.dni
                }
            });
        }
        return true;
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return false;
    }
}

export async function getAdmin(id: number) {
    const prisma = await getCurrentProfilePrismaClient()
    return prisma.administrator.findFirst({
        where: {
            id: id
        },
        select: {
            dni: true,
            phoneNumber: true,
            address: true,
            email: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}