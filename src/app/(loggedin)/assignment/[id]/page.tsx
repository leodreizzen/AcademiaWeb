import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";

export default async function AssignmentPage() {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "READ" });
  const prisma = await getCurrentProfilePrismaClient();

  const assignmentId = 0; //TODO: get assignment id from URL
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { fileUrl: true },
  });

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  return (
    <div>
      <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
        Download Assignment
      </a>
    </div>
  );
}
