import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ExamMarkForm from "@/components/ui/exam-mark/exam-mark-form";
import {fetchStudentsForSubject, fetchSubjectWithGrade} from "@/lib/actions/exam-mark";

export default async function ExamMarkAddPage({params} : {params: {id: string}}) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "CREATE"});

    const subjectWithGrade = await fetchSubjectWithGrade(parseInt(params.id));
    const students = await fetchStudentsForSubject(parseInt(params.id));

    return (
        <div>
            <ExamMarkForm subject={subjectWithGrade} students={students}/>
        </div>);
}