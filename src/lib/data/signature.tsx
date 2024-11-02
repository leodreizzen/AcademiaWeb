import {SignatureToken} from "@prisma/client";
import {ParentWithUser} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {TransactionPrismaClient} from "@/lib/definitions";
import {SendTokenResult} from "@/lib/actions/signatures";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {tokenCooldownTimeRemaining, tokenOnCooldown} from "@/lib/signatureTokens";

export type SignatureTokenContext = {
    type: "examMark"
    examMarkId: number
} | {
    type: "reprimand"
    reprimandId: number
}

export type SaveTokenResult = Exclude<SendTokenResult, {success: true}> |{
    success: true
}



export async function confirmSignatureTokenSent(token: number, parent: ParentWithUser, context: SignatureTokenContext): Promise<ActionResult> {
    try{
        return prisma.$transaction(async tx => {
            const existingToken = await getExistingSignatureToken(context, parent)
            if (!existingToken || existingToken.token != token)
                return {
                    success: false,
                    error: "Token incorrecto"
                }
            await tx.signatureToken.update({
                where: {
                    id: existingToken.id
                },
                data: {
                    sentSuccessfully: true
                }
            })
            return {
                success: true
            }
        })
    } catch (e){
        console.error(e);
        return {
            success: false,
            error: "Error al confirmar el token"
        }
    }
}


export async function saveSignatureToken(token: number, parent: ParentWithUser, context: SignatureTokenContext): Promise<SaveTokenResult> {
    try{
        return prisma.$transaction(async tx => {
            const existingToken = await getExistingSignatureToken(context, parent, tx)
            if (existingToken){
                if(existingToken.sentSuccessfully && tokenOnCooldown(existingToken.issued_at))
                    return {
                        success: false,
                        errorType: "cooldown",
                        cooldownTime: tokenCooldownTimeRemaining(existingToken.issued_at)
                    }
                else {
                    await tx.signatureToken.update({
                        where: {
                            id: existingToken.id
                        },
                        data: {
                            token,
                            issued_at: new Date(),
                        }
                    })
                    return {
                        success: true
                    }
                }
            } else {
                await tx.signatureToken.create({
                    data: {
                        token,
                        parent: {
                            connect: {
                                id: parent.id
                            }
                        },
                        examMark: context.type == "examMark" ? {
                            connect: {
                                id: context.examMarkId
                            }
                        }: undefined,
                        reprimand: context.type == "reprimand" ? {
                            connect: {
                                id: context.reprimandId
                            }
                        }: undefined,
                    }
                })
                return {
                    success: true
                }
            }
        })
    } catch (e){
        console.error(e);
        return {
            success: false,
            errorType: "sendFailed",
            errorMessage: "Error al guardar el token"
        }
    }

}

export async function getExistingSignatureToken(context: SignatureTokenContext, parent: ParentWithUser, prismaClient: TransactionPrismaClient = prisma): Promise<SignatureToken | null> {
    if(context.type == "examMark"){
        return prismaClient.signatureToken.findFirst({
            where: {
                parent: {
                    id: parent.id
                },
                examMark: {
                    id: context.examMarkId
                }
            }
        })
    }
    else if(context.type == "reprimand"){
        return prismaClient.signatureToken.findFirst({
            where: {
                parent: {
                    id: parent.id
                },
                reprimand: {
                    id: context.reprimandId
                }
            }
        })
    }
    else
        throw new Error("Invalid context type")
}