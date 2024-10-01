"use server";

import { assignmentSchema } from "@/lib/validations/assignment-validation";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function submitAssignment(formData: FormData) {
  try {
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const file = formData.get("file") as File;

    //zod validation
    const validatedData = assignmentSchema.parse({
      title,
      description,
      file,
    });

    // TODO: save file to server
    const fileUrl = `/uploads/${file.name}`;

    await db.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fileUrl,
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
