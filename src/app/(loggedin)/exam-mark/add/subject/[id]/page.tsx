import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ExamMarkForm from "@/components/ui/exam-mark/exam-mark-form";
import {fetchStudentsForSubject, fetchSubjectWithGrade} from "@/lib/actions/exam-mark";
import {fetchCurrentUser} from "@/lib/data/users";
import {redirect} from "next/navigation";

export default async function ExamMarkAddPage({params} : {params: {id: string}}) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "CREATE"});

    const subjectWithGrade = await fetchSubjectWithGrade(parseInt(params.id));
    const user = await fetchCurrentUser();

    if(!user) {
        redirect("/403")
    }

    if (subjectWithGrade.teachers.findIndex(teacher => teacher.id === user.id) === -1) {
        redirect("/403")
    }

    const students = await fetchStudentsForSubject(parseInt(params.id));

    return (
        <div>
            <ExamMarkForm subject={subjectWithGrade} students={students}/>
        </div>);
}