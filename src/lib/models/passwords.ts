import {z} from "zod";

export const passwordModelDescription = "La contraseña debe tener al menos 12 caracteres, un número, una letra minúscula, una letra mayúscula y un carácter especial.";

export const PasswordModel = z.string()
    .min(12, "La contraseña debe tener al menos 12 caracteres.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial.");