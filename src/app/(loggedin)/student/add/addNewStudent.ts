'use server';

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {ParentWithUser} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {hashPassword} from "@/lib/data/passwords";

export async function addStudent(phoneNumber: string, address: string, email: string, parents: ParentWithUser[], gradeName: string, name: string, surname: string, dni: number, birthDay : Date): Promise<ActionResult>  {
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

            console.log(JSON.stringify({
                data: {
                    birthdate : birthDay,
                    phoneNumber: phoneNumber,
                    grade: {
                        connect: {
                            name: gradeName
                        }
                    },
                    address: address,
                    parents: {
                        connect: parents.map((parent) => ({id: parent.id})),
                    },
                    profile: {
                        create: {
                            role: "Student",
                            user: {
                                create: {
                                    firstName: name,
                                    lastName: surname,
                                    dni: dni,
                                    passwordHash: await hashPassword(dni.toString())
                                }
                            },
                            email: email,
                        }
                    }
                }
            }, null, 2))

            const student = await prisma.student.create({
                data: {
                    birthdate : birthDay,
                    phoneNumber: phoneNumber,
                    grade: {
                        connect: {
                            name: gradeName
                        }
                    },
                    address: address,
                    parents: {
                        connect: parents.map((parent) => ({id: parent.id})),
                    },
                    profile: {
                        create: {
                            role: "Student",
                            user: {
                                create: {
                                    firstName: name,
                                    lastName: surname,
                                    dni: dni,
                                    passwordHash: await hashPassword(dni.toString())
                                }
                            },
                            email: email,
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








