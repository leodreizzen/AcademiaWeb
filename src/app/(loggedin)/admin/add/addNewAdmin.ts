'use server';

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import prisma from "@/lib/prisma";
import {hashPassword} from "@/lib/data/passwords";

export async function addAdmin(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number): Promise<ActionResult>  {
    let result: ActionResult;
    try {
        result = await prisma.$transaction(async (prisma) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    dni: dni
                }
            })
            if(existingUser)
                return {success: false, error: "Ya existe un administrador con ese dni"}

            const admin = await prisma.administrator.create({
                data: {
                    phoneNumber: phoneNumber,
                    address: address,
                    profile: {
                        create: {
                            user: {
                                create: {
                                    firstName: name,
                                    lastName: surname,
                                    dni: dni,
                                    passwordHash: await hashPassword(dni.toString())
                                }
                            },
                            role: "Administrator",
                            email: email
                        }
                    }

                }
            });
            console.log(`Admin created with ID: ${admin.id}`);
            revalidatePath("/admin");
            return {success: true}
        } );
    } catch (error) {
        console.error("Error adding admin:", error);
        return {success: false, error: "Error al agregar el admin"}
    }

    return result;
}

