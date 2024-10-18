import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchSubjectsFromSubject} from "@/app/(loggedin)/reportcard/[id]/add/addList/fetchStudentsFromSubject";

export default async function ReportCardAddListPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "CREATE"});

    const alumnos = await fetchSubjectsFromSubject();


    return (
        <div>

        </div>
    );
}