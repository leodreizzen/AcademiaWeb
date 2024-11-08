'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {GradeWithSubjects} from "@/lib/actions/exam-mark";
import {Subject} from "@prisma/client";



type SubjectSelectionFormProps = {
    grades: GradeWithSubjects[]
}

export default function SubjectSelectionForm({ grades }: SubjectSelectionFormProps) {
    const [selectedYear, setSelectedYear] = useState<GradeWithSubjects | undefined>(undefined)
    const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(undefined)
    const router = useRouter()

    const handleYearChange = (year: string) => {
        const selected = grades.find(grade => grade.name === year)
        setSelectedYear(selected)
        setSelectedSubject(undefined)
    }

    const handleSubjectChange = (subject: string) => {
        const _subject = selectedYear?.subjects.find(sub => sub.name === subject)
        setSelectedSubject(_subject)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedYear && selectedSubject) {
            router.push(`/exam-mark/add/subject/${selectedSubject.id}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 text-gray-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Seleccionar Materia</CardTitle>
                    <p className="text-gray-400 text-center text-sm">
                        Seleccione el año y la materia para la cual quiere agregar notas de exámen.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-200 mb-1">
                                    Año:
                                </label>
                                <Select onValueChange={handleYearChange} value={selectedYear?.name}>
                                    <SelectTrigger id="year" className="w-full bg-gray-700 text-gray-100">
                                        <SelectValue placeholder="Selecciona un año" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((grade) => (
                                            <SelectItem key={grade.name} value={grade.name}>{grade.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-1">
                                    Materia:
                                </label>
                                <Select
                                    onValueChange={handleSubjectChange}
                                    value={selectedSubject?.name}
                                    disabled={!selectedYear}
                                >
                                    <SelectTrigger id="subject" className="w-full bg-gray-700 text-gray-100">
                                        <SelectValue placeholder="Selecciona una materia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedYear && selectedYear.subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={!selectedYear || !selectedSubject}>
                                Ir
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}