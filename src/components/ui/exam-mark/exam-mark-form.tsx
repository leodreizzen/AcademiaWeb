"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {registerMarks, SubjectWithGradeAndTeachers} from "@/lib/actions/exam-mark";
import {zodResolver} from "@hookform/resolvers/zod";
import {ExamMarkAdd, ExamMarkAddModel} from "@/lib/models/examMarkAdd";
import {StudentWithUser} from "@/lib/definitions/student";
import {useRouter} from "next/navigation";
import {FieldCalendar} from "@/components/ui/FieldCalendar";

type ExamMarkFormProps = {
    subject: SubjectWithGradeAndTeachers,
    students: StudentWithUser[]
}

export default function ExamMarkForm({ subject, students }: ExamMarkFormProps) {
    const _students = students.map(student => ({
        id: student.id,
        name: student.user.firstName + ' ' + student.user.lastName,
        grade: null
    }))
    const { register, handleSubmit, formState, control } = useForm<ExamMarkAdd>({
        defaultValues: {
            examDate: undefined,
            examMarks: _students
        },
        resolver: zodResolver(ExamMarkAddModel)
    })

    const router = useRouter()

     async function onSubmit (data: ExamMarkAdd){
        if(!data.examMarks.some(student => student.grade != null)){
            alert("Debes ingresar al menos una nota")
        } else {
            const res = await registerMarks(subject.id, data.examDate, data.examMarks)
            if (res.success) {
                alert("Notas cargadas exitosamente")
                router.push("/exam-mark")
            } else {
                alert(res.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Registrar Examen</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Materia:</Label>
                                    <p className="text-lg font-medium mt-1">{subject.name}</p>
                                </div>
                                <div>
                                    <Label>Año:</Label>
                                    <p className="text-lg font-medium mt-1">{subject.grade.name}</p>
                                </div>
                            </div>
                            <div>

                                {/*<Label htmlFor="examDate">Examen realizado:</Label>*/}
                                {/*<Input*/}
                                {/*    id="examDate"*/}
                                {/*    type="date"*/}
                                {/*    className="bg-gray-700 text-gray-100"*/}
                                {/*    {...register("examDate", {valueAsDate: true})}*/}
                                {/*/>*/}
                                <FieldCalendar control={control} label={"Examen realizado:"} registerRes={register("examDate")} errors={formState.errors}/>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Listado de alumnos</h3>
                            <div className="space-y-4">
                                {students.map((student, index) => (
                                    <div key={index}
                                         className="flex items-center justify-between p-3 bg-gray-700 rounded-lg" data-testid="student-mark">
                                        <span
                                            className="font-medium">{student.user.firstName} {student.user.lastName}</span>
                                        <div className={"flex-col space-y-2"}>
                                            <div className="flex items-center space-x-2 justify-end">
                                                <Label htmlFor={`examMarks.${index}.grade`}
                                                       className="text-sm">Nota:</Label>
                                                <Input
                                                    id={`examMarks.${index}.grade`}
                                                    type="number"
                                                    placeholder="Agregar"
                                                    className="w-20 bg-gray-600 text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    aria-label={`Nota para ${student.user.firstName} ${student.user.lastName}`}
                                                    {...register(`examMarks.${index}.grade`, {setValueAs: v => v === '' ? null : v})}
                                                />
                                            </div>
                                            {formState.errors.examMarks && formState.errors.examMarks[index] &&
                                                <p className="text-red-500 text-sm">{formState.errors.examMarks[index].grade?.message}</p>}
                                        </div>

                                    </div>
                                ))}
                            </div>
                            {formState.errors.examMarks && <p className="text-red-500 text-sm mt-1">Hay errores en las notas de los estudiantes {formState.errors.examMarks.type}</p>}
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>Cargar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}