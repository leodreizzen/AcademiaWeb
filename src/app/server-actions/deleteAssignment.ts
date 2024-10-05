'use server'

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function deleteAssignment(assignmentId: number) {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    const assignment = await prisma.assignment.delete({
      where: { id: assignmentId },
    });
    return { success: true, assignment };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: "No se pudo eliminar el TP." };
  }
}
