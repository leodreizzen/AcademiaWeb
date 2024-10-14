import {auth} from "@/auth";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import { Prisma } from "@prisma/client";
import {EnhancedPrismaClient} from "@/lib/definitions";
import {StudentWithUser} from "@/app/(loggedin)/student/data";

export async function fetchCurrentUserChildren() {
    const profile = (await auth())?.user;
    if(!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if(profile.role !== "Parent")
        throw new Error("User is not a parent");

    return fetchChildrenByParentDni(profile.dni);
}

export async function fetchChildrenByParentDni(dni: number, prisma?: EnhancedPrismaClient) {
    if(!prisma)
        prisma = await getCurrentProfilePrismaClient();
    const res = await prisma.student.findMany({
        where: {
            parents: {
                some: {
                    delegate_aux_profile: {
                        dni: dni
                    }
                } as Prisma.ParentWhereInput
            }
        }, include: {
            user: true
        }
    });

    return res.map(student =>(
        {
            dni: student.dni,
            id: student.id,
            firstName: student.user.firstName,
            lastName: student.user.lastName
        }
    ))
}

export async function fetchSelectedChild(): Promise<StudentWithUser | null> {
    const prisma = await getCurrentProfilePrismaClient();
    const profile = (await auth())?.user;
    if (!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if (profile.role !== "Parent")
        throw new Error("User is not a parent");
    if (!profile.selectedChildId) {
        console.error("User has no selected child");
        throw new Error("User has no selected child");
    }

    return prisma.student.findUnique({
        where: {
            id: profile.selectedChildId
        },
        include: {
            user: true
        }
    });
}

export async function countCurrentUserChildren(){

    const prisma = await getCurrentProfilePrismaClient();
    const profile = (await auth())?.user;
    if (!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if (profile.role !== "Parent")
        throw new Error("User is not a parent");

    return prisma.student.count({
        where: {
            parents: {
                some: {
                    delegate_aux_profile: {
                        dni: profile.dni
                    }
                } as Prisma.ParentWhereInput
            }
        }
    });
}