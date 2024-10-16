import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import fetchStudentById from "@/lib/actions/student-info";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import EditStudent from "@/components/ui/editStudent";
import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";

export default async function EditStudentPage({params}: {params: {id: string}}) {
    await assertPermission({resource: Resource.STUDENT, operation: "UPDATE"});

    const student = await fetchStudentById(params.id)
    const grades = await fetchGrades();

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

    return(
        <EditStudent student={student} id={parseInt(params.id)} grades={grades.map((grade) => grade.name)}/>
    )
}