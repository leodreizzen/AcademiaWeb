import { AdministatorUser } from "./types";

interface AdminItemParams {
    administrator: AdministatorUser;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onRemove: (id: number) => void;
}

export default function AdminItem({ administrator, onView, onEdit, onRemove }: AdminItemParams) {
    return (
        <div className="border border-white rounded-lg p-4 flex bg-[#394150] gap-12">
            <div className="flex flex-col grow">
                <h3 className="text-xl font-bold">
                    {administrator.user.firstName} {administrator.user.lastName}
                </h3>
                <p className="text-sm mt-2">DNI: {administrator.user.dni}</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit hover:bg-[#5a6475] transition-colors duration-200" onClick={() => onView(administrator.id)}>
                    Ver
                </button>
                <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit hover:bg-[#5a6475] transition-colors duration-200" onClick={() => onEdit(administrator.id)}>
                    Editar
                </button>
                <button className="bg-[#4c5564] py-2 px-4 rounded-lg border border-[#535c6b] h-fit hover:bg-[#5a6475] transition-colors duration-200" onClick={() => onRemove(administrator.id)}>
                    Borrar
                </button>
            </div>
        </div>
    );
}