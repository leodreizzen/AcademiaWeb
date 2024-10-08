import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import { Label } from "@radix-ui/react-dropdown-menu";
import { getAdmin } from "../adminActions";


interface AdminPageParams {
    id: string
}

export default async function AdminPage({params} : {params: AdminPageParams}) {
    await assertPermission({resource: Resource.ADMINISTRATOR, operation: "READ"});

    const administrator = await getAdmin(Number(params.id))

    if (!administrator) {
        return <div>Administrador no encontrado</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Información del Administrador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-400">DNI</Label>
                            <p className="text-lg">{administrator.dni}</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Nombre</Label>
                                <p className="text-lg">{administrator.user.firstName}</p>
                            </div>
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Apellido</Label>
                                <p className="text-lg">{administrator.user.lastName}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Teléfono</Label>
                            <p className="text-lg">{administrator.phoneNumber}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Dirección</Label>
                            <p className="text-lg">{administrator.address}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Correo Electrónico</Label>
                            <p className="text-lg">{administrator.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}