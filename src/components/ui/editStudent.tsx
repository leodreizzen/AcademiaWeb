'use client';

import {StudentWithUserAndParent} from "@/lib/definitions/parent";
import {useForm} from "react-hook-form";
import {StudentDataWithoutGrade, StudentSchemaWithoutGrade} from "@/lib/models/studentParent";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {updateStudentInDataBase} from "@/app/(loggedin)/student/add/studentParentBack";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {FieldForm} from "@/components/ui/FieldForm";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {FieldCalendar} from "@/components/ui/FieldCalendar";
import {useRouter} from "next/navigation";


export default function EditStudent({student, id, grades} : {student: StudentWithUserAndParent, id: number, grades : string[]}) {
    const {register, handleSubmit: handleSubmit1, formState, getValues, control: control1, trigger} = useForm<StudentDataWithoutGrade>({resolver: zodResolver(StudentSchemaWithoutGrade), mode: "all", reValidateMode: "onChange",
    defaultValues:{
        dni: student.user.dni,
        phoneNumber: student.phoneNumber,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        address: student.address,
        email: student.email,
        birthDate: student.birthdate
    }});
    const router = useRouter();
    const [grade, setGrade] = useState(student.gradeName);
    const isValid = formState.isValid
    useEffect(() => {
        trigger().then(()=>{});
    }, [trigger]);

    const handleEditStudent = async () => {
        const result = await updateStudentInDataBase(id,{...getValues(), gradeName: grade}, student.parents);
        if (!result.success) {
            alert(result.error)
        } else {
            alert("El alumno se ha modificado correctamente")
            router.push(`/student/${id}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Modificar Alumno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <FieldForm label="Nombre" type="string" registerRes={register("firstName")}
                                           errors={formState.errors}/>
                            </div>
                            <div className="flex-1">
                                <FieldForm label="Apellido" type="string" registerRes={register("lastName")}
                                           errors={formState.errors}/>
                            </div>
                        </div>
                        <div>
                            <FieldForm label="Telefono" type="number" registerRes={register("phoneNumber")}
                                       errors={formState.errors}/>
                        </div>
                        <div>
                            <Label htmlFor="orden" className="text-gray-300">Año asociado</Label>
                            <Select
                                name="anio"
                                value={grade}
                                onValueChange={setGrade}
                            >
                                <SelectTrigger
                                    className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
                                    <SelectValue placeholder="Elija un año"/>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700">
                                    {grades.map((grade) => (
                                        <SelectItem
                                            key={grade}
                                            className="bg-gray-700 text-gray-100 focus:border-gray-500"
                                            value={grade}
                                        >
                                            {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <FieldForm label="Correo electrónico" type="string" registerRes={register("email")}
                                       errors={formState.errors}/>
                        </div>
                        <div className="md:col-span-2">
                            <FieldForm label="Direccion" type="string" registerRes={register("address")}
                                       errors={formState.errors}/>
                        </div>
                        <div className="md:col-span-2">
                            <FieldCalendar control={control1} label={"Fecha de nacimiento"}
                                           registerRes={register("birthDate")}
                                           errors={formState.errors}/>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-400 mb-2 block">Responsables</Label>
                        <div className="space-y-3">
                            {student.parents.map((parent, index) => (
                                <Link href={`/parent/${parent.id}`} key={index}>
                                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                                        <p className="font-semibold">{parent.user.lastName} {parent.user.firstName}</p>
                                        <p className="text-sm text-gray-300">DNI: {parent.dni}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit1(handleEditStudent)}
                        disabled={!isValid || !Object.values(formState.dirtyFields).some(value => value === true)}
                        className="w-full bg-green-600 text-white hover:bg-green-500"
                    >
                        Editar
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
