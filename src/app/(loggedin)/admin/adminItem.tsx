import {Button} from "@/components/ui/button";
import {Edit, Eye, Trash2} from "lucide-react";
import {Tooltip} from "@nextui-org/tooltip";
import {AdministratorWithUser} from "@/lib/definitions/administrator";

interface AdminItemParams {
    administrator: AdministratorWithUser;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onRemove: (id: number) => void;
}

export default function AdminItem({administrator, onView, onEdit, onRemove}: AdminItemParams) {
    return (
        <div className="border border-white rounded-lg p-4 flex bg-[#394150] gap-12 test-admin-item">
            <div className="flex flex-col grow">
                <h3 className="text-xl font-bold">
                    {administrator.user.firstName} {administrator.user.lastName}
                </h3>
                <p className="text-sm mt-2">DNI: {administrator.user.dni}</p>
            </div>
            <div className="flex items-center gap-4">
                <Tooltip content="Editar" classNames={{content: "text-white"}}>
                    <Button variant="outline" size="sm" onClick={() => onEdit(administrator.id)}
                            data-testid="edit-admin-button"
                            className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                        <Edit className="h-4 w-4"/>
                    </Button>
                </Tooltip>
                <Tooltip content="Ver" classNames={{content: "text-white"}}>

                    <Button variant="outline" size="sm" onClick={() => onView(administrator.id)}
                            data-testid="view-admin-button"
                            className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                        <Eye className="h-4 w-4"/>
                    </Button>
                </Tooltip>
                <Tooltip content="Borrar" classNames={{content: "text-white"}}>
                    <Button variant="outline" size="sm" onClick={() => onRemove(administrator.id)}
                            data-testid="remove-admin-button"
                            className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0">
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}