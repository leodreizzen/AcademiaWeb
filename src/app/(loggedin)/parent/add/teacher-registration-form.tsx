"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {useForm, useFormState} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { TeacherRegistrationData, TeacherRegistrationModel } from "@/app/lib/models/teacher-registration";
import TeacherRegistrationFormDialog from "@/app/(loggedin)/parent/add/TeacherRegistrationFormDialog";
import {TeacherRegistrationFormField} from "@/app/(loggedin)/parent/add/TeacherRegistrationFormField";



export default function TeacherRegistrationForm() {
    const {register, handleSubmit, formState} = useForm<TeacherRegistrationData>({resolver: zodResolver(TeacherRegistrationModel)})
    const [errors, setErrors] = useState<string | null>(null)
    const [assignedGrades, setAssignedGrades] = useState<{[key: number]: string[]}>({})

    const onAssignSubject = (grade: number, subject: string) => {
        setAssignedGrades(prev => {
            const newGrades = prev[grade] ? [...prev[grade]] : []
            if (!newGrades.includes(subject)) {
                return {...prev, [grade]: [...newGrades, subject]}
            }
            return prev
        })
    }

    const onRemoveSubject = (grade: number, subject: string) => {
        setAssignedGrades(prev => {
            const newGrades = prev[grade].filter((s) => s !== subject)
            if (newGrades.length === 0) {
                const {[grade]: _, ...rest} = prev
                return rest
            }
            return {...prev, [grade]: newGrades}
        })
    }


    async function submitData(data: TeacherRegistrationData) {
        console.log("Formulario enviado", { ...data, assignedGrades })
    }

    return (
            <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Formulario de Alta de Docente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submitData)} className="space-y-4">
                        <TeacherRegistrationFormField label={"DNI"} type={"number"} registerRes={register("dni")} errors={formState.errors}/>
                        <div className="grid grid-cols-2 gap-4">
                            <TeacherRegistrationFormField label={"Nombre"} type={"text"} registerRes={register("name")} errors={formState.errors}/>
                            <TeacherRegistrationFormField label={"Apellido"} type={"text"} registerRes={register("lastName")} errors={formState.errors}/>
                        </div>
                        <TeacherRegistrationFormField label={"Teléfono"} type={"number"} registerRes={register("phone")} errors={formState.errors}/>
                        <TeacherRegistrationFormField label={"Dirección"} type={"text"} registerRes={register("address")} errors={formState.errors}/>
                        <TeacherRegistrationFormField label={"Correo Electrónico"} type={"email"} registerRes={register("email")} errors={formState.errors}/>
                        <div className={"space-y-2"}>
                            <Label className="text-gray-300">Cursos y Materias Asignados</Label>
                            <TeacherRegistrationFormDialog assignedGrades={assignedGrades} onAssignSubject={onAssignSubject} onRemoveSubject={onRemoveSubject} />
                        </div>
                        <hr/>
                        <Button type="submit" onClick={handleSubmit(submitData)} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            Guardar Docente
                        </Button>
                    </form>
                    {errors && <Label className="text-red-400 mt-2">{errors}</Label>}
                </CardContent>
            </Card>
    )
}