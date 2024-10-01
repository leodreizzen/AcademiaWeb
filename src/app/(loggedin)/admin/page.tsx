'use client';
import { useEffect, useState } from "react";
/*
* Imports necesarios
* */

import { getAdmins } from "./getAdmins";
import { Administrator, User } from "@prisma/client";

type AdministatorUser = Administrator & { user: User };

interface AdminListPageParams {
    page: string;
}

export default function AdminListPage({ searchParams }: { searchParams: AdminListPageParams }) {
    const page = Number(searchParams?.page) || 1;
    const [administrators, setAdministrators] = useState<AdministatorUser[]>([]);

    useEffect(() => {
        const fetchAdministrators = async () => {
            const administratorsFromDB = await getAdmins(page);
            setAdministrators(administratorsFromDB);
        };
        fetchAdministrators();
    }, [page])

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
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
            <div className="p-8 bg-[#212937] rounded-lg">
                <h2 className="font-extrabold text-2xl">Busqueda de administradores</h2>
                <div className="mt-8">
                    <input type="text" name="dni" className="bg-[#394150] py-2 px-4 rounded-lg w-full border border-[#535c6b]" placeholder="DNI" />
                </div>
                <div className="flex mt-4 gap-4">
                    <input type="text" name="apellido" className="bg-[#394150] py-2 px-4 rounded-lg grow border border-[#535c6b]" placeholder="Apellido" />
                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg">Buscar</button>
                </div>
                <div className="flex flex-col mt-8 gap-4">
                    {
                        administrators.map(administrator => (
                            <div className="border border-white rounded-lg p-4 flex bg-[#394150] gap-12" key={administrator.id}>
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl font-bold">
                                        {administrator.user.firstName} {administrator.user.lastName}
                                    </h3>
                                    <p className="text-sm mt-2">DNI: {administrator.user.dni}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b]" onClick={() => handleView(administrator.id)}>
                                        Ver
                                    </button>
                                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b]" onClick={() => handleEdit(administrator.id)}>
                                        Editar
                                    </button>
                                    <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b]" onClick={() => handleRemove(administrator.id)}>
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}