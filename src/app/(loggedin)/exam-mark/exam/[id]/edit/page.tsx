import ExamMarkEditForm from "@/components/ui/exam-mark/exam-mark-edit-form";
import {assertPermission} from "@/lib/access_control";
import { fetchExam } from "@/lib/actions/exam";
import { fetchStudentsForSubject } from "@/lib/actions/exam-mark";
import { fetchCurrentUser } from "@/lib/data/users";
import {Resource} from "@/lib/operation_list";
import { redirect } from "next/navigation";

interface ExamMarkEditParams {
    params: {
        id: string;
    }
}

export default async function ExamMarkEditPage({ params }: ExamMarkEditParams) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "UPDATE"});

    const user = await fetchCurrentUser();
    if(!user) {
        redirect("/403")
    }
    
    const id = Number.parseInt(params.id, 10);
    if (Number.isNaN(id)) {
        redirect("/403")
    }
    const exam = await fetchExam(id);
    if (!exam) {
        redirect("/403")
    }

    if (!exam.subject.teachers.some(x => x.id === user.id)) {
        redirect("/403");
    }

    const students = await fetchStudentsForSubject(exam.subjectId);

    return (
        <div>
            <ExamMarkEditForm exam={exam} students={students} />
        </div>
    );
}
