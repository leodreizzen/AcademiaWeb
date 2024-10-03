import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignments } from "@/app/server-actions/getAssignments";
import TPListPage from "@/components/ui/Assignment/assignmentList";

export default async function AssignmentPage() {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "LIST" });
  const assignments = await getAssignments();

  return <TPListPage initialAssignments={assignments} />;
}
