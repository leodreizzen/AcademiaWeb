'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import 'react-toastify/dist/ReactToastify.css'
import {Subject} from '@prisma/client';
import Link from "next/link";

type PrincipalProps = {
    subjects: Subject[];
};



const students = [
    { id: 1, nombre: 'Ana García' },
    { id: 2, nombre: 'Carlos Rodríguez' },
    { id: 3, nombre: 'Elena Martínez' },
    { id: 4, nombre: 'David López' },
]

export default function AddReportCard({subjects} : PrincipalProps) {
    const [materiasState, setMateriasState] = useState(materias)
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [semestreSeleccionado, setSemestreSeleccionado] = useState('')

    const seleccionarMateria = (materia : Subject) => {
        setMateriaSeleccionada(materia)
        setSemestreSeleccionado('')
    }

    const getSemestreButtonText = (materia : Subject) => {
        if (!materia.semestres.includes('1') && !materia.semestres.includes('2')) {
            return 'Primer Semestre'
        } else if (materia.semestres.includes('1') && !materia.semestres.includes('2')) {
            return 'Segundo Semestre'
        } else {
            return 'Semestres Completos'
        }
    }

    const isSemestreButtonDisabled = (materia : Subject) => {
        return materia.semestres.includes('1') && materia.semestres.includes('2')
    }

    const handleSemestreClick = (materia : Subject) => {
        if (!materia.semestres.includes('1')) {
            setSemestreSeleccionado('1')
        } else if (!materia.semestres.includes('2')) {
            setSemestreSeleccionado('2')
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                        Selección de Materia y Semestre
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {subjects.map((subject : Subject) => (
                                <Card
                                    key={subject.id}
                                    className={`bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors ${
                                        materiaSeleccionada?.id === subject.id ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => seleccionarMateria(subject)}
                                >
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
                                            <p className="text-sm text-gray-300">{subject.gradeName}</p>
                                        </div>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleSemestreClick(subject)
                                            }}
                                            disabled={isSemestreButtonDisabled(subject)}
                                            className={`${
                                                isSemestreButtonDisabled(subject) ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white`}
                                        >
                                            {getSemestreButtonText(subject)}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <Link
                                href={{
                                    pathname: '/addList',
                                    query: {
                                        materiaId: materiaSeleccionada?.id,
                                        semestre: semestreSeleccionado
                                    },
                                }}
                                passHref
                            >
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={!materiaSeleccionada || !semestreSeleccionado}
                                >
                                    Ir a Listado de Alumnos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}