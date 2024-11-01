import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchStudentMarkByParent} from "@/lib/actions/fetch-student-mark-by-parent";
import {redirect} from "next/navigation";


export default async function ExamMarkByExamIDPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});

    const user = await fetchCurrentUser();

    if (!user) {
        redirect("/403")
    }

    const examMark = await fetchStudentMarkByParent(id);

    if (!examMark) {
        redirect("/403")
    }

    if (!examMark.student.parents.find(parent => parent.id === user.id)) {
        redirect("/403")
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-gray-800 text-gray-100 p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-center">Información del examen</h1>
                <div className="flex justify-center">
                    <div className="flex flex-col w-full max-w-2xl p-4">
                        <div className="flex justify-between">
                            <span className="font-medium">Materia:</span>
                            <span>{examMark.Exam.subject.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Alumno/a:</span>
                            <span>{examMark.student.profile.user.firstName} {examMark.student.profile.user.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Fecha:</span>
                            <span>{examMark.Exam.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Nota:</span>
                            <span>{examMark.mark}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}