'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Subject} from "@prisma/client";
import {StudentWithUser} from "@/lib/definitions/student";
import {useRouter} from "next/navigation";


type PrincipalProps = {
    students: StudentWithUser[];
    subject: Subject;
    semestre : string
};

export default function ListadoAlumnos({ students, subject, semestre}: PrincipalProps) {
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(subject)
    const [notas, setNotas] = useState<Record<number, string>>({})
    const [boletinesCargados, setBoletinesCargados] = useState(false)

    const handleNotaChange = (alumnoId : number, nota : string) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [alumnoId]: nota
        }))
    }

    const todasLasNotasCargadas = () => {
        return students.every(alumno => notas[alumno.id] && notas[alumno.id].trim() !== '')
    }

    const cargarBoletines = () => {
        if (todasLasNotasCargadas()) {
            // Aquí iría la lógica para enviar las notas al servidor
            console.log('Notas cargadas:', notas)
            setBoletinesCargados(true)
            console.log('Boletines cargados exitosamente')
        } else {
            console.log('Por favor, complete todas las notas antes de cargar los boletines')
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                        Carga de Notas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {materiaSeleccionada && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{materiaSeleccionada.name}</h3>
                                <p className="text-sm text-gray-300">{materiaSeleccionada.gradeName} - {semestre === '1' ? 'Primer' : 'Segundo'} Semestre</p>
                            </div>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-700">
                                    <TableHead className="text-white">Alumno</TableHead>
                                    <TableHead className="text-white">Nota</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(alumno => (
                                    <TableRow key={alumno.id} className="border-b border-gray-700">
                                        <TableCell className="text-white">{alumno.user.firstName} {alumno.user.lastName}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="1"
                                                value={notas[alumno.id] || ''}
                                                onChange={(e) => handleNotaChange(alumno.id, e.target.value)}
                                                className="w-20 bg-gray-700 text-white border-gray-600"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between">
                            <Link href="/reportcard/teacher" passHref>
                                <Button
                                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Volver a Selección
                                </Button>
                            </Link>
                            <Button
                                onClick={cargarBoletines}
                                disabled={!todasLasNotasCargadas() || boletinesCargados}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Cargar Boletines
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}