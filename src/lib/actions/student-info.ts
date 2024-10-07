"use server"
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";


export default async function fetchStudentById(id: string) {
    const prisma = await getCurrentProfilePrismaClient()
    return prisma.student.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            dni: true,
            phoneNumber: true,
            address: true,
            email: true,
            grade: true,
            parents: {
                select: {
                    id: true,
                    dni: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}