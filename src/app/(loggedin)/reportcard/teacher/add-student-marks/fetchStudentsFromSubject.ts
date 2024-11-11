import prisma from "@/lib/prisma";
import {mapStudentWithUser} from "@/lib/data/mappings";

export async function fetchStudentsFromSubject(id: number) {
    try {
        const students = await prisma.student.findMany({
            where: {
                grade: {
                    subjects: {
                        some: {
                            id: id
                        }
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
        return students.map(mapStudentWithUser)

    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}