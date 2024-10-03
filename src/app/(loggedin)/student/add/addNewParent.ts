'use server';
import {revalidatePath} from "next/cache";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";



export async function addParent(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number) {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        await prisma.$transaction(async (prisma) => {
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
            return 0;
        });
    } catch (error) {
        console.error("Error adding parent:", error);
        return -1;
    }
}

