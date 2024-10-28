import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ExamMarkAddPage() {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "CREATE"});

    return (
        <div>
            <h1>Agregar nota de examen</h1>
        </div>);
}