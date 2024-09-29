import getPrismaClient, {getRawPrismaClient} from "@/lib/prisma";
import {compare} from "bcryptjs";
import {Profile, Superuser} from "@prisma/client";
import {ProfileRole, ProfileWithRole} from "@/lib/definitions";
import {User} from "next-auth";
import {auth} from "@/auth";

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
    const prisma = getRawPrismaClient();
    const user = await prisma.user.findUnique({
        where: {
            dni: dni
        }
    })
    if (!user)
        return {
            success: false,
            error: LoginError.USER_NOT_FOUND
        }

    const passwordCorrect = await compare(password, user.password)
    if(!passwordCorrect)
        return {
            success: false,
            error: LoginError.PASSWORD_INCORRECT
        }

    return {
        success: true
    }
}

export async function fetchUserProfiles(dni: number): Promise<ProfileWithRole[]> {
    const prisma = getRawPrismaClient();
    const profiles = await prisma.profile.findMany({
        where: {
            dni: dni
        }
    });
    return profiles as (Profile & {role: ProfileRole})[]
}

export async function fetchCurrentUser(): Promise<ProfileWithRole | null> {
    const session = await auth();
    if(!session || !session.user?.role || !session.user?.dni)
        return null;

    const prisma = getPrismaClient({id: session.user.dni, role: session.user.role});
    const user =  prisma.profile.findUnique({
        where: {
            id: session.user.dni,
            role: session.user.role
        },
        include: {
            user: true
        }
    });
    return ;
}