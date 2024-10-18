"use server";

import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import AssignmentDetailsClient from "./AssignmentDetails";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "READ" });
  const prisma = await getCurrentProfilePrismaClient();

  const assignmentData = await prisma.assignment.findUnique({
    where: { id: Number(params.id) },
    include: {
      subject: {
        include: {
          grade: true,
        },
      },
    },
  });

  if (!assignmentData) {
    return <div>No se encontró el trabajo práctico.</div>;
  }

  const assignment = {
    id: assignmentData.id,
    title: assignmentData.title,
    description: assignmentData.description || "",
    fileUrl: assignmentData.fileUrl,
    grade: assignmentData.subject?.grade || { name: "Sin Grado" },
    subject: assignmentData.subject,
  };

  return <AssignmentDetailsClient assignment={assignment} />;
}
