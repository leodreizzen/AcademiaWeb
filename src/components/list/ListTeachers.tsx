"use client"

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Search, Edit, Eye, Plus} from 'lucide-react'
import PaginationControls from "@/components/list/PaginationControls"
import {TeacherWithUser} from "@/app/(loggedin)/teacher/data"
import {usePathname, useRouter} from "next/navigation"
import {NoResultCard} from "@/components/list/NoResultCard";
import {Tooltip} from "@nextui-org/tooltip";

type PrincipalProps = {
    data: TeacherWithUser[];
    count: number;
    numberOfTeachers: number;
};


export function ListTeachers({data, count, numberOfTeachers}: PrincipalProps) {
    const [dni, setDni] = useState("")
    const [lastName, setLastName] = useState("")
    const {replace, push} = useRouter();
    const pathname = usePathname();

    const handleSearch = () => {
        const params = new URLSearchParams({
            dni: dni,
            lastName: lastName
        });

        replace(`${pathname}?${params.toString()}`);
    };

    const handleDniEdit = (dni: string) => {
        setDni(dni);
        setLastName("")
    }

    const handleLastNameEdit = (lastName: string) => {
        setDni("");
        setLastName(lastName)
    }

    const handleEdit = (id: number) => {
        console.log(`Edit teacher with id: ${id}`)
        // Implement edit functionality here
    }

    const handleView = (id: number) => {
        push(`/teacher/${id}`)
    }

    const handleCreate = () => {
        push("/teacher/add")
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Listado de Docentes</h2>
                    <Tooltip content="Nuevo docente" classNames={{content: "text-white"}}>
                        <Button onClick={handleCreate} variant="secondary"
                                test-id="add-teacher-button"
                                className="bg-green-600 hover:bg-green-500 text-white">
                            <Plus className="h-4 w-4"/>
                        </Button>
                    </Tooltip>

                </div>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Input
                            type="text"
                            placeholder="Buscar por DNI"
                            value={dni}
                            onChange={(e) => handleDniEdit(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
                        />
                        <Input
                            type="text"
                            placeholder="Buscar por Apellido"
                            value={lastName}
                            onChange={(e) => handleLastNameEdit(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
                        />
                        <Tooltip content="Buscar" classNames={{content: "text-white"}}>
                            <Button onClick={handleSearch} variant="secondary"
                                    test-id="search-button"
                                    className="bg-gray-600 hover:bg-gray-500 px-5 w-full sm:w-auto">
                                <Search className="h-5 w-5"/>
                            </Button>
                        </Tooltip>

                    </div>
                </div>
                <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
                    {numberOfTeachers === 0 && <NoResultCard user="docentes"/>}
                    {data.map(teacher => (
                        <Card key={teacher.id} className="bg-gray-700">
                            <CardContent
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 space-y-3 sm:space-y-0">
                                <div>
                                    <p className="font-semibold text-white text-xl">{teacher.user.firstName} {teacher.user.lastName}</p>
                                    <p className="text-base text-gray-400 mt-1">DNI: {teacher.user.dni}</p>
                                </div>
                                <div className="flex space-x-3 w-full sm:w-auto">
                                    <Tooltip content="Editar" classNames={{content: "text-white"}}>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(teacher.id)}
                                                test-id="edit-teacher-button"
                                                className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                    </Tooltip>


                                    <Tooltip content="Ver" classNames={{content: "text-white"}}>
                                        <Button variant="outline" size="sm" onClick={() => handleView(teacher.id)}
                                                test-id="view-teacher-button"
                                                className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                                            <Eye className="h-4 w-4"/>
                                        </Button>
                                    </Tooltip>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-6">
                    <PaginationControls cantPages={count}/>
                </div>
            </div>
        </div>
    )
}