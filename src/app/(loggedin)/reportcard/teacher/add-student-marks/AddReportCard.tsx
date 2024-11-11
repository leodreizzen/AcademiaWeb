"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Subject } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    GetSubjectsWithReportCardStatusReturnType
} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchGradeReportCardByYearAndGrade";
import {usePathname, useRouter, useSearchParams} from "next/navigation";


type PrincipalProps = {
    subjects: Subject[];
    result: GetSubjectsWithReportCardStatusReturnType;
};

export default function AddReportCard({ subjects, result }: PrincipalProps) {
    const [materiaSeleccionada, setMateriaSeleccionada] = useState<Subject | null>(null);
    const [semestreSeleccionado, setSemestreSeleccionado] = useState('');
    const [notasCargadas, setNotasCargadas] = useState<{ [key: number]: { semestre1: boolean; semestre2: boolean } }>({});
    const {push} = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const obtenerEstadoNotas = async (subjectId: number) => {
        const value = result.get(subjectId);
        if (value?.canLoad == false)
            return { semestre1: true, semestre2: true };
        else
            if(value?.currentSemester == "first")
                return { semestre1: false, semestre2: false };
            else
                return { semestre1: true, semestre2: false };

    };


    useEffect(() => {
        const cargarEstadoNotas = async () => {
            const estadoNotas: { [key: number]: { semestre1: boolean; semestre2: boolean } } = {};
            for (const subject of subjects) {
                const notas = await obtenerEstadoNotas(subject.id);
                estadoNotas[subject.id] = notas;
            }
            setNotasCargadas(estadoNotas);
        };
        cargarEstadoNotas();
    }, [subjects]);

    const seleccionarMateria = (materia: Subject) => {
        setMateriaSeleccionada(materia);
        setSemestreSeleccionado('');  // Resetea la selección de semestre
    };

    const getSemestreButtonText = (subjectId: number) => {
        const notas = notasCargadas[subjectId];
        if (!notas) return 'Cargando...';
        if (!notas.semestre1) return 'Cargar Primer Semestre';
        if (notas.semestre1 && !notas.semestre2) return 'Cargar Segundo Semestre';
        return 'Notas Completas';
    };

    const isSemestreButtonDisabled = (subjectId: number) => {
        const notas = notasCargadas[subjectId];
        return notas ? notas.semestre1 && notas.semestre2 : true;
    };

    const handleSemestreClick = (subjectId: number) => {
        const notas = notasCargadas[subjectId];
        if (!notas?.semestre1) {
            setSemestreSeleccionado('1');
        } else if (!notas?.semestre2) {
            setSemestreSeleccionado('2');
        }
        const newParams = new URLSearchParams(searchParams);
        newParams.set('idSubject', String(subjectId));
        push(`${pathname}/add-student-marks/?${newParams.toString()}`);

    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                        Carga de boletines: Selección de Materia y Semestre
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {subjects.map((subject: Subject) => (
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
                                                e.stopPropagation();
                                                handleSemestreClick(subject.id);

                                            }}
                                            disabled={isSemestreButtonDisabled(subject.id)}
                                            className={`${
                                                isSemestreButtonDisabled(subject.id) ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white`}
                                        >
                                            {getSemestreButtonText(subject.id)}
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
                                
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}