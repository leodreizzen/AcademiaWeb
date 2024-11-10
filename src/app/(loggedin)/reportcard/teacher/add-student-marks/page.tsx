import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchSubject";
import {fetchStudentsFromSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchStudentsFromSubject";
import {
    getSubjectsWithReportCardStatus
} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchGradeReportCardByYearAndGrade";
import FirstSemesterReportCardFront
    from "@/app/(loggedin)/reportcard/teacher/add-student-marks/firstSemesterReportCardFront";
import {notFound} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SecondSemesterReportCardFront
    from "@/app/(loggedin)/reportcard/teacher/add-student-marks/secondSemesterReportCardFront";

export default async function ReportCardAddListPage({
                                                        searchParams,
                                                    }: {
    searchParams: Record<"idSubject", string|undefined>
}) {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "CREATE"});
    const subjectId = searchParams.idSubject;
    if(!Number(subjectId))
        notFound();
    const alumnos = await fetchStudentsFromSubject(Number(subjectId));
    const materia = await fetchSubject(Number(subjectId))
    if(!materia)
        notFound();
    const result = await getSubjectsWithReportCardStatus(Number(new Date().getFullYear()))
    const value = result.get(Number(subjectId))
    if(!value)
        notFound();
    if(value.currentSemester == "first"){
        if(value.canLoad) {
            return (
                <div>
                    <FirstSemesterReportCardFront students={alumnos} subject={materia}/>
                </div>
            );
        }
        else
            return (<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">No se puede cargar notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">Las notas del primer semestre ya están cargadas.</p>
                    </CardContent>
                </Card>
            </div>)
    }
    else{
        if(value.canLoad) {
            return (
                <div>
                    <SecondSemesterReportCardFront students={alumnos} subject={materia}/>
                </div>
            );
        }
        else
            return (<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">No se puede cargar notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">Las notas del segundo semestre ya están cargadas.</p>
                    </CardContent>
                </Card>
            </div>
            );
    }

}