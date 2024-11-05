import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {fetchStudentsByGrade} from "@/lib/data/fetchStudentsByGrade";
import {AttendanceRegister} from "@/components/ui/attendance/AttendanceRegister";
import {hasPreviousAttendace} from "@/lib/actions/registerAttendance";
import {fetchGradeByID} from "@/lib/data/fetchGradeNameByID";

export default async function RegisterAttendance({params}: {params: {id: string}}){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "CREATE"});
    const idNumber = parseInt(params.id);
    const grade = !isNaN(idNumber) ? await fetchGradeByID(idNumber) : null;

    if (!grade) {
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

    if(await hasPreviousAttendace(idNumber, new Date())){
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Asistencia ya registrada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">Ya se ha registrado la asistencia hoy.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const students = await fetchStudentsByGrade(grade.name);

    return (
        <AttendanceRegister students={students} grade={grade} id={idNumber}/>
    )
}