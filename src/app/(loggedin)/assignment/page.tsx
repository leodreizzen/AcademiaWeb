import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAssignments } from "@/app/server-actions/getAssignments";
import TPListPage from "@/components/ui/Assignment/assignmentList";

export default async function AssignmentPage() {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "LIST" });
  const assignments = await getAssignments();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <h3 className="text-left text-3xl font-extrabold mb-2">
          Listado de Trabajos Prácticos
        </h3>
        <Link href="/assignment/add">
          <Button className="mb-2 w-full transition duration-200">
            Agregar TP
          </Button>
        </Link>
        <div className="space-y-1">
          <TPListPage initialAssignments={assignments.initialAssignments} />
        </div>
      </div>
    </div>
  );
}
