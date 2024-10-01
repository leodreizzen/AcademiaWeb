"use client"
import {useState} from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import Link from 'next/link'
import {useForm, useFormState} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginData, LoginModel} from "@/lib/models/login";
import {LoginFormField} from "@/components/ui/LoginFormField";
import {login} from "@/lib/actions/login";


export default function LoginForm() {
    const {register, handleSubmit, formState} = useForm<LoginData>({resolver: zodResolver(LoginModel)});
    const [errors, setErrors] = useState<string | null>(null)

    async function submit(data: LoginData) {
        const newErrors = await login(data)
        setErrors(newErrors)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 text-gray-100">
                <CardHeader className="!pb-5">
                    <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                            <LoginFormField label="DNI" type="number" registerRes={register("dni")}
                                            errors={formState.errors}/>
                            <LoginFormField label="Contraseña" type="password" registerRes={register("password")}
                                            errors={formState.errors}/>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Iniciar sesión
                            </Button>
                        </form>
                        {errors && <Label className="text-red-400 mt-2">{errors}</Label>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/forgotpassword" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}