'use client'

import { useEffect, useState } from "react";
import { AdministatorUser } from "./types";
import { removeAdmin } from "./adminActions";
import { ADMINS_PER_PAGE } from "@/lib/data/pagination";
import AdminItem from "./adminItem";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@nextui-org/tooltip";
import {NoResultCard} from "@/components/list/NoResultCard";

interface AdminListProps {
    administrators: AdministatorUser[];
    count: number;
}

export default function AdminList({ administrators, count }: AdminListProps) {
    const [page, setPage] = useState(1);
    const [dni, setDni] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [totalPages] = useState(Math.ceil(count / ADMINS_PER_PAGE));
    const { replace, push, refresh } = useRouter();
    const pathname = usePathname();
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        administrators.length === 0 ? setNoResults(true) : setNoResults(false);
    }, [administrators])

    const searchAdministrator = (page: number = 1) => {
        const params = new URLSearchParams({
            page: page.toString(),
            dni: dni ?? '',
            lastName: lastName ?? ''
        });
        replace(`${pathname}?${params.toString()}`);
    };

    const handleChangeDni = (newDNI: string) => {
        setDni(newDNI);
        setLastName('');
    };
    const handleChangeLastname = (newLastname: string) => {
        setLastName(newLastname);
        setDni('');
    };
    
    const handleView = (id: number) => {
        push(`/admin/${id}`);
    };
    const handleEdit = (id: number) => {
        push(`/admin/${id}/edit`);
    };
    const handleRemove = async (id: number) => {
        const mustRemove = confirm("¿Esta seguro que quiere eliminar el administrador?");
        if (!mustRemove) {
            return;
        }
        const isRemove = await removeAdmin(id);
        if (isRemove) {
            refresh();
        }
    };
    const handleAdd = () => {
        push('/admin/add');
    };
    const handlePreviousPage = () => {
        setPage(page - 1);
        searchAdministrator(page - 1);
    };
    const handleNextPage = () => {
        setPage(page + 1);
        searchAdministrator(page + 1);
    };
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
            <div className="p-8 bg-[#212937] rounded-lg">
                <div className="flex justify-between">
                    <h2 className="font-extrabold text-2xl">Busqueda de administradores</h2>

                    <Tooltip content="Nuevo administrador" classNames={{ content: "text-white" }}>
                        <Button onClick={handleAdd} variant="secondary"
                            data-testid="add-admin-button"
                            className="bg-green-600 hover:bg-green-500 text-white">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </Tooltip>
                </div>
                <div className="mt-8">
                    <Input
                        type="text"
                        placeholder="Buscar por DNI"
                        value={dni}
                        onChange={e => handleChangeDni(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
                    />
                </div>
                <div className="flex mt-4 gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar por Apellido"
                        value={lastName}
                        onChange={e => handleChangeLastname(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
                    />
                    <Tooltip content="Buscar" classNames={{ content: "text-white" }}>
                        <Button onClick={()=>searchAdministrator} variant="secondary"
                            data-testid="search-button"
                            className="bg-gray-600 hover:bg-gray-500 px-5 w-full sm:w-auto">
                            <Search className="h-5 w-5" />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex flex-col mt-8 gap-4">
                    {noResults && <NoResultCard user={"administradores"}/>}
                    {
                        administrators.map(administrator => (
                            <AdminItem key={administrator.id} administrator={administrator} onView={handleView}
                                onEdit={handleEdit} onRemove={handleRemove} />
                        ))
                    }
                </div>
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        className='bg-[#59999C] hover:bg-[#5FC8CD]'
                        size="lg"
                        disabled={page == 1}
                        onClick={handlePreviousPage}
                    >
                        Anterior
                    </Button>
                    <div className="border border-white py-2 px-4 rounded-lg">
                        {page}
                    </div>
                    <Button
                        className='bg-[#59999C] hover:bg-[#5FC8CD]'
                        size="lg"
                        disabled={page == totalPages}
                        onClick={handleNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )
}