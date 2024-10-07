"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { TeacherRegistrationData, TeacherRegistrationModel } from "@/lib/models/teacher-registration";
import TeacherRegistrationFormDialog from "@/app/(loggedin)/teacher/add/TeacherRegistrationFormDialog";
import {TeacherRegistrationFormField} from "@/app/(loggedin)/teacher/add/TeacherRegistrationFormField";
import {createTeacherRegistration} from "@/lib/actions/teacher-registration";
import {GradeWithSubjects} from "@/app/(loggedin)/teacher/add/page";

interface TeacherRegistrationFormProps {
    grades: GradeWithSubjects
}


export default function TeacherRegistrationForm({grades}: TeacherRegistrationFormProps) {
    const {register, handleSubmit, formState} = useForm<TeacherRegistrationData>({resolver: zodResolver(TeacherRegistrationModel)})
    const [assignedGrades, setAssignedGrades] = useState<{[key: string]: string[]}>({})

    const onAssignSubject = (grade: string, subject: string) => {
        setAssignedGrades(prev => {
            const newGrades = prev[grade] ? [...prev[grade]] : []
            if (!newGrades.includes(subject)) {
                return {...prev, [grade]: [...newGrades, subject]}
            }
            return prev
        })
    }

    const onRemoveSubject = (grade: string, subject: string) => {
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
        const res = await createTeacherRegistration({...data, assignedGrades})
        if (res.success) {
            alert("Docente creado exitosamente")
        } else {
            alert(res.error)
        }
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
                        <TeacherRegistrationFormField label={"Teléfono"} type={"text"} registerRes={register("phoneNumber")} errors={formState.errors}/>
                        <TeacherRegistrationFormField label={"Dirección"} type={"text"} registerRes={register("address")} errors={formState.errors}/>
                        <TeacherRegistrationFormField label={"Correo Electrónico"} type={"email"} registerRes={register("email")} errors={formState.errors}/>
                        <div className={"space-y-2"}>
                            <Label className="text-gray-300">Cursos y Materias Asignados</Label>
                            <TeacherRegistrationFormDialog assignedGrades={assignedGrades} onAssignSubject={onAssignSubject} onRemoveSubject={onRemoveSubject} grades={grades} />
                        </div>
                        <hr/>
                        <Button type="submit" onClick={handleSubmit(submitData)} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            Guardar Docente
                        </Button>
                    </form>
                </CardContent>
            </Card>
    )
}