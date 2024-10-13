'use server';

import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import AssignmentDetailsClient from "./AssignmentDetails";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Verifica permisos
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "READ" });

  // Obtén el cliente de Prisma
  const prisma = await getCurrentProfilePrismaClient();

  // Obtén los detalles del Assignment
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

  // Prepara los datos para enviarlos al componente del cliente
  const assignment = {
    id: assignmentData.id,
    title: assignmentData.title,
    description: assignmentData.description || "",
    fileUrl: assignmentData.fileUrl,
    grade: assignmentData.subject?.grade || { name: "Sin Grado" },
    subject: assignmentData.subject,
  };

  // Renderiza el componente del cliente con los datos obtenidos
  return <AssignmentDetailsClient assignment={assignment} />;
}
