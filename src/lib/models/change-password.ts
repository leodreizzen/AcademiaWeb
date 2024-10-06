import {z} from "zod";
import {PasswordModel} from "@/lib/models/passwords";

export const ChangePasswordModel = z.object({
    password: z.string().min(1, {message: "Este campo es requerido"}),
    newPassword: PasswordModel,
    newPasswordConfirmation: PasswordModel
}).refine(data => data.newPassword === data.newPasswordConfirmation, {message: "Las contraseñas no coinciden", path: ["newPasswordConfirmation"]})

export type ChangePasswordData = z.infer<typeof ChangePasswordModel>

