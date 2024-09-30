import getPrismaClient from "@/app/lib/prisma";

const prisma = getPrismaClient({role: "Superuser", id: 1})

export default async function getTeacherInfo(id: string) {
    return prisma.teacher.findUnique({
        where: {
            id: parseInt(id)
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