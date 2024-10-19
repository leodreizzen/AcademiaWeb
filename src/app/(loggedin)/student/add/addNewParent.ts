'use server';
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {ActionResult} from "@/app/(loggedin)/student/add/types";



export async function addParent(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number, birthDay : Date): Promise<ActionResult> {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        return await prisma.$transaction(async (prisma) => {
            const existingProfile = await prisma.profile.findFirst({
                where: {
                    dni: dni
                }
            })
            if(existingProfile){
                if(existingProfile.role == "Student" || existingProfile.role == "Parent"){
                    return {
                        success: false,
                        error: `Ya existe un ${existingProfile.role == "Student"? "alumno" : "responsable"} con ese dni`
                    }
                }
            }

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



            const parent = await prisma.parent.create({
                data: {
                    birthdate : birthDay,
                    phoneNumber: phoneNumber,
                    email: email,
                    address: address,
                    user: {
                        connectOrCreate: {
                            where: {
                                dni: dni
                            },
                            create: {
                                firstName: name,
                                lastName: surname,
                                dni: dni,
                                password: dni.toString()
                            }
                        }
                    }
                },
            });
            revalidatePath("/student/add")
            revalidatePath("/parent")
            console.log(`Parent created with ID: ${parent.id}`);
            return {
                success: true
            };
        });
    } catch (error) {
        console.error("Error adding parent:", error);
        return{
            success: false,
            error: "Error al agregar el padre"
        };
    }
}

