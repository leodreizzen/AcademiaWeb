"use client"
import {useForm} from "react-hook-form";
import {PasswordResetData, PasswordResetModel} from "@/lib/models/passwordReset";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import ForgotPasswordField from "@/components/ui/password_reset/ForgotPasswordField";
import {Button} from "@/components/ui/button";
import {passwordModelDescription} from "@/lib/models/passwords";
import React, {useState} from "react";
import Link from "next/link";
import {Check} from "lucide-react";
import {processPasswordReset} from "@/lib/actions/passwordReset";


export default function PasswordResetForm({token}: {token: string}) {
    const {register, formState, handleSubmit} = useForm<PasswordResetData>({resolver: zodResolver(PasswordResetModel), mode: "all"});
    const [error, setError] = useState<string | null>(null);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    async function submit(data: PasswordResetData){
        const result = await processPasswordReset(token, data);
        if(!result.success) {
            setError(result.error)
        }
        else{
            setError(null)
            setPasswordChanged(true);
        }
    }
    return passwordChanged? <PasswordChanged/> :(
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl text-white">Cambiar Contraseña</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                        Ingresa tu nueva contraseña
                    </CardDescription>
                    <p className="text-gray-400 text-sm">{passwordModelDescription}</p>

                </CardHeader>
                <CardContent>
                    <form className="space-y-3" onSubmit={handleSubmit(async data=> await submit(data))}>
                        <ForgotPasswordField label="Contraseña" type="password" registerRes={register("password")} errors={formState.errors} autoComplete="new-password"/>
                        <ForgotPasswordField label="Confirmar contraseña" type="password" registerRes={register("passwordConfirmation")} errors={formState.errors} autoComplete="new-password"/>
                        {error && <div className="text-red-400 text-sm">{error}</div>}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Cambiar Contraseña</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


function PasswordChanged() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="space-y-1 pb-3">
                    <Check className="mx-auto my-2 h-16 w-16 text-green-500" />
                    <CardTitle className="text-2xl text-center text-white">Contraseña restablecida</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                    <CardDescription className="text-gray-400">
                        Tu contraseña ha sido restablecida correctamente
                    </CardDescription>
                    <p className="text-sm text-gray-400">
                        Ya puedes iniciar sesión con tu nueva contraseña
                    </p>
                    <Link href="/login" className="block mt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Iniciar sesión</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}