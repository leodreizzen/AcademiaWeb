import {ParentWithUser} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {mapParentWithUser} from "@/lib/data/mappings";

export async function fetchParentsByStudentId(studentId: number): Promise<ParentWithUser[]> {
    const parents =  await prisma.parent.findMany({
        where: {
            children: {
                some: {
                    id: studentId
                }
            }
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            }
        }
    });
    return parents.map(mapParentWithUser)
}