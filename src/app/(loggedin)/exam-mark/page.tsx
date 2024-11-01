import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ExamMarkList from "@/components/list/ListMarks";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchSelectedChild} from "@/lib/data/children";
import TeacherMarkList from "@/components/list/TeacherMarkList";

export default async function ExamMarkListPage() {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});
    const user = await fetchCurrentUser();
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <div className="w-full
                max-w-2xl bg-gray-800 text-gray-100">
                    <h1 className="text-2xl font-bold text-center">Usuario no encontrado</h1>
                    <p className="text-center">El usuario no existe.</p>
                </div>
            </div>
        )
    }

    if(user.role === 'Student'){
        return (
            <ExamMarkList studentId={user.id}/>
        )
    }
    else if(user.role === 'Parent') {
        const student = await fetchSelectedChild();
        if (!student) {
            return (
                <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                    <div className="w-full
                    max-w-2xl bg-gray-800 text-gray-100">
                        <h1 className="text-2xl font-bold text-center">Estudiante no encontrado</h1>
                        <p className="text-center">El estudiante no existe.</p>
                    </div>
                </div>
            )
        }
        return (
            <ExamMarkList studentId={student.id}/>
        )
    } else if(user.role === 'Teacher') {
        return (
            <TeacherMarkList teacherId={user.id}/>
        )
    }
}