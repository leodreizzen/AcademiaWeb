import { redirect } from 'next/navigation'
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function SubjectPage() {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "CREATE"});

    redirect("/exam-mark/add/");

    return (
        <div>
            <div className="title">Seleccionar año de entre los que pueda el profesor.</div>
        </div>);
}