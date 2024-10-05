'use server';
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {ActionResult} from "@/app/(loggedin)/student/add/types";



export async function addParent(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number): Promise<ActionResult> {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        return await prisma.$transaction(async (prisma) => {
            const existingProfile = await prisma.profile.findFirst({
                where: {
                    OR:[
                        {
                            dni: dni,
                            role: "Student"
                        },
                        {
                            dni: dni,
                            role: "Parent",
                        }
                    ]
                }
            })
            if(existingProfile)
                return {
                    success: false,
                    error: `Ya existe un ${existingProfile.role == "Parent"? "padre" : "alumno"} con ese dni`
                }

            const parent = await prisma.parent.create({
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

