'use server';

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {ParentWithUser} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {Subject} from "@prisma/client";

export async function updateTeacher(id: number, phoneNumber: string, address: string, email: string, subjects: Subject[], name: string, surname: string, dni: number): Promise<ActionResult>  {
    let result: ActionResult;
    try {
        result = await prisma.$transaction(async (prisma) => {
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
            const updateTeacher = await prisma.teacher.update({
                where: {
                    id: id
                },
                data: {
                    phoneNumber: phoneNumber,
                    address: address,

                    subjects: {
                        set: subjects.map((subject) => ({ id: subject.id })), // Update parent IDs if needed
                    },
                    profile: {
                        update: {
                            email: email,
                            user: {
                                update: {
                                    firstName: name,
                                    lastName: surname,
                                }
                            }
                        }
                    }
                }
            });

            console.log(`Student updated with ID: ${updateTeacher.id}`);
            revalidatePath("/teacher");
            revalidatePath(`/teacher/${updateTeacher.id}/edit`);
            revalidatePath(`/teacher/${updateTeacher.id}`);
            return {success: true}

        } );
    } catch (error) {
        console.error("Error updating teacher:", error);
        return {success: false, error: "Error al modificar el docente"}
    }

    return result;
}
