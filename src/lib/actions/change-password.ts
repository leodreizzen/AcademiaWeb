"use server"
import {ChangePasswordData, ChangePasswordModel} from "@/lib/models/change-password";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {hashPassword} from "@/lib/data/passwords";


type ChangePasswordResponse = {
    success: boolean,
    message: string
}

export async function changePassword(dni: number, _data: ChangePasswordData): Promise<ChangePasswordResponse> {
    try{
        const data = ChangePasswordModel.safeParse(_data)
        if (!data.success)
            return {
                success: false,
                message: "Datos inválidos"
            }
        const user = await prisma.user.findUnique({
            where: {
                dni: dni
            },
            omit: {
                passwordHash: false
            }
        })
        if (!user)
            return {
                success: false,
                message: "Usuario no encontrado"
            }
        const passwordCorrect = await bcrypt.compare(data.data.password, user.passwordHash)
        if(!passwordCorrect)
            return {
                success: false,
                message: "Contraseña incorrecta"
            }
        await prisma.user.update({
            where: {
                dni: dni
            },
            data: {
                passwordHash: await hashPassword(data.data.newPassword)
            }
        })
        return {
            success: true,
            message: "Contraseña actualizada"
        }
    }catch (e: any){
        return {
            success: false,
            message: e.message
        }
    }
}