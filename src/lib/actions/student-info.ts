"use server"
import {StudentWithUserAndParent} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {mapStudentWithUserAndParent} from "@/lib/data/mappings";


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