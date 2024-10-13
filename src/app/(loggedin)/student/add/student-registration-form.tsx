'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {addStudentToDataBase, addParentToDataBase} from "@/app/(loggedin)/student/add/studentBack";
import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";
import PaginationControlsWithEndpoint from "@/app/(loggedin)/student/add/paginationControlsWithEndpoint";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {StudentSchemaWithoutGrade, StudentDataWithoutGrade, ParentData, ParentSchema} from "@/lib/models/studentParent";
import {FieldForm} from "@/components/ui/FieldForm";
import {ParentAPIResponse} from "@/app/api/internal/parent/types";
import {Search} from "lucide-react";
import {NoResultCard} from "@/components/list/NoResultCard";
import {FieldCalendar} from "@/components/ui/FieldCalendar";


type PrincipalProps = {
    data: ParentWithUser[];
    count: number;
};



export function StudentRegistrationFormComponent({data, count}: PrincipalProps) {
    const {register, handleSubmit: handleSubmit1, formState, getValues, control: control1} = useForm<StudentDataWithoutGrade>({resolver: zodResolver(StudentSchemaWithoutGrade), mode: "all", reValidateMode: "onChange"});
    const {register: register2, handleSubmit: handleSubmit2, formState: formState2, getValues: getValues2 , resetField, control} = useForm<ParentData>({resolver: zodResolver(ParentSchema), mode: "all", reValidateMode: "onChange"});
    const [grade, setGrade] = useState("");
    const isValid = formState.isValid && grade !== "";
    const isValid2 = formState2.isValid
    const [noParents, setNoParents] = useState(false)
    const [step, setStep] = useState(1)
    const [page, setPage] = useState(1)
    const [searchDNI, setSearchDNI] = useState('')
    const [searchLastName, setSearchLastName] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [parents, setParents] = useState<ParentWithUser[]>(data)
    const [selectedParents, setSelectedParents] = useState<ParentWithUser[]>([])

    const [grades, setGrades] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGradesData = async () => {
            const response = await fetchGrades();
            setGrades(response.map((grade) => grade.name));
        };

        fetchGradesData();
    }, []);


    const handleSelectedParent = (e: React.MouseEvent, parent: ParentWithUser) => {
        e.preventDefault()
        if (selectedParents.some(p => p.id === parent.id)) {
            setSelectedParents(selectedParents.filter(p => p.id !== parent.id))
        } else if (selectedParents.length < 2) {
            setSelectedParents([...selectedParents, parent])
        }

    }


    const continueNextStep = () => {
        if (step === 1 && isValid) {
            setStep(2)
        }
    }

    const handleSubmitStep2 = async (e: React.FormEvent) => {

        e.preventDefault();
        if (step === 2 && selectedParents.length > 0) {
            const resul = await addStudentToDataBase({...getValues(), gradeName: grade}, selectedParents)
            console.log("BUENAS", resul)
            if (!resul.success) {
                alert(resul.error)
            } else {
                alert("El alumno se ha registrado correctamente")
                router.push("/student")
            }
        }
    }

    const handleCreateNewParent = async () => {
        const result = await addParentToDataBase(getValues2());
        if (!result.success) {
            alert(result.error)
        } else {
            alert("El responsable se ha registrado correctamente")
            setIsDialogOpen(false)
            resetField("dni")
            resetField("phoneNumber")
            resetField("name")
            resetField("surname")
            resetField("address")
            resetField("email")

        }

    }

    const handlePageChange = (page: number) => {
        setPage(page);
        fetchParents(page, searchDNI, searchLastName);
    }


    const handleSearch = () => {
        setPage(1);
        fetchParents(1, searchDNI, searchLastName);
    }

    const handleDniEdit = (dni: string) => {
        setSearchDNI(dni);
        setSearchLastName("")
    }

    const handleLastNameEdit = (lastName: string) => {
        setSearchDNI("");
        setSearchLastName(lastName)
    }

    function fetchParents(page: number, dni: string, lastName: string){
        const searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        searchParams.set("dni", dni);
        searchParams.set("lastName", lastName);
        fetch(`/api/internal/parent?${searchParams.toString()}`).then(async (res) => {
            let respuestaJson;
            if (res.ok) {
                respuestaJson = await res.json() as ParentAPIResponse;
                respuestaJson.length === 0 ? setNoParents(true) : setNoParents(false);
                setParents(respuestaJson)

            } else {
                alert("Fallo al buscar los responsables");
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                        {step === 1 ? "Registrar Alumno" : "Asociar Responsable"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <>
                            <form onSubmit={handleSubmit1(continueNextStep)} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FieldForm label="DNI" type="number" registerRes={register("dni")} errors={formState.errors}/>
                                        <FieldForm label="Telefono" type="number" registerRes={register("phoneNumber")} errors={formState.errors}/>
                                        <FieldForm label="Nombre" type="string" registerRes={register("firstName")} errors={formState.errors}/>
                                        <FieldForm label="Apellido" type="string" registerRes={register("lastName")} errors={formState.errors}/>
                                        <FieldForm label="Direccion" type="string" registerRes={register("address")} errors={formState.errors}/>
                                        <FieldForm label="Correo electrónico" type="string" registerRes={register("email")} errors={formState.errors}/>
                                        <FieldCalendar control={control1} label={"Fecha de nacimiento"} registerRes={register("birthDate")} errors={formState.errors}/>
                                        <div className="space-y-2">
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
                                                <SelectContent>
                                                    {grades.map((grade) => (
                                                        <SelectItem
                                                            key={grade}
                                                            className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                                                            value={grade}
                                                        >
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>



                                    </div>
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                                >
                                    Siguiente
                                </Button>


                            </form>

                        </>

                    ) : (

                        <>
                            <form onSubmit={handleSubmitStep2} className="space-y-6">
                                <div className="space-y-4">
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
                                        noParents &&
                                        <NoResultCard user="responsables"/>
                                    }

                                    {parents.map((parent) => (
                                        <Card key={parent.id} className="bg-gray-700">
                                            <CardContent className="flex items-center justify-between p-3">
                                            <div>
                                                    <p className="font-semibold text-white text-xl">{parent.user.firstName} {parent.user.lastName}</p>
                                                    <p className="text-base text-gray-400 mt-1">DNI: {parent.user.dni}</p>
                                                </div>
                                                <div className="space-x-3">
                                                    <Button
                                                        onClick={(e) => handleSelectedParent(e, parent)}
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
                                    ))}
                                    <PaginationControlsWithEndpoint onAction={handlePageChange} currentPage={page} lastPage={count}/>
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-green-600 text-white hover:bg-green-500 w-full mt-4">
                                                Nuevo Responsable
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-800 text-gray-100">
                                            <DialogHeader>
                                                <DialogTitle>Nuevo Responsable</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <FieldForm label="DNI" type="number" registerRes={register2("dni")} errors={formState2.errors}/>
                                                <FieldForm label="Telefono" type="number" registerRes={register2("phoneNumber")} errors={formState2.errors}/>
                                                <FieldForm label="Nombre" type="string" registerRes={register2("name")} errors={formState2.errors}/>
                                                <FieldForm label="Apellido" type="string" registerRes={register2("surname")} errors={formState2.errors}/>
                                                <FieldForm label="Direccion" type="string" registerRes={register2("address")} errors={formState2.errors}/>
                                                <FieldForm label="Correo electrónico" type="string" registerRes={register2("email")} errors={formState2.errors}/>
                                                <FieldCalendar control={control} label={"Fecha de nacimiento"} registerRes={register2("birthDate")} errors={formState2.errors}/>
                                                <Button
                                                    onClick={handleSubmit2(handleCreateNewParent)}
                                                    disabled={!isValid2}
                                                    className="w-full bg-green-600 text-white hover:bg-green-500"
                                                >
                                                    Agregar
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>


                                </div>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setStep(1)
                                        }}
                                        className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                                    >
                                        Volver
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={selectedParents.length === 0}
                                        className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                                    >
                                        Registrar
                                    </Button>
                                </CardFooter>
                            </form>
                        </>
                    )}
                </CardContent>

            </Card>
        </div>
    )
}