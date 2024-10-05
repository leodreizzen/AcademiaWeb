import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Ingrese un dni válido para el administrador";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const AdminSchema = z.object({
    firstName: z.string().min(1, {message: "Ingrese un nombre válido para el administrador"}),
    lastName: z.string().min(1, {message: "Ingrese un apellido válido para el administrador"}),
    email: z.string().email({message: "Ingrese un email válido para el administrador"}),
    dni: dniSchema,
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el administrador"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida para el administrador"}),
});

export type AdminData = z.infer<typeof AdminSchema>