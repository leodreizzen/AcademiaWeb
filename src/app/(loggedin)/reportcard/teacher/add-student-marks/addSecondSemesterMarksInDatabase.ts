"use server";
import { z } from "zod";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {SecondSemesterMarkListModel} from "@/lib/models/marks";
import {addSecondSemesterMarks} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/addSecondSemesterMarks";
export async function addSecondSemesterMarksInDatabase(_subjectId: number, _notas: z.infer<typeof SecondSemesterMarkListModel>): Promise<ActionResult> {
    try {
        const subjectId = z.number().int().safeParse(_subjectId);
        if(!subjectId.success){
            const errorMessage = "Por favor, corrija los siguientes errores: " + subjectId.error.errors.map((err: any) => err.message).join(", ");
            return { success: false, error: errorMessage };

        }
        const notas = SecondSemesterMarkListModel.safeParse(_notas); // Esto validará que cada nota esté entre 0 y 10
        if(!notas.success){
            const errorMessage = "Por favor, corrija los siguientes errores: " + notas.error.errors.map((err: any) => err.message).join(", ");
            return { success: false, error: errorMessage };
        }

        return await addSecondSemesterMarks(subjectId.data, notas.data)

    } catch (error) {
        return {
            success: false,
            error: "Error al cargar notas"
        }
    }
}