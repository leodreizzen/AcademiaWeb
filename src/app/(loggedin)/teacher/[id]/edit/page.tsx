import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import getTeacherInfo from "@/app/lib/actions/teacher-info";
import {fetchSubjects} from "@/app/(loggedin)/teacher/[id]/edit/getSubjects";
import EditTeacher from "@/components/ui/editTeacher";

export default async function EditTeacherPage({params}: {params: {id: string}}) {
    await assertPermission({resource: Resource.TEACHER, operation: "UPDATE"});
    const idNumber = Number(params.id);
    const teacher = !isNaN(idNumber) ? await getTeacherInfo(idNumber) : null;


    if (!teacher) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Docente no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">No se encontró un docente con el ID especificado.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    const subjects = await fetchSubjects();
    return (
        <EditTeacher teacher={teacher} allSubjects={subjects}/>
    );
}