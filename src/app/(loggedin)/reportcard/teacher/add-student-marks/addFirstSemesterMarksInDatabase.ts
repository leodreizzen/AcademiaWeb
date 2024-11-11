"use server";
import { z } from "zod";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {addFirstSemesterMarks} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/addFirstSemesterMarks";
import {FirstSemesterMarkListModel, FirstSemesterMarkModel} from "@/lib/models/marks";

export async function addFirstSemesterMarksInDatabase(_subjectId: number, _notas: z.infer<typeof FirstSemesterMarkListModel>): Promise<ActionResult> {
    try {
        const subjectId = z.number().int().safeParse(_subjectId);
        if(!subjectId.success){
            const errorMessage = "Por favor, corrija los siguientes errores: " + subjectId.error.errors.map((err: any) => err.message).join(", ");
            return { success: false, error: errorMessage };

        }
        const notas = FirstSemesterMarkModel.safeParse(_notas);
        if(!notas.success){
            const errorMessage = "Por favor, corrija los siguientes errores: " + notas.error.errors.map((err: any) => err.message).join(", ");
            return { success: false, error: errorMessage };
        }

        return await addFirstSemesterMarks(subjectId.data, notas.data)

    } catch (error) {
        return {
            success: false,
            error: "Error al cargar notas"
        }
    }
}