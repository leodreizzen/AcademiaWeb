import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Ingrese un dni válido para el estudiante";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const StudentSchemaWithoutGrade = z.object({
    firstName: z.string().min(1, {message: "Ingrese un nombre válido para el estudiante"}),
    lastName: z.string().min(1, {message: "Ingrese un apellido válido para el estudiante"}),
    email: z.string().email({message: "Ingrese un email válido para el estudiante"}),
    dni: dniSchema,
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el estudiante"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida para el estudiante"}),
});
export const StudentSchema = StudentSchemaWithoutGrade.extend({
    gradeName: z.string().min(1, {message: "Ingrese un año válido para el estudiante"}),
})

const dniMessageParent = "Ingrese un dni válido para el responsable";
export const ParentSchema = z.object({
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el responsable"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida para el responsable"}),
    name: z.string().min(1, {message: "Ingrese un nombre válido para el responsable"}),
    surname: z.string().min(1, {message: "Ingrese un apellido válido para el responsable"}),
    dni: z.coerce.number({message: dniMessageParent}).min(minDigits(7), {message: dniMessageParent}).max(maxDigits(9), {message: dniMessageParent}),
    email: z.string().email({message: "Ingrese un email válido para el responsable"}),
});


export type StudentDataWithoutGrade = z.infer<typeof StudentSchemaWithoutGrade>
export type StudentData = z.infer<typeof StudentSchema>
export type ParentData = z.infer<typeof ParentSchema>