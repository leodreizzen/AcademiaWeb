import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import SubjectSelectionForm from "@/components/ui/exam-mark/subject-selection-form";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchGradesWithSubjectsForTeacher} from "@/lib/actions/exam-mark";

export default async function ExamMarkAddPage() {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "CREATE"});

    const user = await fetchCurrentUser();

    if(!user) {
        return <div>Usuario no encontrado</div>
    }

    const grades = await fetchGradesWithSubjectsForTeacher(user.id);

    return (
        <div>
            <SubjectSelectionForm grades={grades} />
        </div>);
}