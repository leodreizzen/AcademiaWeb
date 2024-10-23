'use server';

import prisma from "@/lib/prisma";
import {StudentWithUser} from "@/lib/definitions/student";
import {mapStudentWithUser, PrismaStudentWithUser} from "@/lib/data/mappings";

export async function fetchStudentsFiltered({dni, lastName}: {
    dni?: number,
    lastName?: string
}, page: number): Promise<StudentWithUser[]> {
    try {
        let students: PrismaStudentWithUser[];
        if (dni !== undefined) {
            const NUMBER_OF_PRODUCTS = 10;
            students = await prisma.student.findMany({
                skip: (page - 1) * NUMBER_OF_PRODUCTS,
                take: NUMBER_OF_PRODUCTS,
                where: {
                    profile: {
                        user: {
                            dni: Number(dni)
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
            })
        } else {
            students = await prisma.student.findMany({
                where: {
                    profile: {
                        user: {
                            lastName: {
                                contains: lastName,
                                mode: 'insensitive',
                            },
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
            })
        }
        return students.map(mapStudentWithUser)
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}