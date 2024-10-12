import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ExamMarkListPage() {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});
    return (
        <div>
            <h1>Listado de notas de exámenes</h1>
        </div>
    );
}