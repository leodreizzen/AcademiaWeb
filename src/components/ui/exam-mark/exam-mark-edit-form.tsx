"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExamWithSubjectAndMarks } from "@/lib/actions/exam";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import { ExamMarkEdit, ExamMarkEditModel } from "@/lib/models/examMark";
import {format} from "date-fns";
import { updateMarks } from "@/lib/actions/exam-mark";

type ExamMarkFormProps = {
    exam: ExamWithSubjectAndMarks
}

export default function ExamMarkEditForm({ exam }: ExamMarkFormProps) {
    const router = useRouter();
    const { register, handleSubmit, formState, control } = useForm<ExamMarkEdit>({
        defaultValues: {
            marks: exam.marks.map(x => ({
                id: x.id,
                examId: x.examId,
                mark: x.mark,
                studentId: x.studentId
            }))
        },
        resolver: zodResolver(ExamMarkEditModel)
    });
    async function onSubmit(examMarks: ExamMarkEdit) {
        console.log(examMarks);
        if(!examMarks.marks.some(student => student.mark != null)){
            alert("Debes ingresar al menos una nota")
        } else {
            const res = await updateMarks(examMarks.marks.map(x => ({ id: x.id, mark: x.mark })))
            if (res.success) {
                alert("Notas guardadas exitosamente")
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
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Materia:</Label>
                                    <p className="text-lg font-medium mt-1">{exam.subject.name}</p>
                                </div>
                                <div>
                                    <Label>Año:</Label>
                                    <p className="text-lg font-medium mt-1">{exam.subject.grade.name}</p>
                                </div>
                                <div>
                                    <Label>Fecha:</Label>
                                    <p className="text-lg font-medium mt-1">{format(exam.date, "dd/MM/yyyy")}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Listado de alumnos</h3>
                            <div className="space-y-4">
                                {exam.marks.map((examMark, index) => (
                                    <div key={examMark.id}
                                         className="flex items-center justify-between p-3 bg-gray-700 rounded-lg" data-testid="student-mark">
                                        <span
                                            className="font-medium">{examMark.student.user.firstName} {examMark.student.user.lastName}</span>
                                        <div className={"flex-col space-y-2"}>
                                            <div className="flex items-center space-x-2 justify-end">
                                                <Label htmlFor={`${index}.mark`}
                                                       className="text-sm">Nota:</Label>
                                                <Input
                                                    id={`${index}.mark`}
                                                    type="number"
                                                    defaultValue={examMark.mark}
                                                    placeholder="Editar nota"
                                                    className="w-20 bg-gray-600 text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    aria-label={`Nota para ${examMark.student.user.firstName} ${examMark.student.user.lastName}`}
                                                    {...register(`marks.${index}.mark`, {setValueAs: v => v === '' ? null : Number.parseInt(v)})}
                                                />
                                            </div>
                                            {formState.errors.marks && formState.errors.marks[index] &&
                                                <p className="text-red-500 text-sm">{formState.errors.marks[index].mark?.message}</p>}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="button" className="w-full" onClick={handleSubmit(onSubmit)}>Guardar</Button>
                </CardFooter>
            </Card>
        </div>
    );
}