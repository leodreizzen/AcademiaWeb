import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Ingrese un dni válido";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const AdminSchema = z.object({
    firstName: z.string().min(1, {message: "Ingrese un nombre válido"}),
    lastName: z.string().min(1, {message: "Ingrese un apellido válido"}),
    email: z.string().email({message: "Ingrese un email válido"}),
    dni: dniSchema,
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida"}),
});

export type AdminData = z.infer<typeof AdminSchema>