"use client"
import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useForm, useFormState} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChangePasswordData, ChangePasswordModel} from "@/lib/models/change-password";
import {changePassword} from "@/lib/actions/change-password";
import {FieldForm} from "@/components/ui/FieldForm";
import {ProfileWithRoleAndUser} from "@/lib/definitions";
import {useRouter} from "next/navigation";

interface changePasswordFormProps {
    user: ProfileWithRoleAndUser;
}

export default function ChangePasswordForm({user}: changePasswordFormProps) {
    const router = useRouter()
    const {register, handleSubmit, formState} = useForm<ChangePasswordData>({resolver: zodResolver(ChangePasswordModel)});
    const [errors, setErrors] = useState<string | null>(null)

    async function submit(data: ChangePasswordData) {
        const response = await changePassword(user.dni, data)
        if (response.success){
            alert(response.message)
            setErrors(null)
            router.push("/")
        }
        else
            setErrors(response.message)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 text-gray-100">
                <CardHeader className="!pb-5">
                    <CardTitle className="text-2xl font-bold text-center">Cambiar contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                            <FieldForm label="Contraseña actual" type="password" registerRes={register("password")}
                                            errors={formState.errors}/>
                            <FieldForm label="Nueva contraseña" type="password" registerRes={register("newPassword")}
                                            errors={formState.errors}/>
                            <FieldForm label="Confirmar nueva contraseña" type="password" registerRes={register("newPasswordConfirmation")}
                                            errors={formState.errors}/>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Cambiar contraseña
                            </Button>
                        </form>
                        {errors && <Label className="text-red-400 mt-2">{errors}</Label>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}