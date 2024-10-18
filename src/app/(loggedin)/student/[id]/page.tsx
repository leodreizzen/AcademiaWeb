import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import fetchStudentById from "@/lib/actions/student-info";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import Link from "next/link";
import {format} from "date-fns";

export default async function StudentInfoPage({params}: {params: {id: string}}) {
    await assertPermission({resource: Resource.STUDENT, operation: "READ"});

    const student = await fetchStudentById(parseInt(params.id))

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Alumno no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">No se encontró un alumno con el ID especificado.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Información del Alumno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-400">DNI</Label>
                            <p className="text-lg">{student.dni}</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Nombre</Label>
                                <p className="text-lg">{student.user.firstName}</p>
                            </div>
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Apellido</Label>
                                <p className="text-lg">{student.user.lastName}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Teléfono</Label>
                            <p className="text-lg">{student.phoneNumber}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Año</Label>
                            <p className="text-lg">{student.gradeName}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Fecha de nacimiento</Label>
                            <p className="text-lg">{format(student.birthdate, "dd/mm/yyyy")}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Correo Electrónico</Label>
                            <p className="text-lg">{student.email}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Dirección</Label>
                            <p className="text-lg">{student.address}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-400 mb-2 block">Responsables</Label>
                        <div className="flex flex-col space-y-3">
                            {student.parents.map((parent, index) => (
                                <Link href={`/parent/${parent.id}`} key={index}>
                                <div key={index} className="bg-gray-700 p-3 rounded-lg">
                                    <p className="font-semibold">{parent.user.lastName} {parent.user.firstName}</p>
                                    <p className="text-sm text-gray-300">DNI: {parent.dni}</p>
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