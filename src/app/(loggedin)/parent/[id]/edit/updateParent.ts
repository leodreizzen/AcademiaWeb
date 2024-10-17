"use server"
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {ActionResult} from "@/app/(loggedin)/student/add/types";

export async function updateParent(id: number, phoneNumber: string, address: string, email: string, firstName: string, lastName: string, dni: number, birthDay : Date): Promise<ActionResult> {
    const prisma = await getCurrentProfilePrismaClient();
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
                    email: email,
                    address: address,
                    user: {
                        update: {
                            firstName: firstName,
                            lastName: lastName,
                        }
                    }
                }
            });
            revalidatePath("/student/add")
            revalidatePath("/parent")
            revalidatePath(`/parent/edit/${updatedParent.id}`)
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