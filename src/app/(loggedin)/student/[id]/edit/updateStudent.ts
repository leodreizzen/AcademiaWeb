'use server';

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {ParentWithUser} from "@/lib/definitions/parent";

export async function updateStudent(id: number, phoneNumber: string, address: string, email: string, parents: ParentWithUser[], gradeName: string, name: string, surname: string, dni: number, birthDay : Date): Promise<ActionResult>  {
    const prisma = await getCurrentProfilePrismaClient();
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

            const updatedStudent = await prisma.student.update({
                where: {
                    id: id
                },
                data: {
                    birthdate: birthDay,
                    phoneNumber: phoneNumber,
                    email: email,
                    address: address,
                    grade: {
                        connect: {
                            name: gradeName
                        }
                    },

                    parents: {
                        set: parents.map((parent) => ({ id: parent.id })), // Update parent IDs if needed
                    },
                    user: {
                        update: {
                            firstName: name,
                            lastName: surname,
                        }
                    }
                }
            });

            console.log(`Student updated with ID: ${updatedStudent.id}`);
            revalidatePath("/student");
            revalidatePath(`/student/edit/${updatedStudent.id}`);
            revalidatePath(`/student/${updatedStudent.id}`);
            return {success: true}

        } );
    } catch (error) {
        console.error("Error updating student:", error);
        return {success: false, error: "Error al modificar el alumno"}
    }

    return result;
}