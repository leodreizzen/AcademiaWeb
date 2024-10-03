'use client'

import { useEffect, useState } from "react";
import { AdministatorUser, AdminQuery } from "./types";
import { getAdmins, getTotalAdmins } from "./getAdmins";
import { ADMINS_PER_PAGE } from "./adminConstants";
import AdminItem from "./adminItem";

interface AdminListProps {
    pageQuery?: number;
    dniQuery?: string;
    lastNameQuery?: string;
}

export default function AdminList({ pageQuery, dniQuery, lastNameQuery }: AdminListProps) {
    const [page, setPage] = useState(pageQuery ?? 1);
    const [dni, setDni] = useState<string | undefined>(dniQuery ?? undefined);
    const [lastName, setLastName] = useState<string | undefined>(dniQuery != null ? undefined : (lastNameQuery ?? undefined));
    const [administrators, setAdministrators] = useState<AdministatorUser[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState<AdminQuery>({ page, dni: dni == undefined ? undefined : parseInt(dni), lastName });

    useEffect(() => {
        const fetchTotalAdministrators = async () => {
            const countAdministrators = await getTotalAdmins();
            setTotalPages(Math.ceil(countAdministrators / ADMINS_PER_PAGE));
        };
        fetchTotalAdministrators();
    }, [])
    useEffect(() => {
        const fetchAdministrators = async () => {
            const administratorsFromDB = await getAdmins(searchQuery);
            setAdministrators(administratorsFromDB);
        };
        fetchAdministrators();
    }, [searchQuery]);

    const searchAdministrator = () => {
        setSearchQuery({ page, dni: dni == undefined ? undefined : parseInt(dni), lastName });
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
        // TODO: navigate to view administrator page
    };
    const handleEdit = (id: number) => {
        // TODO: navigate to edit administrator page
    };
    const handleRemove = (id: number) => {
        // TODO: remove administrator
    };
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen text-white">
            <div className="p-8 bg-[#212937] rounded-lg">
                <h2 className="font-extrabold text-2xl">Busqueda de administradores</h2>
                <div className="mt-8">
                    <input className="bg-[#394150] py-2 px-4 rounded-lg w-full border border-[#535c6b]"
                        type="text"
                        name="dni"
                        placeholder="DNI"
                        value={dni}
                        onChange={e => handleChangeDni(e.target.value)}/>
                </div>
                <div className="flex mt-4 gap-4">
                    <input className="bg-[#394150] py-2 px-4 rounded-lg grow border border-[#535c6b]"
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={e => handleChangeLastname(e.target.value)}/>
                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit hover:bg-[#5a6475] transition-colors duration-200"
                        type="button" onClick={searchAdministrator}>
                        Buscar
                    </button>
                </div>
                <div className="flex flex-col mt-8 gap-4">
                    {
                        administrators.map(administrator => (
                            <AdminItem key={administrator.id} administrator={administrator} onView={handleView}
                                onEdit={handleEdit} onRemove={handleRemove} />
                        ))
                    }
                </div>
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit enabled:hover:bg-[#5a6475] transition-colors duration-200"
                        disabled={page == 1}
                        onClick={() => setPage(page - 1)}>
                        Anterior
                    </button>
                    <button className="border border-white py-2 px-4 rounded-lg" disabled>
                        {page}
                    </button>
                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit enabled:hover:bg-[#5a6475] transition-colors duration-200"
                        disabled={page == totalPages}
                        onClick={() => setPage(page + 1)}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}