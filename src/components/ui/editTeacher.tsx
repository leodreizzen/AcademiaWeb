'use client'

import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {TeacherWithUserSubject} from "@/app/(loggedin)/teacher/[id]/edit/TeacherWithSubject";

import {
    TeacherRegistrationData,
    TeacherRegistrationModel,
    updateTeacherInDatabase
} from "@/lib/models/teacher-registration";
import {FieldForm} from "@/components/ui/FieldForm";
import {Subject} from "@prisma/client";


type EditTeacherProps = {
    teacher: TeacherWithUserSubject
    allSubjects: Subject[]
}

export default function EditTeacher({teacher, allSubjects}: EditTeacherProps) {
    const {
        register,
        handleSubmit: handleSubmit1,
        formState,
        getValues,
        control: control1,
        trigger
    } = useForm<TeacherRegistrationData>({
        resolver: zodResolver(TeacherRegistrationModel), mode: "all", reValidateMode: "onChange",
        defaultValues: {
            dni: teacher.user.dni,
            phoneNumber: teacher.phoneNumber,
            name: teacher.user.firstName,
            lastName: teacher.user.lastName,
            address: teacher.address,
            email: teacher.email
        }
    });
    const router = useRouter();
    const [selectedSubjects, setSelectedSubjects] = useState(teacher.subjects);
    const isValid = formState.isValid
    const [subjectsChanged, setSubjectsChanged] = useState(false);
    useEffect(() => {
        trigger().then(() => {
        });
    }, [trigger]);

    useEffect(() => {
        checkSubjectsChanged();
    }, [selectedSubjects]);


    const handleEditTeacher = async () => {
        const result = await updateTeacherInDatabase(teacher.id, {...getValues()}, selectedSubjects);
        if (!result.success) {
            alert(result.error)
        } else {
            alert("El docente se ha modificado correctamente")
            router.push(`/teacher/${teacher.id}`)
        }
    }


    const [openGrades, setOpenGrades] = useState<{ [key: string]: boolean }>({});

// Función para manejar el toggle de cada gradeName
    const toggleGrade = (gradeName: string) => {
        setOpenGrades((prev) => ({
            ...prev,
            [gradeName]: !prev[gradeName],
        }));
    };

    // Función para manejar el cambio en los checkboxes
    const handleCheckboxChange = (subject : Subject) => {
        if (selectedSubjects.some((s) => s.id === subject.id)) {
            // Si ya está seleccionado, eliminarlo de la lista
            setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
        } else {
            // Si no está seleccionado, agregarlo a la lista
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    const checkSubjectsChanged = () => {
        const initialIds = teacher.subjects.map((s) => s.id).sort();
        const currentIds = selectedSubjects.map((s) => s.id).sort();

        // Comparar ambos arrays
        if (initialIds.length !== currentIds.length) {
            setSubjectsChanged(true);
            return;
        }

        for (let i = 0; i < initialIds.length; i++) {
            if (initialIds[i] !== currentIds[i]) {
                setSubjectsChanged(true);
                return;
            }
        }

        setSubjectsChanged(false); // No hay cambios
    };


    // Agrupamos las materias por gradeName
    const groupedSubjects = allSubjects.reduce((acc: { [key: string]: Subject[] }, subject: Subject) => {
        if (!acc[subject.gradeName]) {
            acc[subject.gradeName] = [];
        }
        acc[subject.gradeName].push(subject);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        {"Modificar Docente"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <FieldForm label="Nombre" type="string" registerRes={register("name")}
                                               errors={formState.errors}/>
                                </div>
                                <div className="flex-1">
                                    <FieldForm label="Apellido" type="string" registerRes={register("lastName")}
                                               errors={formState.errors}/>
                                </div>
                            </div>
                            <div>
                                <FieldForm label="Teléfono" type="number" registerRes={register("phoneNumber")}
                                           errors={formState.errors}/>
                            </div>
                            <div className="md:col-span-2">
                                <FieldForm label="Correo electrónico" type="string" registerRes={register("email")}
                                           errors={formState.errors}/>
                            </div>
                            <div className="md:col-span-2">
                                <FieldForm label="Dirección" type="string" registerRes={register("address")}
                                           errors={formState.errors}/>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-gray-100 mb-2 block">Elija una o más materias:</label>
                                {Object.keys(groupedSubjects).map((gradeName) => (
                                    <div key={gradeName} className="mb-4">
                                        {/* Título desplegable */}
                                        <div
                                            className="cursor-pointer flex items-center justify-between bg-gray-700 p-2 rounded-md"
                                            onClick={() => toggleGrade(gradeName)}
                                        >
                                            <h3 className="font-bold text-lg text-gray-100">{gradeName}</h3>
                                            <span className="text-gray-400">
                            {openGrades[gradeName] ? "▲" : "▼"}
                        </span>
                                        </div>

                                        {/* Lista de materias, visible solo si el grupo está abierto */}
                                        {openGrades[gradeName] && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                {groupedSubjects[gradeName].map((subject) => (
                                                    <div key={subject.id} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`subject-${subject.id}`}
                                                            checked={selectedSubjects.some((s) => s.id === subject.id)}
                                                            onChange={() => handleCheckboxChange(subject)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`subject-${subject.id}`}
                                                               className="text-gray-100">
                                                            {subject.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* Mostrar si las materias han cambiado */}
                                {subjectsChanged &&
                                    <p className="text-yellow-500">Las materias seleccionadas han cambiado.</p>}
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit1(handleEditTeacher)}
                            disabled={(!isValid || !Object.values(formState.dirtyFields).some(value => value === true)) && !subjectsChanged}
                            className="w-full bg-green-600 text-white hover:bg-green-500"
                        >
                            Editar
                        </Button>
                    </>
                </CardContent>
            </Card>
        </div>
    );
}