"use server"

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import randomNumber from "random-number-csprng";
import sendSignatureEmail from "@/lib/email/signature";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchParentById} from "@/lib/actions/info-parent";
import {fetchExamMarkById} from "@/lib/actions/exam-marks-fetch";
import {confirmSignatureTokenSent, getExistingSignatureToken, saveSignatureToken} from "@/lib/data/signature";
import {tokenCooldownSeconds} from "@/lib/signatureTokens";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export type SendTokenResult = {
    success: true,
    cooldownTime: number
} | {
    success: false
    errorType: "cooldown",
    cooldownTime: number
} | {
    success: false
    errorType: "sendFailed",
    errorMessage: string
}

async function getSignatureToken(): Promise<number> {
    return randomNumber(1000, 9999);
}


export async function sendExamMarkToken(examMarkId: number): Promise<SendTokenResult> {
    const token = await getSignatureToken();
    const profile = await fetchCurrentUser();
    if (!profile || profile.role !== "Parent")
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Usuario incorrecto"
        }
    const currentParent = await fetchParentById(profile.id.toString());
    if (!currentParent)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Usuario incorrecto"
        };
    const mark = await fetchExamMarkById(examMarkId);
    if (!mark)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Nota no encontrada"
        };
    if (!mark.student.parents.find(p => p.id === currentParent.id))
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "No eres padre de este alumno"
        };
    if (mark.signature)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "La nota ya está firmada"
        };

    const saveResult = await saveSignatureToken(token, mark.student, currentParent, {
        type: "examMark",
        examMarkId: examMarkId,
    })
    if (!saveResult.success)
        return saveResult;

    const sendResult = await sendSignatureEmail({
        parent: {
            ...currentParent.user,
            email: currentParent.email
        },
        student: mark.student.user,
        signatureCode: token,
        context: {
            type: "examMark",
            subjectName: mark.exam.subject.name,
            mark: mark.mark
        }
    });

    if (!sendResult.success)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Error al enviar el correo"
        };

    await confirmSignatureTokenSent(token, currentParent, {
        type: "examMark",
        examMarkId: examMarkId,
    }) // ignore errors as email was sent

    return {
        success: true,
        cooldownTime: tokenCooldownSeconds
    };
}

export async function sendReprimandToken(reprimandId: number): Promise<SendTokenResult> {
    return {
        success: true,
        cooldownTime: 600
    };
}

export async function signExamMark(token: number, examMarkId: number): Promise<ActionResult> {
    const profile = await fetchCurrentUser();
    if (!profile || profile.role !== "Parent")
        return {
            success: false,
            error: "Usuario incorrecto"
        }
    const currentParent = await fetchParentById(profile.id.toString());
    if (!currentParent)
        return {
            success: false,
            error: "Usuario incorrecto"
        };
    const mark = await fetchExamMarkById(examMarkId);
    if (!mark)
        return {
            success: false,
            error: "Nota no encontrada"
        };
    if (!mark.student.parents.find(p => p.id === currentParent.id))
        return {
            success: false,
            error: "No eres padre de este alumno"
        };
    if (mark.signature)
        return {
            success: false,
            error: "La nota ya está firmada"
        };

    return prisma.$transaction(async tx => {
        const existingToken = await getExistingSignatureToken({type: "examMark", examMarkId}, currentParent, tx);
        if (!existingToken || existingToken.token != token)
            return {
                success: false,
                error: "Código incorrecto"
            }
        await tx.signatureToken.delete({
            where: {
                id: existingToken.id
            }
        })
        await tx.signature.create({
            data: {
                parent: {
                    connect: {
                        id: currentParent.id
                    }
                },
                examMark: {
                    connect: {
                        id: examMarkId
                    }
                },
                signedAt: new Date()
                }
            })
        revalidatePath(`/exam-mark/exam/${examMarkId}`)
        return {
            success: true
        }
    })
}

export async function signReprimand(token: number, ReprimandId: number): Promise<ActionResult> {
    if (token < 5000)
        return {
            success: true,
        }
    else
        return {
            success: false,
            error: "Código inválido"
        }
}