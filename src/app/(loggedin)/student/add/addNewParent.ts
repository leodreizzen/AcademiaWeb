'use server';
import getPrismaClient from '@/app/lib/prisma';
import {revalidatePath} from "next/cache";



export async function addParent(phoneNumber: string, address: string, email: string, name: string, surname: string, dni: number) {
    const prisma = getPrismaClient({id: 1, role: "Administrator"});
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

