import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignmentById } from "@/app/(loggedin)/assignment/add/fetchAssignments";
import EditAssignmentForm from "./editAssignmentForm";
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

  return <EditAssignmentForm assignment={assignment} />;
}
