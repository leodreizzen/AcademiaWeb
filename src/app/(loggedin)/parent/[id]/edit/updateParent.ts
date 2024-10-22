"use server"
import {revalidatePath} from "next/cache";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import prisma from "@/lib/prisma";

export async function updateParent(id: number, phoneNumber: string, address: string, email: string, firstName: string, lastName: string, dni: number, birthDay : Date): Promise<ActionResult> {
    try {
        return await prisma.$transaction(async (prisma) => {
            const existingUserEmail = await prisma.profile.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { email: email },
                                { role: "Administrator" }
                            ]
                        },
                        {
                            AND: [
                                { email: email },
                                { dni: { not: dni } }
                            ]
                        }
                    ]
                }
            });
            if(existingUserEmail){
                const messageError = existingUserEmail.role == "Administrator" ? "El email de un administrador no se puede compartir entre perfiles" : "El email ya está en uso por otro usuario"
                return {
                    success: false,
                    error: messageError
                }
            }



            const updatedParent = await prisma.parent.update({
                where: {
                    id: id
                },
                data: {
                    birthdate: birthDay,
                    phoneNumber: phoneNumber,
                    address: address,
                    profile: {
                        update: {
                            email: email,
                            user: {
                                update: {
                                    firstName: firstName,
                                    lastName: lastName,
                                }
                            }
                        }
                    }
                }
            });
            revalidatePath("/student/add")
            revalidatePath("/parent")
            revalidatePath(`/parent/${updatedParent.id}/edit`)
            console.log(`Parent editing with ID: ${updatedParent.id}`);
            return {
                success: true
            };
        });
    } catch (error) {
        console.error("Error editing parent:", error);
        return{
            success: false,
            error: "Error al modificar el responsable"
        };
    }
}