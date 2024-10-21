import * as z from "zod";

export const ReprimandModel = z.object({
    grade: z.string({message: "Selecciona un curso"}),
    students: z.array(z.number().int("Datos incorrectos")).min(1, {
        message: "Selecciona al menos un estudiante",
    }),
    message: z.string().min(1, {
        message: "Escribe un mensaje"
    }),
})

export type ReprimandData = z.infer<typeof ReprimandModel>