import {ParentWithUser} from "@/app/(loggedin)/parent/data";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function fetchParentsByStudentId(studentId: number) {
    const prisma = await getCurrentProfilePrismaClient();
    return prisma.parent.findMany({
        where: {
            children: {
                some: {
                    id: studentId
                }
            }
        },
        include: {
            user: true,
        }
    });
}