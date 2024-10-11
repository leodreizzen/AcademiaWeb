"use client"

import "./styles.css"
import React, {useEffect, useState} from "react"
import {useForm, Controller} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import Select, {MultiValueGenericProps, components, ClassNamesConfig} from "react-select"
import {Button} from "@/components/ui/button"
import {TextArea} from "@/components/ui/textarea"
import {Grade} from "@prisma/client";
import {FieldNullable} from "@/lib/definitions";
import {ReprimandStudentApiResponse} from "@/app/api/internal/reprimand/student/types";
import {ReprimandData, ReprimandModel} from "@/lib/models/reprimand";
import {CreateReprimand} from "@/lib/actions/reprimand";

interface StudentOptionType {
    value: number;
    label: string;
}

const customStyles: ClassNamesConfig<any, any> = {
    control: (state) =>
        `!bg-gray-700 !border-gray-600 ${state.isFocused ? '!focus:outline-none !focus:ring-2 !focus:ring-blue-500' : ''}`,
    menu: () =>
        '!bg-gray-700 multiselect-scrollbar',
    option: (state) =>
        `!text-white ${state.isFocused ? '!bg-gray-600' : '!bg-gray-700'}`,
    singleValue: () =>
        '!text-white',
    multiValue: () =>
        '!bg-amber-800 !rounded-xl',
    multiValueLabel: () =>
        '!text-white',
    multiValueRemove: () =>
        '!text-white !hover:bg-blue-600',
    input: () =>
        '!text-white',
};



type FormData = FieldNullable<ReprimandData, "grade">

type StudentForList = {
    id: number,
    dni: number,
    firstName: string,
    lastName: string,
}


function isValidReprimandData(data: FormData): data is ReprimandData {
    return data.grade !== null && !!data.message && !!data.students?.length;
}

export default function AddReprimandForm({grades}: { grades: Grade[] }) {
    const {reset, watch,getValues, setValue, control, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(ReprimandModel),
        mode: "all",
        defaultValues: {
            students: [],
            grade: null,
            message: "",
        }
    })
    const [students, setStudents] = useState<StudentForList[]>([]);
    const watchGrade = watch("grade")
    const [studentsLoading, setStudentsLoading] = useState(false);

    const studentOptions = students.toSorted((a,b) => a.lastName.localeCompare(b.lastName)).map(student => ({value: student.id, label: `${student.firstName} ${student.lastName} (${student.dni})`}))
    if(studentOptions.length > 0 && getValues("students").length < studentOptions.length)
        studentOptions.unshift({value: -1, label: "Seleccionar todos"})
    const gradeOptions = grades.map(grade => ({value: grade.name, label: grade.name}))
    async function onSubmit(data: FormData) {
        if(!isValidReprimandData(data))
            return;
        const res = await CreateReprimand(data)
        if(res.success) {
            alert("Amonestación creada con éxito")
            reset({students: [], grade: null, message: ""});
            setStudents([]);
        }
        else
            alert("Error: " + res.error)
    }

    useEffect(() => {
        if (watchGrade) {
            fetchStudents(watchGrade).catch();
        }
    }, [watchGrade])

    async function fetchStudents(grade: string) {
        setStudentsLoading(true);
        setStudents([]);
        setValue("students", []);
        const searchParams = new URLSearchParams();
        searchParams.set("grade", grade);
        fetch(`/api/internal/reprimand/student?${searchParams.toString()}`).then(async (res) => {
            setStudentsLoading(false);
            if (res.ok) {
                const response = await res.json() as ReprimandStudentApiResponse;
                setStudents(response)
            } else {
                alert("Error al obtener alumnos");
            }
        }).catch(() => {
          setStudentsLoading(false);
          alert("Error al obtener alumnos");
        })
    }

    function CustomMultiValueLabel(props: MultiValueGenericProps<StudentOptionType, true>) {
        const student = students.find(student => student.id === props.data.value);
        return (
            <components.MultiValueLabel {...props}>
                {student?.firstName[0]??""}. {student?.lastName}
            </components.MultiValueLabel>
        );
    }

    return (
        <div className="text-white flex items-center justify-center p-4 min-h-full">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold mb-6">Registrar Amonestación</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium mb-2">
                            Año:
                        </label>
                        <Controller
                            name="grade"
                            control={control}
                            render={({field}) => (
                                <Select
                                    noOptionsMessage={() => "No hay cursos disponibles"}
                                    key={field.value}
                                    isSearchable={false}
                                    {...field}
                                    classNames={customStyles}
                                    onChange={e => field.onChange(e?.value)}
                                    value={gradeOptions.find(option => option.value === field.value)}
                                    options={grades.map(grade => ({value: grade.name, label: grade.name}))}
                                    className="text-white"
                                    classNamePrefix="select"
                                    placeholder="Seleccionar el año"
                                />
                            )}
                        />
                        {errors.grade && <p className="mt-1 text-sm text-red-500">{errors.grade.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="students" className="block text-sm font-medium mb-2">
                            Alumnos:
                        </label>
                        <Controller
                            name="students"
                            control={control}
                            render={({field}) => (
                                <Select<StudentOptionType,true>
                                    classNames={customStyles}
                                    {...field}
                                    onChange={e => {
                                        if(e?.find(option => option.value === -1)){
                                            field.onChange(students.map(student => student.id))
                                        }
                                        else
                                            field.onChange(e?.map(option => option.value))
                                    }}
                                    loadingMessage={() => "Cargando..."}
                                    noOptionsMessage={() => "No se encontraron resultados"}
                                    value={field.value.map(value => studentOptions.find(option => option.value === value)).filter(it=>it!==undefined)}
                                    options={studentOptions}
                                    isMulti
                                    components = {{MultiValueLabel: CustomMultiValueLabel}}
                                    isLoading = {studentsLoading}
                                    className="text-white"
                                    classNamePrefix="select"
                                    placeholder="Buscar alumnos"
                                />
                            )}
                        />
                        {errors.students && <p className="mt-1 text-sm text-red-500">{errors.students.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Mensaje de amonestación:
                        </label>
                        <Controller
                            name="message"
                            control={control}
                            render={({field}) => (
                                <TextArea
                                    {...field}
                                    placeholder="Escribe el mensaje de amonestación aquí..."
                                    className="w-full h-32 bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                />
                            )}
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Cargar
                    </Button>
                </form>
            </div>
        </div>
    )
}