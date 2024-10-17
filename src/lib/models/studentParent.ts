import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";


const dniMessage = "Ingrese un dni válido para el estudiante";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

function calculateAge(date: Date) {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate()
        < birthDate.getDate())) {
        age--;

    }
    return age;
}

export const StudentSchemaWithoutGrade = z.object({
    firstName: z
        .string()
        .min(1, { message: "Ingrese un nombre válido para el estudiante" })
        .regex(/\S+\s*\S*/, { message: "El nombre debe contener al menos un carácter no espacio" }),
    lastName: z
        .string()
        .min(1, { message: "Ingrese un apellido válido para el estudiante" })
        .regex(/\S+\s*\S*/, { message: "El apellido debe contener al menos un carácter no espacio" }),
    email: z.string().email({message: "Ingrese un email válido para el estudiante"}),
    dni: dniSchema,
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el estudiante"}),
    address: z
        .string()
        .min(1, { message: "Ingrese una dirección válida para el estudiante" })
        .regex(/\S+\s*\S*/, { message: "La dirección debe contener al menos un carácter no espacio" }),
    birthDate: z.date().refine((date) => {
        // Calculamos la edad
        const age = calculateAge(date);
        // Validamos que sea mayor de 4
        return age >= 4;
    }, 'El estudiante debe ser mayor de 4 años')
});
export const StudentSchema = StudentSchemaWithoutGrade.extend({
    gradeName: z.string().min(1, {message: "Ingrese un año válido para el estudiante"}),
})

const dniMessageParent = "Ingrese un dni válido para el responsable";
export const ParentSchema = z.object({
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el responsable"}),
    address: z
        .string()
        .min(1, { message: "Ingrese una dirección válida para el responsable" })
        .regex(/\S+\s*\S*/, { message: "La dirección debe contener al menos un carácter no espacio" }),
    firstName: z
        .string()
        .min(1, { message: "Ingrese un nombre válido para el responsable" })
        .regex(/\S+\s*\S*/, { message: "El nombre debe contener al menos un carácter no espacio" }),
    lastName: z
        .string()
        .min(1, { message: "Ingrese un apellido válido para el responsable" })
        .regex(/\S+\s*\S*/, { message: "El apellido debe contener al menos un carácter no espacio" }),
    dni: z.coerce.number({message: dniMessageParent}).min(minDigits(7), {message: dniMessageParent}).max(maxDigits(9), {message: dniMessageParent}),
    email: z.string().email({message: "Ingrese un email válido para el responsable"}),
    birthDate: z.date().refine((date) => {
        // Calculamos la edad
       const age = calculateAge(date);
        // Validamos que sea mayor de 18
        return age >= 18;
    }, 'El responsable debe ser mayor de 18 años')
});


export type StudentDataWithoutGrade = z.infer<typeof StudentSchemaWithoutGrade>
export type StudentData = z.infer<typeof StudentSchema>
export type ParentData = z.infer<typeof ParentSchema>