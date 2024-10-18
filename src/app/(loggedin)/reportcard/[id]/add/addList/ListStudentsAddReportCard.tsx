'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Datos de ejemplo (en una aplicación real, estos vendrían de una API o base de datos)
const materias = [
    { id: 1, nombre: 'Matemáticas', curso: '1° Año', semestres: [] },
    { id: 2, nombre: 'Literatura', curso: '2° Año', semestres: [] },
    { id: 3, nombre: 'Historia', curso: '3° Año', semestres: [] },
    { id: 4, nombre: 'Biología', curso: '4° Año', semestres: [] },
]

const alumnos = [
    { id: 1, nombre: 'Ana García' },
    { id: 2, nombre: 'Carlos Rodríguez' },
    { id: 3, nombre: 'Elena Martínez' },
    { id: 4, nombre: 'David López' },
]

export default function ListadoAlumnos() {
    const router = useRouter()
    const { materiaId, semestre } = router.query
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
    const [notas, setNotas] = useState({})
    const [boletinesCargados, setBoletinesCargados] = useState(false)

    useEffect(() => {
        if (materiaId) {
            const materia = materias.find(m => m.id === parseInt(materiaId as string))
            setMateriaSeleccionada(materia)
        }
    }, [materiaId])

    const handleNotaChange = (alumnoId, nota) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [alumnoId]: nota
        }))
    }

    const todasLasNotasCargadas = () => {
        return alumnos.every(alumno => notas[alumno.id] && notas[alumno.id].trim() !== '')
    }

    const cargarBoletines = () => {
        if (todasLasNotasCargadas()) {
            // Aquí iría la lógica para enviar las notas al servidor
            console.log('Notas cargadas:', notas)
            setBoletinesCargados(true)
            toast.success('Boletines cargados exitosamente')
        } else {
            toast.error('Por favor, complete todas las notas antes de cargar los boletines')
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
                                <h3 className="text-lg font-semibold">{materiaSeleccionada.nombre}</h3>
                                <p className="text-sm text-gray-300">{materiaSeleccionada.curso} - {semestre === '1' ? 'Primer' : 'Segundo'} Semestre</p>
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
                                {alumnos.map(alumno => (
                                    <TableRow key={alumno.id} className="border-b border-gray-700">
                                        <TableCell className="text-white">{alumno.nombre}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
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
                            <Link href="/" passHref>
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
            <ToastContainer
                position="bottom-right"
                theme="dark"
            />
        </div>
    )
}