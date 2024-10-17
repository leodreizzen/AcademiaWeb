'use client'

import React, { useEffect } from 'react'
import {Button} from "@/components/ui/button"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"


import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FieldForm} from "@/components/ui/FieldForm";
import {AdminData, AdminSchema} from "@/lib/models/admin";
import {addAdminToDataBase} from "@/app/(loggedin)/admin/add/adminBack";
import { Administrator, User } from '@prisma/client';
import { editAdmin } from '../../adminActions';

interface AdminEditParams {
    administrator: {
        id: number;
        email: string;
        dni: number;
        phoneNumber: string;
        address: string;
        user: {
            firstName: string;
            lastName: string;
        }
    }
}


export function AdminEditComponent({ administrator }: AdminEditParams) {
    const {
        register,
        handleSubmit,
        formState
    } = useForm<AdminData>({resolver: zodResolver(AdminSchema), mode: "all", reValidateMode: "onChange", values: {
        dni: administrator.dni,
        phoneNumber: administrator.phoneNumber,
        firstName: administrator.user.firstName,
        lastName: administrator.user.lastName,
        address: administrator.address,
        email: administrator.email,
    }});
    const isValid = formState.isValid;
    const router = useRouter();

    const handleSubmitStep = async (data: AdminData) => {
        const result = await editAdmin(data.phoneNumber, data.address, data.email, data.firstName, data.lastName, administrator.id);
        if (!result) {
            alert("Hubo un error al guardar el admin")
        } else {
            alert("El admin se ha guardado correctamente")
            router.push("/admin")
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        Editar Administrador
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleSubmitStep)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FieldForm label="DNI" type="number" registerRes={register("dni")}
                                       errors={formState.errors} disabled />
                            <FieldForm label="Telefono" type="number" registerRes={register("phoneNumber")}
                                       errors={formState.errors}/>
                            <FieldForm label="Nombre" type="string" registerRes={register("firstName")}
                                       errors={formState.errors}/>
                            <FieldForm label="Apellido" type="string" registerRes={register("lastName")}
                                       errors={formState.errors}/>
                            <FieldForm label="Direccion" type="string" registerRes={register("address")}
                                       errors={formState.errors}/>
                            <FieldForm label="Correo electrónico" type="string" registerRes={register("email")}
                                       errors={formState.errors}/>


                        </div>
                        <Button
                            type="submit"
                            disabled={!isValid}
                            className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                        >
                            Guardar administrador
                        </Button>
                    </form>

                </CardContent>

            </Card>
        </div>
    )
}