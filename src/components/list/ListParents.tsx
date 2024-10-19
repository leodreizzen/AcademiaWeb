"use client"

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Search, Edit, Eye, Trash2} from 'lucide-react'
import PaginationControls from "@/components/list/PaginationControls";

import {usePathname, useRouter} from "next/navigation";
import {removeParent} from '@/app/(loggedin)/parent/removeParent';
import {NoResultCard} from "@/components/list/NoResultCard";
import {ParentWithUser} from "@/lib/definitions/parent";
import {Tooltip} from "@nextui-org/tooltip";

type PrincipalProps = {
    data: ParentWithUser[];
    count: number;
    numberOfParents: number;
};


export function ListParents({data, count, numberOfParents}: PrincipalProps) {
    const [dni, setDni] = useState("")
    const [lastName, setLastName] = useState("")
    const {push, replace, refresh} = useRouter();
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
        push(`/parent/${id}/edit`)
    }

    const handleView = (id: number) => {
        push(`/parent/${id}`)
    }

    const handleRemove = async (id: number) => {
        const error = await removeParent(id);
        if (error == null) {
            refresh();
        } else {
            alert(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-6 text-white text-center">Listado de Responsables</h2>
                <div className="space-y-4">
                    <div className="flex space-x-3">
                        <Input
                            type="text"
                            placeholder="Buscar por DNI"
                            value={dni}
                            onChange={(e) => handleDniEdit(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <Input
                            type="text"
                            placeholder="Buscar por Apellido"
                            value={lastName}
                            onChange={(e) => handleLastNameEdit(e.target.value)}
                            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
                        />
                        <Tooltip content="Buscar" classNames={{content: "text-white"}}>
                            <Button onClick={handleSearch} variant="secondary"
                                    test-id = "search-button"
                                    className="bg-gray-600 hover:bg-gray-500 px-5">
                                <Search className="h-5 w-5"/>
                            </Button>
                        </Tooltip>

                    </div>
                </div>
                <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
                    {numberOfParents === 0 && <NoResultCard user={"responsables"}/>}
                    {data.map(parent => (
                        <Card key={parent.id} className="bg-gray-700">
                            <CardContent className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-semibold text-white text-xl">{parent.user.firstName} {parent.user.lastName}</p>
                                    <p className="text-base text-gray-400 mt-1">DNI: {parent.user.dni}</p>
                                </div>
                                <div className="space-x-3 text-nowrap">
                                    <Tooltip content="Editar" classNames={{content: "text-white"}}>
                                        <Button variant="outline" size="default" onClick={() => handleEdit(parent.id)}
                                                test-id="edit-parent"
                                                className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Ver" classNames={{content: "text-white"}}>
                                        <Button variant="outline" size="default" onClick={() => handleView(parent.id)}
                                                test-id="view-parent"
                                                className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500">
                                            <Eye className="h-4 w-4"/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Borrar" classNames={{content: "text-white"}}>
                                        <Button variant="outline" size="default" onClick={() => handleRemove(parent.id)}
                                                test-id="remove-parent"
                                                className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </Tooltip>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <PaginationControls cantPages={count}/>
            </div>
        </div>
    )
}