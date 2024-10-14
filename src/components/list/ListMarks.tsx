"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import {StudentWithMarksPerSubject, SubjectWithExams} from "@/app/api/internal/exam-marks/types";



function NotasDialog({ subject }: { subject: SubjectWithExams }) {


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">Ver Notas</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100 border border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-100">{subject.name} - Notas</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {subject.exams.map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between">
                            <span className="font-medium text-gray-200">Exámen del día {(new Date(exam.date)).toLocaleDateString()}:</span>
                            <span className="text-gray-300">{exam.marks[0].mark}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function ExamMarkList({ studentId }: { studentId: number }) {
    const [dataJson, setDataJson] = useState<StudentWithMarksPerSubject>()

    useEffect(() => {
        fetch(`/api/internal/exam-marks?studentId=${studentId}`)
            .then((response) => response.json())
            .then((data) => setDataJson(data))
    }, [studentId])

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
            <div className="container mx-auto p-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Lista de Materias y Notas</h1>
                <div className="space-y-4">
                    {dataJson && dataJson.grade.subjects.map((subject) => (
                        <Card key={subject.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
                                <h2 className="text-xl font-semibold mb-2 md:mb-0 text-gray-100">{subject.name}</h2>
                                <NotasDialog subject={subject} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}