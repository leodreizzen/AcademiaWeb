import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignmentById } from "@/app/(loggedin)/assignment/add/fetchAssignments";
import EditAssignmentForm from "@/app/(loggedin)/assignment/[id]/edit/editAssignmentForm";
import {notFound, redirect} from "next/navigation";
import {fetchGradesWithSubjectsForTeacher} from "@/lib/actions/exam-mark";
import {fetchCurrentUser} from "@/lib/data/users";
import {AssignmentWithSubject} from "@/lib/definitions/assignment";
import {fetchTeacherById} from "@/app/(loggedin)/teacher/fetchTeacher";

export default async function EditAssignmentPage({
  params,
}: {
  params: { id: string };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "UPDATE" });

  const assignmentId = Number(params.id);

  const assignment : AssignmentWithSubject | null = await getAssignmentById(assignmentId);

  if (!assignment) {
    notFound();
  }
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


  const teacherWithSubjects = await fetchTeacherById(teacher.id);
  if(!teacherWithSubjects){
    redirect("/403");
  }
  if(teacherWithSubjects.subjects.find(subject => subject.id == assignment.subject.id) == null){
    redirect("/403");
  }
  const grades = await fetchGradesWithSubjectsForTeacher(teacher.id);

  return (
    <div className="min-h-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Editar Trabajo Práctico
        </h1>
        <EditAssignmentForm assignment={assignment} grades={grades} />
      </div>
    </div>
  )
}
