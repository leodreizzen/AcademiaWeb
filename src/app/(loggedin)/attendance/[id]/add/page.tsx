import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {fetchGradeNameByID} from "@/lib/data/fetchGradeNameByID";
import {fetchStudentsByGrade} from "@/lib/data/fetchStudentsByGrade";
import {AttendanceRegister} from "@/components/ui/attendance/AttendanceRegister";

export default async function RegisterAttendance({params}: {params: {id: string}}){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "CREATE"});
    const idNumber = parseInt(params.id);
    const response = !isNaN(idNumber) ? await fetchGradeNameByID(idNumber) : null;

    if (!response) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Año no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">No se encontró un año con el ID especificado.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const students = await fetchStudentsByGrade(response);

    return (
        <AttendanceRegister students={students} gradeName={response} id={idNumber}/>
    )
}