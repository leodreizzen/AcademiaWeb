import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";

const invalidDni = "Ingresa un DNI válido";

export const LoginModel = z.object({
    dni: z.coerce.number({invalid_type_error: invalidDni}).int(invalidDni).min(minDigits(7), invalidDni).max(maxDigits(9), invalidDni),
    password: z.string().min(1, "Ingresa tu contraseña"),
})

export type LoginData = z.infer<typeof LoginModel>
