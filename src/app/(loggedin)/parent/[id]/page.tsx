import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {fetchParentById} from "@/lib/actions/info-parent";
import Link from "next/link";
import {format} from "date-fns";

export default async function ParentInfoPage({params}: {params: {id: string}}) {

    const parent = await fetchParentById(params.id)

    if (!parent) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Responsable no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">El responsable con el ID {params.id} no existe.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Información del Responsable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-400">DNI</Label>
                            <p className="text-lg">{parent.dni}</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Nombre</Label>
                                <p className="text-lg">{parent.user.firstName}</p>
                            </div>
                            <div className="flex-2">
                                <Label className="text-sm font-medium text-gray-400">Apellido</Label>
                                <p className="text-lg">{parent.user.lastName}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Teléfono</Label>
                            <p className="text-lg">{parent.phoneNumber}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Fecha de nacimiento</Label>
                            <p className="text-lg">{format(parent.birthdate, "dd/mm/yyyy")}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Correo Electrónico</Label>
                            <p className="text-lg">{parent.email}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Dirección</Label>
                            <p className="text-lg">{parent.address}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-400 mb-2 block">Alumnos a Cargo</Label>
                        <div className="space-y-3">
                            {parent.children.map((student, index) => (
                                <Link href={`/student/${student.id}`} key={index}>
                                    <div key={index} className="bg-gray-700 p-3 rounded-lg mt-2">
                                        <p className="font-semibold">{student.user.firstName}</p>
                                        <p className="text-sm text-gray-300">Curso: {student.gradeName}</p>
                                        <p className="text-sm text-gray-300">DNI: {student.user.dni}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}