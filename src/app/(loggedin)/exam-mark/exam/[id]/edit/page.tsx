import ExamMarkEditForm from "@/components/ui/exam-mark/exam-mark-edit-form";
import {assertPermission} from "@/lib/access_control";
import { fetchExam } from "@/lib/actions/exam";
import { fetchStudentsForSubject } from "@/lib/actions/exam-mark";
import { fetchCurrentUser } from "@/lib/data/users";
import {Resource} from "@/lib/operation_list";

interface ExamMarkEditParams {
    params: {
        id: string;
    }
}

export default async function ExamMarkEditPage({ params }: ExamMarkEditParams) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "UPDATE"});

    const user = await fetchCurrentUser();
    if(!user) {
        return <div>Usuario no encontrado</div>
    }
    
    const id = Number.parseInt(params.id, 10);
    if (Number.isNaN(id)) {
        return (<div>No se encontro las notas de examen</div>)
    }
    const exam = await fetchExam(id);
    if (!exam) {
        return (<div>No se encontro las notas de examen</div>)
    }

    if (!exam.subject.teachers.some(x => x.id === user.id)) {
        return <div>Profesor no tiene permiso para ver este examen</div>
    }

    const students = await fetchStudentsForSubject(exam.subjectId);

    return (
        <div>
            <ExamMarkEditForm exam={exam} students={students} />
        </div>
    );
}
