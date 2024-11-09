import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchSubject";
import {fetchStudentFromSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchStudentsFromSubject";
import ListadoAlumnos from "@/app/(loggedin)/reportcard/teacher/add-student-marks/ListStudentsAddReportCard";
import {
    getSubjectsWithReportCardStatus
} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchGradeReportCardByYearAndGrade";

export default async function ReportCardAddListPage({
                                                        searchParams,
                                                    }: {
    searchParams: { [key: string]: string | undefined }
}) {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "CREATE"});
    const subjectId = searchParams?.idSubject;
    const alumnos = await fetchStudentFromSubject(Number(subjectId));
    const materia = await fetchSubject(Number(subjectId))
    const result = await getSubjectsWithReportCardStatus(Number(new Date().getFullYear()))
    const value = result.get(Number(subjectId))
    let semestre: string
    if(value?.currentSemester == "first")
        semestre = '1';
    else
        semestre = '2';

    return (
        <div>
            <ListadoAlumnos students={alumnos} subject={materia[0]} semestre={semestre}/>
        </div>
    );
}