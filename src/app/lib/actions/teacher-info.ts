import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export default async function getTeacherInfo(id: number) {
    const prisma = await getCurrentProfilePrismaClient()
    return prisma.teacher.findFirst({
        where: {
            id: id
        },
        select: {
            dni: true,
            phoneNumber: true,
            address: true,
            email: true,
            subjects: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
}