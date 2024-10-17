"use server";

import { z } from "zod";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { assignmentSchema } from "@/lib/models/addAssignment";
import { uploadFile } from "../(loggedin)/assignment/add/addAssignmentForm";

export async function submitAssignment(formData: FormData, file: File | null) {
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
    });
    const prisma = await getCurrentProfilePrismaClient();
    const fileUrl = await uploadFile(file);

    await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fileUrl: fileUrl,
        subjectId: Number(validatedData.subject),
      },
    });

    return { success: true };
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
