import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";
import {AddressSchema, DniSchema, FirstNameSchema, LastNameSchema, PhoneNumberSchema} from "@/lib/models/user";

export function calculateAge(date: Date) {
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

export function studentDateSuperRefine(date: Date, ctx: z.RefinementCtx) {
    const age = calculateAge(date);
    if(age < 4) {
        ctx.addIssue({
            code: "custom",
            message: "El estudiante debe ser mayor de 4 años",
        });
    }
}

export function parentDateSuperRefine(date: Date, ctx: z.RefinementCtx) {
    const age = calculateAge(date);
    if(age < 18) {
        ctx.addIssue({
            code: "custom",
            message: "El responsable debe ser mayor de 18 años",
        });
    }
}

export const StudentSchemaWithoutGrade = z.object({
    firstName: FirstNameSchema,
    lastName: LastNameSchema,
    email: z.string().email({message: "Ingrese un email válido"}),
    dni: DniSchema,
    phoneNumber: PhoneNumberSchema,
    address: AddressSchema,
    birthDate: z.date().superRefine(studentDateSuperRefine)
})
export const StudentSchema = StudentSchemaWithoutGrade.extend({
    gradeName: z.string().min(1, {message: "Ingrese un año válido"}),
})

const dniMessageParent = "Ingrese un dni válido";
export const ParentSchema = z.object({
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido"}),
    address: AddressSchema,
    firstName: FirstNameSchema,
    lastName: LastNameSchema,
    dni: DniSchema,
    email: z.string().email({message: "Ingrese un email válido"}),
    birthDate: z.date().superRefine(parentDateSuperRefine)
});


export type StudentDataWithoutGrade = z.infer<typeof StudentSchemaWithoutGrade>
export type StudentData = z.infer<typeof StudentSchema>
export type ParentData = z.infer<typeof ParentSchema>