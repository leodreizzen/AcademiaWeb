import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {ParentWithUserAndChildren} from "@/lib/definitions/parent";

export async function fetchParentById(id: string): Promise<ParentWithUserAndChildren | null> {
    const prisma = await getCurrentProfilePrismaClient()
    return prisma.parent.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            id: true,
            dni: true,
            phoneNumber: true,
            email: true,
            address: true,
            birthdate: true,
            role: true,
            children: {
                select: {
                    birthdate: true,
                    phoneNumber: true,
                    address: true,
                    gradeName: true,
                    id: true,
                    dni: true,
                    grade: true,
                    user: true,
                    role: true,
                    email: true
                }
            },
            user: true
        }
    })
}