"use server"

import { revalidatePath } from "next/cache";
import { AdminQuery } from "./types";
import {ADMINS_PER_PAGE} from "@/lib/data/pagination";
import prisma from "@/lib/prisma";
import {AdministratorWithUser} from "@/lib/definitions/administrator";
import {mapAdministratorWithUser} from "@/lib/data/mappings";
import {Prisma} from "@prisma/client";
import AdministratorWhereInput = Prisma.AdministratorWhereInput;

export async function getAdmins({ page, dni, lastName }: AdminQuery): Promise<AdministratorWithUser[]> {
    try {
        const filters: AdministratorWhereInput[] = []

        if(dni !== undefined) {
            filters.push({
                profile: {
                    user: {
                        dni: dni
                    }
                }
            })
        }
        if(lastName !== undefined) {
            filters.push({
                profile: {
                    user: {
                        lastName: {
                            contains: lastName,
                            mode: 'insensitive'
                        }
                    }
                }
        })
        }

        const administrators = await prisma.administrator.findMany({
            skip: (page - 1) * ADMINS_PER_PAGE,
            take: ADMINS_PER_PAGE,
            where: {
                AND: filters
            },
            include: {
                profile: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return administrators.map(mapAdministratorWithUser);
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return [];
    }
}

export async function getTotalAdmins() {
    try {
        return await prisma.administrator.count();
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return 0;
    }
}

export async function removeAdmin(id: number) {
    try {
        const administrator = await prisma.administrator.findUnique({
            where: {
                id
            },
            include:{
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

        if (!administrator) {
            console.error("Error fetching administrator");
            return false;
        }

        await prisma.administrator.delete({
            where: {
                id
            }
        });
        await prisma.profile.delete({
            where: {
                id: administrator.profile.id
            }
        })

        if (administrator.profile.user.profiles.length === 1) {
            await prisma.user.delete({
                where: {
                    dni: administrator.profile.user.dni
                }
            });
        }
        revalidatePath("/admin");
        return true;
    } catch (error) {
        console.error("Error fetching administrators:", error);
        return false;
    }
}

export async function getAdmin(id: number): Promise<AdministratorWithUser | null> {
    const admin = await prisma.administrator.findFirst({
        where: {
            id: id
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            }
        }
    });
    return admin ? mapAdministratorWithUser(admin) : null;
}

export async function editAdmin(phoneNumber: string, address: string, email: string, name: string, lastname: string, id: number): Promise<boolean>  {
    try {
        return await prisma.$transaction(async (prisma) => {
            await prisma.administrator.update({
                data: {
                    phoneNumber: phoneNumber,
                    address: address,

                    profile: {
                        update: {
                            email: email,
                            user: {
                                update: {
                                    firstName: name,
                                    lastName: lastname
                                }
                            }
                        }
                    }
                },
                where: {
                    id: id
                }
            });
            revalidatePath("/admin");
            return true;
        } );
    } catch (error) {
        console.error("Error adding admin:", error);
        return false;
    }
}