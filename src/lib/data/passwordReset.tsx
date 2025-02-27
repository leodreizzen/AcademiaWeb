import {PasswordResetToken, User} from "@prisma/client";
import crypto from "crypto"
import prisma from "../prisma";
import {hashPassword} from "@/lib/data/passwords";
import {UserWithoutPassword} from "@/lib/definitions";

export async function fetchUserByEmail(email: string): Promise<UserWithoutPassword | null> {
    const students = await prisma.profile.findMany({
        where: {
            email: email
        },
        include: {
            user: true,
        }
    })
    if (students.length === 0)
        return null;
    else
        return students[0].user;
}

export async function createPasswordResetToken(user: UserWithoutPassword): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('base64');
    await prisma.passwordResetToken.upsert({
        create: {
            token_hash: tokenHash,
            user: {
                connect: {
                    dni: user.dni
                }
            }
        },
        update: {
            token_hash: tokenHash,
            issued_at: new Date(),
            used: false
        },
        where: {
            dni: user.dni
        }
    });
    return token;
}

function fetchPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
    return prisma.passwordResetToken.findUnique({
        where: {
            token_hash: crypto.createHash('sha256').update(token).digest('base64')
        }
    });
}

export async function checkPasswordResetToken(token: string): Promise<boolean> {
    const savedToken = await fetchPasswordResetToken(token);
    if (!savedToken)
        return false;
    else
        return passwordTokenValid(savedToken);
}

function passwordTokenValid(token: PasswordResetToken): boolean {
    return !token.used && new Date().getTime() - token.issued_at.getTime() < 1000 * 60 * 60 * 24
}

export type ResetPasswordResult = {
    success: true
} | {
    success: false
    error: string
}

export async function resetPassword(token: string, password: string): Promise<ResetPasswordResult> {
    return prisma.$transaction(async tx => {
        try {
            const saved_token = await fetchPasswordResetToken(token);
            if (!saved_token || !passwordTokenValid(saved_token))
                return {success: false, error: "Token inválido"};

            await tx.user.update({
                where: {
                    dni: saved_token.dni
                },
                data: {
                    passwordHash: await hashPassword(password)
                }
            });
            await tx.passwordResetToken.update({
                where: {
                    dni: saved_token.dni
                },
                data: {
                    used: true
                }
            });
            return {success: true};
        } catch (e) {
            return {success: false, error: "Se ha producido un error. Vuelve a intentar más tarde"}
        }
    }, {isolationLevel: "Serializable"});
}