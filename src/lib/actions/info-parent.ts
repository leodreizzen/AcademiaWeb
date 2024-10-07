import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchParentById(id: string) {
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
            children: {
                select: {
                    id: true,
                    dni: true,
                    grade: true,
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
    })
}