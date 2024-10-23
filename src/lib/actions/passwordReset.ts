"use server"
import {
    ForgotPasswordData,
    ForgotPasswordModel,
    PasswordResetData,
    PasswordResetModel
} from "@/lib/models/passwordReset";
import {
    createPasswordResetToken,
    fetchUserByEmail,
    resetPassword
} from "@/lib/data/passwordReset";
import {User} from "@prisma/client";
import {EmailSendResult} from "@/lib/email/emailSender";
import sendResetPasswordEmail from "@/lib/email/resetPassword";
import {getFullUrl} from "@/lib/serverUtils";
import {UserWithoutPassword} from "@/lib/definitions";

if(!process.env.VERCEL_URL){
    throw new Error("VERCEL_URL not set")
}

type OperationResult = {
    success: true
} | {
    success: false
    error: string
}

export async function requestPasswordReset(_data: ForgotPasswordData): Promise<OperationResult>{
    const data =  ForgotPasswordModel.safeParse(_data)
    if(!data.success){
        return {success: false, error: "Ingresa un email válido"}
    }

    const user = await fetchUserByEmail(data.data.email);
    if(!user){
        return {success: false, error: "El correo electrónico no está registrado"}
    }

    const result = await sendResetEmail(user, data.data.email)
    if(!result.success){
        console.error("Error sending email", result.error);
        return {success: false, error: "Ha ocurrido un error interno. Por favor intenta más tarde"}
    }
    return {success: true}
}

async function sendResetEmail(user: UserWithoutPassword, email: string): Promise<EmailSendResult>{
    const token = await createPasswordResetToken(user);
    const searchParams = new URLSearchParams({token});
    searchParams.set('token', token);
    return sendResetPasswordEmail({...user, email}, getFullUrl(`/passwordreset/?${searchParams.toString()}`));
}


export async function processPasswordReset(token: string, _data: PasswordResetData){
    const data =  PasswordResetModel.safeParse(_data)
    if(!data.success){
        return {success: false, error: data.error.message}
    }

    return await resetPassword(token, data.data.password)
}