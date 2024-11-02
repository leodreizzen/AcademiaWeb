import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchStudentMarkByParent} from "@/lib/actions/fetch-student-mark-by-parent";
import {redirect} from "next/navigation";
import {format} from "date-fns";


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
                            <span data-testid="subject">{examMark.Exam.subject.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Alumno/a:</span>
                            <span data-testid="student">{examMark.student.profile.user.firstName} {examMark.student.profile.user.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Fecha:</span>
                            <span data-testid="date">{format(examMark.Exam.date, "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Nota:</span>
                            <span data-testid="mark">{examMark.mark}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}