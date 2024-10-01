'use server'

import getPrismaClient from "@/lib/prisma";

const session: {
    user: {
      dni: number;
      role: "Teacher" | "Superuser" | "Student" | "Parent" | "Administrator";
    };
  } = {
    user: {
      dni: 22222222,
      role: "Teacher",
    },
  };
  
  const prisma = getPrismaClient({
    id: session.user.dni,
    role: session.user.role,
  });

export async function deleteAssignment(assignmentId: string) {
  try {
    const assignment = await prisma.assignment.delete({
      where: { id: parseInt(assignmentId) },
    });
    return { success: true, assignment };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: "No se pudo eliminar el TP." };
  }
}
