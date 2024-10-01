'use server';

import { z } from "zod";
import getPrismaClient from "@/lib/prisma";

const assignmentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  materia: z.string(),
});

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

export async function submitAssignment(formData: FormData) {
  try {
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const fileUrl = formData.get("fileUrl");
    const materia = formData.get("materia");

    const validatedData = assignmentSchema.parse({
      title,
      description,
      fileUrl,
      materia,
    });

    await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fileUrl: validatedData.fileUrl,
        //materia: validatedData.materia, TODO
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
