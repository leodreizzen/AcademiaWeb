'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Search, Eye, Plus} from "lucide-react"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ReprimandWithTeacherUser} from "@/app/(loggedin)/reprimand/data";
import PaginationControls from "@/components/list/PaginationControls";
import {Tooltip} from "@nextui-org/tooltip";

type PrincipalProps = {
    data: ReprimandWithTeacherUser[];
    count: number;
    defaultInitDate: string;
    defaultEndDate: string;
}

export default function ListReprimands({data, count, defaultInitDate, defaultEndDate}: PrincipalProps) {
    const [initDate, setinitDate] = useState(defaultInitDate);
    const [endDate, setendDate] = useState(defaultEndDate);
    const [detalleVisible, setDetalleVisible] = useState<number | null>(null)
    const {replace, push} = useRouter();
    const pathname = usePathname();

    const handleSearch = () => {
        const init = new Date(initDate);
        init.setMinutes(init.getMinutes() + init.getTimezoneOffset())
        const end = new Date(endDate);
        end.setMinutes(init.getMinutes() + init.getTimezoneOffset())
        end.setHours(23, 59, 59, 999)

        const params = new URLSearchParams({
            initDate: init.toISOString(),
            endDate: end.toISOString(),
            page: "1"
        });

        replace(`${pathname}?${params.toString()}`);
    };

    const toggleDetalle = (id: number | null) => {
        setDetalleVisible(detalleVisible === id ? null : id)
    }

    const renderDetalle = (message: string) => {
        return message.split('\n').map((parrafo, index) => (
            <p key={index} className="mt-2 text-white">
                {parrafo}
            </p>
        ))
    }

    const handleAdd = () => {
        push('/reprimand/add');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl text-white font-bold">Buscador de Sanciones</h2>
                        <Tooltip content=" Agregar Amonestación" classNames={{content: "text-white"}}>
                            <Button onClick={() => handleAdd()} 
                                data-testid="add-reprimand"
                                className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col space-y-4 mb-6">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="initDate" className="text-white block text-sm font-medium mb-1">Fecha de
                                    inicio</label>
                                <Input
                                    id="initDate"
                                    type="date"
                                    value={initDate}
                                    onChange={(e) => setinitDate(e.target.value)}
                                    className="bg-gray-700 text-white border-gray-600 w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endDate" className="text-white block text-sm font-medium mb-1">Fecha de
                                    fin</label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setendDate(e.target.value)}
                                    className="bg-gray-700 text-white border-gray-600 w-full"
                                />
                            </div>

                            <Tooltip content="Buscar" classNames={{content: "text-white"}}>
                                <Button onClick={handleSearch} data-testid="search-button" className="bg-blue-600 hover:bg-blue-700 self-end">
                                    <Search className="h-4 w-4"/>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    {data.length > 0 ? (
                        <ul className="space-y-4">
                            {data.map((sancion) => (
                                <li key={sancion.id} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="text-white">
                                            <p className="font-semibold">Fecha: {sancion.dateTime.toLocaleDateString()}</p>
                                            <p>Docente: {sancion.teacher.user.firstName} {sancion.teacher.user.lastName}</p>
                                        </div>
                                        <Tooltip content="Ver" classNames={{content: "text-white"}}>
                                            <Button
                                                data-testid="show-reprimand"
                                                onClick={() => toggleDetalle(sancion.id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    {detalleVisible === sancion.id && (
                                        <div className="mt-2">
                                            {renderDetalle(sancion.message)}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">No se encontraron sanciones para la fecha seleccionada.</p>
                    )}
                </CardContent>
            </Card>
            <div className="mt-6">
                <PaginationControls cantPages={count}/>
            </div>
        </div>

    )
}