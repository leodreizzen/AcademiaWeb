"use server";
import { extractPublicId } from 'cloudinary-build-url'

import { deleteFileFromCloudinary } from "@/lib/cloudinary/cloudinary_server";
import prisma from "@/lib/prisma";
import {getResourceType} from "cloudinary-build-url/dist/cjs/url";
export async function deleteAssignment(assignmentId: number) {
  try {
    const assignmentUrl = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {submissions: true},
    });

    if (!assignmentUrl) {
      return { success: false, error: "Trabajo práctico no encontrado." };
    }

    for(const submission of assignmentUrl.submissions) {
        const public_id = extractPublicId(submission.fileUrl)
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
            error: `Error al eliminar archivo de entrega en Cloudinary: ${result.result}`,
          };
        }

        await prisma.assignmentSubmission.delete({
            where: { id: submission.id },
        });
    }

    const public_id = extractPublicId(assignmentUrl.fileUrl)

    if (!public_id) {
      return {
        success: false,
        error: "No se pudo obtener el public_id del archivo.",
      };
    }
    if(!assignmentUrl.testCase) {
      const result = await deleteFileFromCloudinary(public_id);
      if (result.result !== "ok") {
        return {
          success: false,
          error: `Error al eliminar archivo de enunciado en Cloudinary: ${result.result}`,
        };
      }
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
