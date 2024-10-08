import { Button } from "@/components/ui/button";
import { AdministatorUser } from "./types";
import { Edit, Eye, Trash2 } from "lucide-react";

interface AdminItemParams {
    administrator: AdministatorUser;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onRemove: (id: number) => void;
}

export default function AdminItem({ administrator, onView, onEdit, onRemove }: AdminItemParams) {
    return (
        <div className="border border-white rounded-lg p-4 flex bg-[#394150] gap-12 test-admin-item">
            <div className="flex flex-col grow">
                <h3 className="text-xl font-bold">
                    {administrator.user.firstName} {administrator.user.lastName}
                </h3>
                <p className="text-sm mt-2">DNI: {administrator.user.dni}</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => onEdit(administrator.id)} className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onView(administrator.id)} className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                    <Eye className="mr-2 h-4 w-4" /> Ver
                </Button>
                <Button variant="outline" size="sm" onClick={() => onRemove(administrator.id)} className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                    <Trash2 className="mr-2 h-4 w-4" /> Borrar
                </Button>
            </div>
        </div>
    );
}