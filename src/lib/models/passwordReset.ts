import {z} from "zod";
import {PasswordModel} from "@/lib/models/passwords";

export const ForgotPasswordModel = z.object({
    email: z.string().email("Ingresa un email válido"),
})

export type ForgotPasswordData = z.infer<typeof ForgotPasswordModel>

export const PasswordResetModel = z.object({
    password: PasswordModel,
    passwordConfirmation: PasswordModel,
}).refine(data => data.password === data.passwordConfirmation, {message:"Las contraseñas no coinciden", path: ["passwordConfirmation"]});

export type PasswordResetData = z.infer<typeof PasswordResetModel>