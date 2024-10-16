'use client';

import {ParentWithUser, StudentWithUserAndParent} from "@/lib/definitions/parent";
import {useForm} from "react-hook-form";
import {StudentDataWithoutGrade, StudentSchemaWithoutGrade} from "@/lib/models/studentParent";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {updateStudentInDataBase} from "@/app/(loggedin)/student/add/studentParentBack";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {FieldForm} from "@/components/ui/FieldForm";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {FieldCalendar} from "@/components/ui/FieldCalendar";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {NoResultCard} from "@/components/list/NoResultCard";
import PaginationControlsWithEndpoint from "@/app/(loggedin)/student/add/paginationControlsWithEndpoint";
import {ParentAPIResponse} from "@/app/api/internal/parent/types";
import {ParentCountAPIResponse} from "@/app/api/internal/parent/count/types";
import { Separator } from "@/components/ui/separator"


export default function EditStudent({student, id, grades, numberPages, firstParents} : {student: StudentWithUserAndParent, id: number, grades : string[], numberPages: number, firstParents : ParentWithUser[]}) {
    const {register, handleSubmit: handleSubmit1, formState, getValues, control: control1, trigger} = useForm<StudentDataWithoutGrade>({resolver: zodResolver(StudentSchemaWithoutGrade), mode: "all", reValidateMode: "onChange",
    defaultValues:{
        dni: student.user.dni,
        phoneNumber: student.phoneNumber,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        address: student.address,
        email: student.email,
        birthDate: student.birthdate
    }});
    const router = useRouter();
    const [grade, setGrade] = useState(student.gradeName);
    const isValid = formState.isValid
    const [step, setStep] = useState(1)
    const [selectedParents, setSelectedParents] = useState(student.parents)
    const [parentsChanged, setParentsChanged] = useState(false)
    const [searchDNI, setSearchDNI] = useState('')
    const [searchLastName, setSearchLastName] = useState('')
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(numberPages)
    const [parents, setParents] = useState<ParentWithUser[]>(firstParents)
    const [lastQuery, setLastQuery] = useState({
        page: 1,
        dni: "",
        lastName: "",
    })

    useEffect(() => {
        trigger().then(()=>{});
    }, [trigger]);

    const handleParentsChanged = () => {
        if(!parentsChanged)
            setParentsChanged(true)
    }

    const handleSelectedParent = (e: React.MouseEvent, parent: ParentWithUser) => {
        e.preventDefault()
        if (selectedParents.some(p => p.id === parent.id)) {
            const newSelectedParents = selectedParents.filter(p => p.id !== parent.id);
            setSelectedParents(newSelectedParents);
            fetchParents(lastQuery.page, lastQuery.dni, lastQuery.lastName, newSelectedParents.map(parent => parent.user.dni));
        } else if (selectedParents.length < 2)
            setSelectedParents([...selectedParents, parent])
        }


    const changeStep = () => {
        if(step===1)
            setStep(2)
        else
            setStep(1)
    }

    const handleEditStudent = async () => {
        const result = await updateStudentInDataBase(id,{...getValues(), gradeName: grade}, selectedParents);
        if (!result.success) {
            alert(result.error)
        } else {
            alert("El alumno se ha modificado correctamente")
            router.push(`/student/${id}`)
        }
    }


    const handlePageChange = (page: number) => {
        setPage(page);
        fetchParents(page, searchDNI, searchLastName, selectedParents.map(parent => parent.user.dni));
    }


    const handleSearch = async () => {
        setPage(1);
        try {
            const pages = await pageCountParents(searchDNI, searchLastName);
            setPageCount(pages);
        } catch (error) {
            alert((error as Error).message)
        }
        fetchParents(1, searchDNI, searchLastName, selectedParents.map(parent => parent.user.dni));
    }

    async function pageCountParents(dni: string, lastName: string){
        const searchParams = new URLSearchParams();
        searchParams.set("dni", dni);
        searchParams.set("lastName", lastName);
        const res = await fetch(`/api/internal/parent/count?${searchParams.toString()}`);
        if (res.ok) {
            const respuestaJson = await res.json() as ParentCountAPIResponse;
            return respuestaJson.pages;
        } else {
           throw new Error("Fallo al buscar los responsables");
        }
    }

    const handleDniEdit = (dni: string) => {
        setSearchDNI(dni);
        setSearchLastName("")
    }

    const handleLastNameEdit = (lastName: string) => {
        setSearchDNI("");
        setSearchLastName(lastName)
    }

    function fetchParents(page: number, dni: string, lastName: string, exclude: number[]){
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set("dni", dni);
        searchParams.set("lastName", lastName);
        searchParams.set("exclude", exclude.join(","))
        fetch(`/api/internal/parent?${searchParams.toString()}`).then(async (res) => {
            let respuestaJson;
            if (res.ok) {
                respuestaJson = await res.json() as ParentAPIResponse;
                setParents(respuestaJson)
                setLastQuery({page,dni,lastName});
            } else {
                alert("Fallo al buscar los responsables");
            }
        })
    }

    function ParentCard({parent}: {parent: ParentWithUser}){
        return (
            <Card className="bg-gray-700">
                <CardContent className="flex items-center justify-between p-3">
                    <div>
                        <p className="font-semibold text-white text-xl">{parent.user.firstName} {parent.user.lastName}</p>
                        <p className="text-base text-gray-400 mt-1">DNI: {parent.user.dni}</p>
                    </div>
                    <div className="space-x-3">
                        <Button
                            onClick={(e) => {handleSelectedParent(e, parent); handleParentsChanged()}}
                            className={`${
                                selectedParents.some(p => p.id === parent.id)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-100'
                            } hover:bg-blue-500`}
                            disabled={selectedParents.length === 2 && !selectedParents.some(p => p.id === parent.id)}
                        >
                            {selectedParents.some(p => p.id === parent.id) ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        {step === 1 ? "Modificar Alumno" : "Modificar Responsable"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step===1 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <FieldForm label="Nombre" type="string" registerRes={register("firstName")}
                                                   errors={formState.errors}/>
                                    </div>
                                    <div className="flex-1">
                                        <FieldForm label="Apellido" type="string" registerRes={register("lastName")}
                                                   errors={formState.errors}/>
                                    </div>
                                </div>
                                <div>
                                    <FieldForm label="Telefono" type="number" registerRes={register("phoneNumber")}
                                               errors={formState.errors}/>
                                </div>
                                <div>
                                    <Label htmlFor="orden" className="text-gray-300">Año asociado</Label>
                                    <Select
                                        name="anio"
                                        value={grade}
                                        onValueChange={setGrade}
                                    >
                                        <SelectTrigger
                                            className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
                                            <SelectValue placeholder="Elija un año"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700">
                                            {grades.map((grade) => (
                                                <SelectItem
                                                    key={grade}
                                                    className="bg-gray-700 text-gray-100 focus:border-gray-500"
                                                    value={grade}
                                                >
                                                    {grade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <FieldForm label="Correo electrónico" type="string" registerRes={register("email")}
                                               errors={formState.errors}/>
                                </div>
                                <div className="md:col-span-2">
                                    <FieldForm label="Direccion" type="string" registerRes={register("address")}
                                               errors={formState.errors}/>
                                </div>
                                <div className="md:col-span-2">
                                    <FieldCalendar control={control1} label={"Fecha de nacimiento"}
                                                   registerRes={register("birthDate")}
                                                   errors={formState.errors}/>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-400 mb-2 block">Responsables</Label>
                                <div className="space-y-3">
                                    {selectedParents.map((parent, index) => (
                                        <div key={index} className="bg-gray-700 p-3 rounded-lg">
                                            <p className="font-semibold">{parent.user.lastName} {parent.user.firstName}</p>
                                            <p className="text-sm text-gray-300">DNI: {parent.dni}</p>
                                        </div>

                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    onClick={changeStep}
                                    className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500 mt-6"
                                >
                                    Editar responsables
                                </Button>
                            </div>
                            <Button
                                onClick={handleSubmit1(handleEditStudent)}
                                disabled={(!isValid || !Object.values(formState.dirtyFields).some(value => value === true)) && !parentsChanged}
                                className="w-full bg-green-600 text-white hover:bg-green-500"
                            >
                                Editar
                            </Button>


                        </>


                    ) : (

                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">

                                    <div className="flex space-x-3">
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Buscar por DNI"
                                            value={searchDNI}
                                            onChange={(e) => handleDniEdit(e.target.value)}
                                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <Input
                                        type="text"
                                        placeholder="Buscar por Apellido"
                                        value={searchLastName}
                                        onChange={(e) => handleLastNameEdit(e.target.value)}
                                        className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
                                    />
                                    <Button type="button" onClick={handleSearch} variant="secondary"
                                            className="bg-gray-600 hover:bg-gray-500 px-5">
                                        <Search className="h-5 w-5"/>
                                    </Button>
                                </div>
                            </div>

                            {
                                selectedParents.map((parent) => (
                                    <ParentCard parent={parent} key={parent.id}/>
                                ))
                            }
                            <Separator/>

                            {
                                parents.length == 0 && <NoResultCard user="responsables"/>
                            }

                            {parents.filter(parent => !selectedParents.map(parent=>parent.id).includes(parent.id)).map((parent) => (
                                <ParentCard parent={parent} key={parent.id}/>
                            ))}
                            <PaginationControlsWithEndpoint onAction={handlePageChange} currentPage={page}
                                                            lastPage={pageCount}/>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    changeStep()
                                }}
                                disabled={selectedParents.length === 0}
                                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                            >
                                Volver
                            </Button>
                        </>


                    )}


                </CardContent>
            </Card>
        </div>
    )
}
