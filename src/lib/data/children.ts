import {auth} from "@/auth";
import { Prisma } from "@prisma/client";
import {StudentWithUser} from "@/lib/definitions/student";
import prisma from "@/lib/prisma";
import {mapStudentWithUser, mapStudentWithUserAndParent} from "@/lib/data/mappings";
import {StudentWithUserAndParent} from "@/lib/definitions/parent";

export async function fetchCurrentUserChildren() {
    const profile = (await auth())?.user;
    if(!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if(profile.role !== "Parent")
        throw new Error("User is not a parent");

    return fetchChildrenByParentDni(profile.dni);
}

export async function fetchChildrenByParentDni(dni: number): Promise<StudentWithUser[]> {
    const children = await prisma.student.findMany({
        where: {
            parents: {
                some: {
                    profile:{
                        user:{
                            dni: dni
                        }
                    }
                }
            }
        }, include: {
            profile: {
                include: {
                    user: true
                }
            }
        }
    });
    return children.map(mapStudentWithUser)
}

export async function fetchSelectedChild(): Promise<StudentWithUser | null> {
    const profile = (await auth())?.user;
    if (!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if (profile.role !== "Parent")
        throw new Error("User is not a parent");
    if (!profile.selectedChildId) {
        console.error("User has no selected child");
        throw new Error("User has no selected child");
    }

    const student = await prisma.student.findUnique({
        where: {
            id: profile.selectedChildId
        },
        include: {
            profile: {
                include: {
                   user: true
                }
            }
        }
    });

    return student ? mapStudentWithUser(student) : null;
}

export async function countCurrentUserChildren(){
    const profile = (await auth())?.user;
    if (!profile || !profile.role || !profile.dni)
        throw new Error("User has no role or dni");
    if (profile.role !== "Parent")
        throw new Error("User is not a parent");

    return prisma.student.count({
        where: {
            parents: {
                some: {
                    profile: {
                        dni: profile.dni
                    }
                }
            }
        }
    });
}