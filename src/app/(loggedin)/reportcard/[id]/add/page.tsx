import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchSubjectsFromTeacher} from "@/app/(loggedin)/reportcard/[id]/add/fetchSubjectsFromTeacher";
import AddReportCard from "@/app/(loggedin)/reportcard/[id]/add/AddReportCard";

export default async function ReportCardAddPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "CREATE"});

    const materias = await fetchSubjectsFromTeacher();


    return (
        <div>
            <AddReportCard subjects={materias}/>
        </div>
    );
}