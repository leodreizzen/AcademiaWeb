"use server"


import {TeacherRegistrationData} from "@/lib/models/teacher-registration";
import prisma from "@/lib/prisma";
import {hashPassword} from "@/lib/data/passwords";
import { Prisma } from "@prisma/client";

type SuccessResponse = {
    success: true
}

type ErrorResponse = {
    success: false
    error: string
}

export type TeacherRegistrationResponse = SuccessResponse | ErrorResponse

type TeacherRegistrationDataWithGrades = TeacherRegistrationData & {assignedGrades: {[key: string]: string[]}}

export async function obtainGradesWithSubjects() {
    try {
        return await prisma.grade.findMany({
            select: {name: true, subjects: {select: {name: true}}}
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

export async function createTeacherRegistration(data: TeacherRegistrationDataWithGrades) {
    try {
        const res: TeacherRegistrationResponse = await prisma.$transaction(async tx => {
                const {assignedGrades, ...teacherData} = data

                const findTeacher = await tx.profile.findUnique({
                    where: {
                        dni_role: {
                            dni: teacherData.dni,
                            role: "Teacher"
                        }
                    }
                })

                if (findTeacher) {
                    return {success: false, error: "Teacher already exists"}
                }

                const teacher = await tx.teacher.create({
                        data: {
                            phoneNumber: teacherData.phoneNumber,
                            address: teacherData.address,
                            profile: {
                                create: {
                                    user: {
                                        create: {
                                            dni: teacherData.dni,
                                            firstName: teacherData.name,
                                            lastName: teacherData.lastName,
                                            passwordHash: await hashPassword(teacherData.dni.toString())
                                        }
                                    },
                                    role: "Teacher",
                                    email: teacherData.email
                                }
                            }
                        }
                    }
                )

                const subjects = []
                for (const grade in assignedGrades) {
                    for (const subject of assignedGrades[grade]) {
                        const findSubject = await tx.subject.findUniqueOrThrow({
                            where: {gradeName_name: {gradeName: grade, name: subject}}
                        })
                        subjects.push(findSubject)
                    }
                }

                await tx.teacher.update({
                    where: {id: teacher.id},
                    data: {
                        subjects: {
                            connect: subjects
                        }
                    }
                })

                return {success: true}
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable
            })
            return res
    } catch (e) {
        console.error(e)
        return {success: false, error: "Error interno al registrar el docente"}
    }
}