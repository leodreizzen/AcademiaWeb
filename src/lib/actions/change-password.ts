"use server"
import {ChangePasswordData, ChangePasswordModel} from "@/lib/models/change-password";
import getPrismaClient, {getRawPrismaClient} from "@/lib/prisma";
import bcrypt from "bcrypt";

const rawPrisma = getRawPrismaClient()
const prisma = getPrismaClient({id: 1, role:"Superuser"})

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
        const user = await rawPrisma.user.findUnique({
            where: {
                dni: dni
            }
        })
        if (!user)
            return {
                success: false,
                message: "Usuario no encontrado"
            }
        const passwordCorrect = bcrypt.compare(data.data.password, user.password)
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
                password: data.data.newPassword
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