import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ExamMarkList from "@/components/list/ListMarks";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchSelectedChild} from "@/lib/data/children";

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
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <div className="w-full
                max-w-2xl bg-gray-800 text-gray-100 space-y-3 p-4 rounded-xl">
                    <h1 className="text-2xl font-bold text-center">Añadir notas de exámen</h1>
                    <p className="text-center">Presione el siguiente botón para ser redirigido.</p>
                    <a href="/exam-mark/add" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 text-center">Añadir notas</a>
                </div>
            </div>
        )
    }
}