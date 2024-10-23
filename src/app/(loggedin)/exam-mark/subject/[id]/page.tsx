import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ExamMarksBySubjectPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});

    return (
        <div>
            <h1>Notas de examen para la materia {id}</h1>
        </div>
    );
}