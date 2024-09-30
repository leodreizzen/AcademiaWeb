'use server';
import getPrismaClient from '@/app/lib/prisma';
import {ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
const prisma = getPrismaClient({id: 1, role: "Administrator"});


export async function addStudent(phoneNumber: string, address: string, email: string, parents: ParentWithUser[], gradeName: string, name: string, surname: string, dni: number) {
    try {
        await prisma.$transaction(async (prisma) => {
            const student = await prisma.student.create({
                data: {
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

         } );
    } catch (error) {
        console.error("Error adding student:", error);
    }
}








