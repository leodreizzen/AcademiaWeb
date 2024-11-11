import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchSubjectsFromTeacher} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchSubjectsFromTeacher";
import {getSubjectsWithReportCardStatus} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchGradeReportCardByYearAndGrade";
import AddReportCard from "@/app/(loggedin)/reportcard/teacher/add-student-marks/AddReportCard";


export default async function ReportCardAddPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "CREATE"});

    const materias = await fetchSubjectsFromTeacher();
    const result = await getSubjectsWithReportCardStatus(Number(new Date().getFullYear()))

    return (
        <div>
            <AddReportCard subjects={materias} result={result}/>
        </div>
    );
}