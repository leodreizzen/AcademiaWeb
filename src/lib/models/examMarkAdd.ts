import {z} from "zod";




export const ExamMarkModel = z.coerce.number({invalid_type_error: "Ingrese una nota válida."}).int("La nota debe ser entera.").min(1, "La nota no puede ser menor a 1").max(10, "La nota no puede ser mayor a 10").nullable()


export const StudentMarkModel = z.object({
    id: z.number(),
    name: z.string(),
    grade: ExamMarkModel,
})

export const ExamMarkAddModel = z.object({
    examDate: z.date({errorMap: (issue, {defaultError}) => ({
        message: issue.code === "invalid_date" ? "Ingrese una fecha válida" : defaultError,
        }), message: "Ingrese una fecha válida."}).max(new Date(), "La fecha no puede ser mayor a la actual"),

    examMarks: z.array(StudentMarkModel),
})




export type StudentMark = z.infer<typeof StudentMarkModel>

export type ExamMarkAdd = z.infer<typeof ExamMarkAddModel>