import {getRawPrismaClient} from "@/lib/prisma";
import {compare} from "bcryptjs";
import {Profile} from "@prisma/client";
import {ProfileRole, ProfileWithRole} from "@/lib/definitions";

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