import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import AddAssignmentForm from "@/app/(loggedin)/assignment/add/addAssignmentForm";
import {fetchGradesWithSubjectsForTeacher} from "@/lib/actions/exam-mark";
import {fetchCurrentUser} from "@/lib/data/users";

export default async function AddAssignmentPage() {
  await assertPermission({
    resource: Resource.ASSIGNMENT,
    operation: "CREATE",
  });
  const teacher = await fetchCurrentUser();
  if(!teacher)
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
          <div className="w-full
                    max-w-2xl bg-gray-800 text-gray-100">
            <h1 className="text-2xl font-bold text-center">Usuario no encontrado</h1>
            <p className="text-center">El usuario no existe.</p>
          </div>
        </div>
    )
  const grades = await fetchGradesWithSubjectsForTeacher(teacher.id);
  return (
    <div className="min-h-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Agregar Trabajo Práctico
        </h1>
        <AddAssignmentForm grades={grades}/>
      </div>
    </div>
  );
}
