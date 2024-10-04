'use server';

import { z } from "zod";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

const assignmentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  subject: z.string(),
});

export async function submitAssignment(formData: FormData) {
  try {
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const fileUrl = formData.get("fileUrl");
    const subject = formData.get("subject");

    const validatedData = assignmentSchema.parse({
      title,
      description,
      fileUrl,
      subject,
    });
    const prisma = await getCurrentProfilePrismaClient();
    await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fileUrl: validatedData.fileUrl,
        //subject: validatedData.subject, TODO
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
