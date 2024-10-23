import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignmentById } from "@/app/(loggedin)/assignment/add/fetchAssignments";
import EditAssignmentForm from "@/app/(loggedin)/assignment/[id]/edit/editAssignmentForm";
import { notFound } from "next/navigation";

export default async function EditAssignmentPage({
  params,
}: {
  params: { id: string };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "UPDATE" });

  const assignmentId = Number(params.id);

  const assignment = await getAssignmentById(assignmentId);

  if (!assignment) {
    notFound();
  }
  return (
    <div className="min-h-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Editar Trabajo Práctico
        </h1>
        <EditAssignmentForm assignment={assignment} />
      </div>
    </div>
  )
}
