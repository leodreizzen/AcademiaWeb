"use server"
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {StudentWithUserAndParent} from "@/lib/definitions/parent";


export default async function fetchStudentById(id: number): Promise<StudentWithUserAndParent | null> {
    const prisma = await getCurrentProfilePrismaClient()
    return prisma.student.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            dni: true,
            phoneNumber: true,
            address: true,
            email: true,
            grade: true,
            gradeName: true,
            role: true,
            birthdate: true,
            parents: {
                select: {
                    id: true,
                    dni: true,
                    user: true,
                    birthdate: true,
                    email: true,
                    role: true,
                    phoneNumber: true,
                    address: true
                }
            },
            user: true
        }
    });
}