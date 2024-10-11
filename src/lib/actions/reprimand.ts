"use server"
import {ReprimandData, ReprimandModel} from "@/lib/models/reprimand";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {fetchCurrentUser} from "@/lib/data/users";


export async function CreateReprimand(formData: ReprimandData): Promise<ActionResult>{
    const data = ReprimandModel.safeParse(formData);
    if(!data.success)
        return {success: false, error: "Datos inválidos"}

    try {
        const user = await fetchCurrentUser();
        if (!user)
            return {success: false, error: "No se pudo obtener el usuario"}
        const prisma = await getCurrentProfilePrismaClient();
        return await prisma.$transaction( async tx => {
            const validStudents = await tx.student.count({
                where: {
                    id: {
                        in: data.data.students
                    }
                }
            })
            if (validStudents !== data.data.students.length)
                return {success: false, error: "Alguno de los estudiantes no existe"}

            await tx.reprimand.create({
                data: {
                    message: data.data.message,
                    teacher: {
                        connect: {
                            id: user.id
                        }
                    },
                    students: {
                        connect: data.data.students.map(id => ({id}))
                    },
                }
            })
            return {success: true}
        });
    } catch (e) {
        console.error(e);
        return {success: false, error: "Ocurrió un error al crear la amonestación"}
    }
}