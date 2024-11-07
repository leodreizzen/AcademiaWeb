"use server";

import { deleteFileFromCloudinary } from "@/lib/cloudinary/cloudinary_server";
import prisma from "@/lib/prisma";
export async function deleteAssignment(assignmentId: number) {
  try {
    const assignmentUrl = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { fileUrl: true },
    });

    if (!assignmentUrl) {
      return { success: false, error: "Trabajo práctico no encontrado." };
    }

    const public_id = assignmentUrl.fileUrl?.split("/").pop()?.split(".")[0];
    if (!public_id) {
      return {
        success: false,
        error: "No se pudo obtener el public_id del archivo.",
      };
    }
    const result = await deleteFileFromCloudinary(public_id);
    if (result.result !== "ok") {
      return {
        success: false,
        error: `Error al eliminar archivo en Cloudinary: ${result.result}`,
      };
    }
    const assignment = await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return { success: true, assignment };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: "No se pudo eliminar el TP." };
  }
}
