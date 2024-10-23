'use client';
import {useForm} from "react-hook-form";
import {ParentData, ParentSchema} from "@/lib/models/studentParent";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {updateParentInDataBase} from "@/app/(loggedin)/student/add/studentParentBack";
import {FieldForm} from "@/components/ui/FieldForm";
import {FieldCalendar} from "@/components/ui/FieldCalendar";
import {Button} from "@/components/ui/button";
import React, {useEffect} from "react";
import {ParentWithUserAndChildren} from "@/lib/definitions/parent";
import {useRouter} from "next/navigation";

export default function EditParent({parent, id} : {parent: ParentWithUserAndChildren, id: number}) {
    const {register: register2, handleSubmit: handleSubmit2, formState: formState2, getValues: getValues2, control, trigger} = useForm<ParentData>({resolver: zodResolver(ParentSchema), mode: "all", reValidateMode: "onChange",
        defaultValues:{
            dni: parent.user.dni,
            phoneNumber: parent.phoneNumber,
            firstName: parent.user.firstName,
            lastName: parent.user.lastName,
            address: parent.address,
            email: parent.email,
            birthDate: parent.birthdate
        }});

    useEffect(() => {
        trigger().then(()=>{});
    }, [trigger]);
    const router = useRouter();
    const isValid2 = formState2.isValid
    const handleEditParent = async () => {
        const result = await updateParentInDataBase(id,getValues2());
        if (!result.success) {
            alert(result.error)
        } else {
            alert("El responsable se ha modificado correctamente")
            router.push(`/parent/${id}`)
        }
    }

    return (

        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Editar responsable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <FieldForm label="Nombre" type="string" registerRes={register2("firstName")}
                                           errors={formState2.errors}/>
                            </div>
                            <div className="flex-2">
                                <FieldForm label="Apellido" type="string" registerRes={register2("lastName")}
                                           errors={formState2.errors}/>
                            </div>
                        </div>
                        <div>
                            <FieldForm label="Telefono" type="number" registerRes={register2("phoneNumber")}
                                       errors={formState2.errors}/>
                        </div>
                        <div className="md:col-span-2">
                            <FieldForm label="Correo electrónico" type="string" registerRes={register2("email")}
                                       errors={formState2.errors}/>
                        </div>
                        <div className="md:col-span-2">
                            <FieldForm label="Direccion" type="string" registerRes={register2("address")}
                                       errors={formState2.errors}/>
                        </div>
                        <div className="md:col-span-2">
                            <FieldCalendar control={control} label={"Fecha de nacimiento"} registerRes={register2("birthDate")}
                                           errors={formState2.errors}/>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit2(handleEditParent)}
                        disabled={!isValid2 || !Object.values(formState2.dirtyFields).some(value => value === true)}
                        className="w-full bg-green-600 text-white hover:bg-green-500"
                    >
                        Editar
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}