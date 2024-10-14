import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ExamMarkList from "@/components/list/ListMarks";
import {fetchCurrentUser} from "@/lib/data/users";

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
    else return(
        <div>No implementado!</div>
    )
}