import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchAllStudentsByGrade(grade: string) {
    const prisma = await getCurrentProfilePrismaClient();
    return prisma.student.findMany({
        where: {
            grade: {
                name: grade
            }
        },
        include: {
            user: true
        }
    })
}