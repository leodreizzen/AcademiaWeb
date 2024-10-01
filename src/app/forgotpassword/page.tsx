"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {ForgotPasswordData, ForgotPasswordModel} from "@/lib/models/passwordReset";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {requestPasswordReset} from "@/lib/actions/passwordReset";
import ForgotPasswordField from "@/components/ui/password_reset/ForgotPasswordField";
import React, {useState} from "react";
import {Mail} from "lucide-react";
import {useRouter} from "next/navigation";

export default function RequestResetPassword() {
    const {register,formState, handleSubmit} = useForm<ForgotPasswordData>({resolver: zodResolver(ForgotPasswordModel)});
    const [error, setError] = useState<string|null>(null);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const router = useRouter();
    async function submit(data: ForgotPasswordData){
        const result = await requestPasswordReset(data)
        if(result.success) {
            setError(null)
            setEmailSent(true)
        }
        else
            setError(result.error)
    }

    function handleReturn() {
        router.replace("/login")
    }

    return emailSent ? <CheckEmail/> :(
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl text-white">Restablecer Contraseña</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">Ingresa tu correo electrónico para restablecer tu contraseña</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submit)} className="space-y-3">
                        <div className="space-y-1">
                            <ForgotPasswordField label={"Correo electrónico"} type={"email"} registerRes={register("email")} errors={formState.errors} placeholder="tu@email.com" autoComplete="email"/>
                        </div>
                        {error && <div className="text-red-400 text-sm">{error}</div>}
                        <div className="flex gap-x-3">
                        <Button type="button" className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 flex-1" onClick={handleReturn}>Volver</Button>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white flex-1">Continuar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

function CheckEmail() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="space-y-1 pb-2">
                    <Mail className="mx-auto my-2 h-16 w-16 text-blue-500" />
                    <CardTitle className="text-2xl text-center text-white">Correo Enviado</CardTitle>
                </CardHeader>
                <CardContent className="text-justify">
                    <CardDescription className="text-gray-400 mb-2">
                        Hemos enviado un correo a tu dirección, con un enlace para restablecer tu contraseña.
                    </CardDescription>
                    <p className="text-sm text-gray-400">
                        Por favor, revisa tu bandeja de entrada y la carpeta de spam. Si no recibes el correo en unos minutos, intenta nuevamente.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}