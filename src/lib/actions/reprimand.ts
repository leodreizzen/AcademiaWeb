"use server"
import {ReprimandData, ReprimandModel} from "@/lib/models/reprimand";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {fetchCurrentUser} from "@/lib/data/users";
import sendReprimandEmail from "@/lib/email/reprimand";
import {fetchParentsByStudentId} from "@/lib/data/parent";
import fetchStudentById from "@/lib/actions/student-info";
import {Reprimand} from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createReprimand(formData: ReprimandData): Promise<ActionResult> {
    const data = ReprimandModel.safeParse(formData);
    if (!data.success)
        return {success: false, error: "Datos inválidos"}

    try {
        const user = await fetchCurrentUser();
        if (!user)
            return {success: false, error: "No se pudo obtener el usuario"}
        const res: { success: true, reprimand: Reprimand } | {
            success: false,
            error: string
        } = await prisma.$transaction(async tx => {
            const validStudents = await tx.student.count({
                where: {
                    id: {
                        in: data.data.students
                    }
                }
            })
            if (validStudents !== data.data.students.length)
                return {success: false, error: "Alguno de los estudiantes no existe"}

            const reprimand = await tx.reprimand.create({
                data: {
                    message: data.data.message,
                    teacher: {
                        connect: {
                            id: user.id
                        }
                    },
                    students: {
                        create: data.data.students.map(id => ({
                            student: {
                                connect: {
                                    id: id
                                }
                            }
                        }))
                    },
                }
            })
            return {success: true, reprimand: reprimand}
        });
        if (!res.success)
            return res

        try {
            for (const studentId of data.data.students) {
                const student = await fetchStudentById(studentId)
                const parents = await fetchParentsByStudentId(studentId);

                if (!student)
                    throw new Error("No se pudo obtener la información del alumno con id " + studentId)
                if (!parents)
                    throw new Error("No se pudo obtener la información de los padres del alumno con id " + studentId)

                for (const parent of parents) {
                    await sendReprimandEmail({...parent.user, email: parent.email}, student.user, res.reprimand);
                }
            }
        } catch (e) {
            console.error(e);
            return {
                success: false,
                error: "Ocurrió un error al enviar las notificaciones, pero la amonestación se creó correctamente"
            }
        }
        return {success: true}

    } catch (e) {
        console.error(e);
        return {success: false, error: "Ocurrió un error al crear la amonestación"}
    }


}