'use server';

import {ActionResult, ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function addStudent(phoneNumber: string, address: string, email: string, parents: ParentWithUser[], gradeName: string, name: string, surname: string, dni: number, birthDay : Date): Promise<ActionResult>  {
    const prisma = await getCurrentProfilePrismaClient();
    let result: ActionResult;
    try {
        result = await prisma.$transaction(async (prisma) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    dni: dni
                }
            })
            if(existingUser)
                return {success: false, error: "Ya existe un alumno con ese dni"}

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

            const student = await prisma.student.create({
                data: {
                    birthdate : birthDay,
                    phoneNumber: phoneNumber,
                    email: email,
                    grade: {
                        connect: {
                            name: gradeName
                        }
                    },
                    address: address,
                    parents: {
                        connect: parents.map((parent) => ({id: parent.id})),
                    },
                    user: {
                        create: {
                            firstName: name,
                            lastName: surname,
                            dni: dni,
                            password: dni.toString()
                        }
                    }
                }
            });

            console.log(`Student created with ID: ${student.id}`);
            revalidatePath("/student");
            return {success: true}

        } );
    } catch (error) {
        console.error("Error adding student:", error);
        return {success: false, error: "Error al agregar el alumno"}
    }

    return result;
}








