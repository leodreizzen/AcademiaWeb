import {compare} from "bcryptjs";
import {Profile} from "@prisma/client";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {PrismaProfileWithUser} from "@/lib/data/mappings";

export enum LoginError {
    USER_NOT_FOUND,
    PASSWORD_INCORRECT
}

export type CheckLoginResult = {
    success: true
} | {
    success: false
    error: LoginError
}

export async function checkLogin(dni: number, password: string): Promise<CheckLoginResult> {
    const user = await prisma.user.findUnique({
        where: {
            dni: dni
        },
        omit: {
            passwordHash: false
        }
    })
    if (!user)
        return {
            success: false,
            error: LoginError.USER_NOT_FOUND
        }

    const passwordCorrect = await compare(password, user.passwordHash)
    if(!passwordCorrect)
        return {
            success: false,
            error: LoginError.PASSWORD_INCORRECT
        }

    return {
        success: true
    }
}

export async function fetchUserProfiles(dni: number): Promise<Profile[]> {
    return prisma.profile.findMany({
        where: {
            dni: dni
        }
    });
}

export async function fetchCurrentUser(): Promise<PrismaProfileWithUser | null> {
    const session = await auth();
    if(!session || !session.user?.role || !session.user?.dni)
        return null;

    return prisma.profile.findUnique({
        where: {
            dni_role: {
                dni: session.user.dni,
                role: session.user.role
            }
        },
        include: {
            user: true,
        }
    });
}