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
import {fetchReprimandById} from "@/app/(loggedin)/reprimand/fetchReprimands";
import {fetchSelectedChild} from "@/lib/data/children";
import {z} from "zod";

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


export async function sendExamMarkToken(_examMarkId: number): Promise<SendTokenResult> {
    const validation = z.number().int().min(0).safeParse(_examMarkId);
    if(!validation.success)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Datos inválidos"
        };
    const examMarkId = validation.data
    try {
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
    } catch (e) {
        console.error(e);
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Ocurrió un error"
        }
    }
}

export async function sendReprimandToken(_reprimandId: number): Promise<SendTokenResult> {
    const validation = z.number().int().min(0).safeParse(_reprimandId);
    if(!validation.success)
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Datos inválidos"
        };
    const reprimandId = validation.data
    try {
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
        const reprimand = await fetchReprimandById(reprimandId);
        if (!reprimand)
            return {
                success: false,
                errorType: "sendFailed",
                errorMessage: "Amonestación no encontrada"
            };

        const currentStudent = await fetchSelectedChild();
        if (!currentStudent)
            return {
                success: false,
                errorType: "sendFailed",
                errorMessage: "No hay un alumno seleccionado"
            };

        const reprimandStudent = reprimand.students.find(s => s.student.id === currentStudent.id);
        if (!reprimandStudent)
            return {
                success: false,
                errorType: "sendFailed",
                errorMessage: "No eres padre de este alumno"
            };

        if (reprimandStudent.signature)
            return {
                success: false,
                errorType: "sendFailed",
                errorMessage: "La amonestación ya está firmada"
            };

        const saveResult = await saveSignatureToken(token, currentStudent, currentParent, {
            type: "reprimand",
            reprimandId: reprimand.id,
        })
        if (!saveResult.success)
            return saveResult;

        const sendResult = await sendSignatureEmail({
            parent: {
                ...currentParent.user,
                email: currentParent.email
            },
            student: currentStudent.user,
            signatureCode: token,
            context: {
                type: "reprimand",
                date: reprimand.dateTime,
                sanctionReason: reprimand.message
            }
        });

        if (!sendResult.success)
            return {
                success: false,
                errorType: "sendFailed",
                errorMessage: "Error al enviar el correo"
            };

        await confirmSignatureTokenSent(token, currentParent, {
            type: "reprimand",
            reprimandId: reprimand.id,
        }) // ignore errors as email was sent

        return {
            success: true,
            cooldownTime: tokenCooldownSeconds
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Ocurrió un error"
        }
    }
}

export async function signExamMark(_token: number, _examMarkId: number): Promise<ActionResult> {
    const tokenValidation = z.number().int().min(0).safeParse(_token);
    const examMarkIdValidation = z.number().int().min(0).safeParse(_examMarkId);
    if(!tokenValidation.success || !examMarkIdValidation.success)
        return {
            success: false,
            error: "Datos inválidos"
        };
    const token = tokenValidation.data;
    const examMarkId = examMarkIdValidation.data;
    try {
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
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "Ocurrió un error"
        }
    }
}

export async function signReprimand(_token: number, _reprimandId: number): Promise<ActionResult> {
    const tokenValidation = z.number().int().min(0).safeParse(_token);
    const reprimandIdValidation = z.number().int().min(0).safeParse(_reprimandId);
    if(!tokenValidation.success || !reprimandIdValidation.success)
        return {
            success: false,
            error: "Datos inválidos"
        };
    const token = tokenValidation.data;
    const reprimandId = reprimandIdValidation.data;
    try {
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
        const reprimand = await fetchReprimandById(reprimandId);
        if (!reprimand)
            return {
                success: false,
                error: "Amonestación no encontrada"
            };

        const currentStudent = await fetchSelectedChild();
        if (!currentStudent)
            return {
                success: false,
                error: "No hay un alumno seleccionado"
            };

        const reprimandStudent = reprimand.students.find(s => s.student.id === currentStudent.id);
        if (!reprimandStudent)
            return {
                success: false,
                error: "No eres padre de este alumno"
            };

        if (reprimandStudent.signature)
            return {
                success: false,
                error: "La amonestación ya está firmada"
            };



        return prisma.$transaction(async tx => {
            const existingToken = await getExistingSignatureToken({type: "reprimand", reprimandId}, currentParent, tx);
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
                    reprimand: {
                        connect: {
                            studentId_reprimandId: {
                                studentId: currentStudent.id,
                                reprimandId: reprimandId
                            }
                        }
                    },
                    signedAt: new Date()
                }
            })
            revalidatePath(`/reprimand/${reprimandId}`)
            return {
                success: true
            }
        })
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "Ocurrió un error"
        }
    }
}