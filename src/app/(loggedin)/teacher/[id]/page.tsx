import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import getTeacherInfo from "@/app/lib/actions/teacher-info";

type SubjectsPerYear = {
    [year: string]: string[]
}

export default async function TeacherInformationPage({params} : {params: {id: string}}) {


    const teacher = await getTeacherInfo(params.id)

    if (!teacher) {
        return <div>Docente no encontrado</div>
    }

    const subjectsPerYear: SubjectsPerYear = {}
    teacher.subjects.forEach(subject => {
        if (!subjectsPerYear[subject.gradeName]) {
            subjectsPerYear[subject.gradeName] = []
        }
        subjectsPerYear[subject.gradeName].push(subject.name)
    })


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Información del Docente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-400">DNI</Label>
                            <p className="text-lg">{teacher.dni}</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Nombre</Label>
                                <p className="text-lg">{teacher.user.firstName}</p>
                            </div>
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-400">Apellido</Label>
                                <p className="text-lg">{teacher.user.lastName}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Teléfono</Label>
                            <p className="text-lg">{teacher.phoneNumber}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-400">Dirección</Label>
                            <p className="text-lg">{teacher.address}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-400">Correo Electrónico</Label>
                            <p className="text-lg">{teacher.email}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-400">Materias Asignadas</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(subjectsPerYear).map(([year, subjects]) => (
                                <div key={year} className="mt-2">
                                    <h4 className="font-semibold text-gray-300">{year}</h4>
                                    <ul className="list-disc list-inside pl-4">
                                        {subjects.map(subject => (
                                            <li key={subject} className="text-gray-200">{subject}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}