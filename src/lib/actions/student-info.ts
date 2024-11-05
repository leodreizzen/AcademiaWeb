"use server"
import {StudentWithUserAndParent} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {mapStudentWithUser, mapStudentWithUserAndParent} from "@/lib/data/mappings";
import {StudentWithUser} from "@/lib/definitions/student";


export default async function fetchStudentById(id: number): Promise<StudentWithUserAndParent | null> {
    const student = await prisma.student.findUnique({
        where: {
            id: id
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            },
            parents: {
                include: {
                    profile: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    })

    return student ? mapStudentWithUserAndParent(student) : null;
}
