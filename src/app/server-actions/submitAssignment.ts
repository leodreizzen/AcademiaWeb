"use server";

import { z } from "zod";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { assignmentSchema } from "@/lib/models/addAssignment";

export async function submitAssignment(formData: FormData, fileName: string) {
  try {
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const subject = formData.get("subject");
    const grade = formData.get("grade");
    const validatedData = assignmentSchema.parse({
      title,
      description,
      subject,
      grade,
      fileName,
    });

    return { success: true, validatedData: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return {
      success: false,
      error: "Ocurrió un error al procesar el formulario.",
    };
  }
}

export async function submitAssignmentToDB(
  validatedData: {
    title: string;
    grade: string;
    subject: string;
    description?: string | undefined;
    fileName: string;
  },
  fileUrl: string
) {
  const prisma = await getCurrentProfilePrismaClient();

  await prisma.assignment.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      fileUrl: fileUrl,
      subjectId: Number(validatedData.subject),
    },
  });
}
