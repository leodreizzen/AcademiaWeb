import {StudentWithUser} from "@/lib/definitions/student";
import prisma from "@/lib/prisma";
import {mapStudentWithUser} from "@/lib/data/mappings";

export async function fetchAllStudentsByGrade(grade: string): Promise<StudentWithUser[]> {
    const students = await prisma.student.findMany({
        where: {
            grade: {
                name: grade
            }
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            }
        }
    })
    return students.map(mapStudentWithUser)
}