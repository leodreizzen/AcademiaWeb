"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {TeacherWithMarksPerSubject} from "@/app/api/internal/exam-marks/teacher/types";
import {useRouter} from "next/navigation";


export default function TeacherMarkList({teacherId}: {teacherId: number}) {
    const [openDialog, setOpenDialog] = useState<string | null>(null)
    const [teacher, setTeacher] = useState<TeacherWithMarksPerSubject>()
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/internal/exam-marks/teacher/?teacherId=${teacherId}`)
            .then((response) => response.json())
            .then((data) => setTeacher(data))
    }, [teacherId])

    console.log(teacher)

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex justify-between items-center mt-3 mb-4">
                    <h1 className="text-2xl font-bold items-center">Notas de Alumnos</h1>
                    <Button variant="default" onClick={() => router.push("/exam-mark/add")}>Agregar notas</Button>
                </div>
                <hr className={"bg-white h-0.5 mb-2"}/>
                <Accordion type="single" collapsible className="w-full">
                    {teacher && teacher.subjects.map((subject) => (
                        <AccordionItem key={subject.id} value={`item-${subject.id}`} className="test-subject-item">
                            <AccordionTrigger className="hover:no-underline !pb-2 exam-item">
                <span className="text-left">
                  {subject.name} - {subject.gradeName}
                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                {subject.exams.length > 0 ? <div className="space-y-2">
                                    {subject.exams.map((exam) => (
                                        <div key={exam.id} className="flex justify-between items-center test-exam-item">
                                            <span>Exámen del día {(new Date(exam.date)).toLocaleDateString()}:</span>
                                            <Dialog open={openDialog === `${subject.id}-${exam.id}`} onOpenChange={(isOpen) => setOpenDialog(isOpen ? `${subject.id}-${exam.id}` : null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="default" className="text-black">Ver Notas</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-gray-100 mb-2">{`Notas - ${subject.name} - ${subject.gradeName}`}</DialogTitle>
                                                        <DialogTitle className="text-gray-100">{`Exámen del día ${(new Date(exam.date)).toLocaleDateString()}:`}</DialogTitle>
                                                    </DialogHeader>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-gray-700">
                                                                <TableHead className="w-[180px] text-gray-300">Alumno</TableHead>
                                                                <TableHead className="text-gray-300">Nota</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {exam.marks.map((mark, index) => (
                                                                <TableRow key={index} className="border-gray-700">
                                                                    <TableCell className="font-medium text-gray-300">{mark.student.user.firstName} {mark.student.user.lastName}</TableCell>
                                                                    <TableCell className="text-gray-300">{mark.mark}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    ))}
                                </div> : <div className="text-red-400">No hay exámenes registrados</div>
                                }
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    {teacher && teacher.subjects.length === 0 && (
                        <div className="text-center text-gray-200 bg-gray-700 p-7 rounded-lg">No hay materias registradas</div>
                    )}
                </Accordion>
            </div>
        </div>
    )
}