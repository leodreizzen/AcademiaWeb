'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Subject } from "@prisma/client"
import { StudentWithUser } from "@/lib/definitions/student"
import { useRouter } from "next/navigation"
import {SecondSemesterMarkListModel} from "@/lib/models/marks"
import { z } from "zod"
import { Input } from "@/components/ui/input"

import {
    addSecondSemesterMarksInDatabase
} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/addSecondSemesterMarksInDatabase";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type PrincipalProps = {
    students: StudentWithUser[];
    subject: Subject;
};

export default function SecondSemesterReportCardFront({ students, subject }: PrincipalProps) {
    const [notas, setNotas] = useState<z.infer<typeof SecondSemesterMarkListModel>>({})

    const router = useRouter();

    const handleNotaChange = (alumnoId: number, secondSemester: string) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [alumnoId]: {
                secondSemester,
                final: prevNotas[alumnoId]?.final ?? -1
            }
        }));
    }

    const handleNotaFinalChange = (alumnoId: number, final: string) => {
        const notaNumeric = parseInt(final);  // Convertir final a número
        if (!isNaN(notaNumeric) && notaNumeric >= 0 && notaNumeric <= 10) {
            setNotas(prevNotas => ({
                ...prevNotas,
                [alumnoId]: {
                    secondSemester: prevNotas[alumnoId]?.secondSemester ?? '',  // Asegúrate de mantener secondSemester
                    final: notaNumeric  // Almacenar como número
                }
            }));
        }
    }

    const todasLasNotasCargadas = () => {
        return students.every(alumno => {
            const nota = notas[alumno.id];
            return (
                nota &&
                nota.secondSemester.trim() !== '' &&  // Verificar que la nota del segundo semestre no sea vacía
                nota.final > 0 && nota.final <= 10   // Verificar que final esté dentro del rango válido
            );
        });
        }

    const cargarBoletines = async () => {
        if (todasLasNotasCargadas()) {
            try {
                const result = await addSecondSemesterMarksInDatabase(subject.id, notas);

                if (result.success) {
                    alert("Boletines cargados exitosamente");
                    router.push("/reportcard/teacher")
                } else {
                    alert("Error al cargar los boletines: " + result.error)
                }
            } catch (error) {
                console.error('Error inesperado al cargar boletines: ', error);
                alert("Error inesperado al cargar los boletines")
            }
        } else {
            alert('Por favor, complete todas las notas antes de cargar los boletines');
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                        Carga de Notas - Segundo Semestre
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {subject && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{subject.name}</h3>
                                <p className="text-sm text-gray-300">{subject.gradeName} - Segundo Semestre</p>
                            </div>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-700">
                                    <TableHead className="text-white">Alumno</TableHead>
                                    <TableHead className="text-white">Nota Segundo Semestre</TableHead>
                                    <TableHead className="text-white">Nota Final</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(alumno => (
                                    <TableRow key={alumno.id} className="border-b border-gray-700">
                                        <TableCell className="text-white w-full">
                                            {alumno.user.firstName} {alumno.user.lastName}
                                        </TableCell>
                                        <TableCell className="w-56">
                                            <Select
                                                name="secondSemesterMark"
                                                value={notas[alumno.id]?.secondSemester || ''}
                                                onValueChange={(value) => handleNotaChange(alumno.id, value)}
                                            >
                                                <SelectTrigger className={`bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500 w-48`}>
                                                    <SelectValue placeholder="Selecciona una nota" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700">
                                                    {["A","B","C","D"].map((option) => (
                                                        <SelectItem
                                                            key={option}
                                                            className="bg-gray-700 text-gray-100 focus:border-gray-500"
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={notas[alumno.id]?.final > 0 ? notas[alumno.id]?.final : ''}
                                                onChange={(e) => handleNotaFinalChange(alumno.id, e.target.value)}
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
                                disabled={!todasLasNotasCargadas()}
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