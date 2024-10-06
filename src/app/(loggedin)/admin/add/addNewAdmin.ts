'use server';

import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function addAdmin(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number): Promise<ActionResult>  {
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
                return {success: false, error: "Ya existe un administrador con ese dni"}

            const admin = await prisma.administrator.create({
                data: {
                    phoneNumber: phoneNumber,
                    email: email,
                    address: address,
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

