"use server";

import { assignmentSchema } from "@/lib/models/addAssignment";
import { z } from "zod";
import  getPrismaClient  from "@/lib/prisma";
const session: { user: { dni: number; role: "Teacher" | "Superuser" | "Student" | "Parent" | "Administrator" } } = {
  user: {
    dni: 12345678,
    role: "Teacher",
  },
}
const prisma = getPrismaClient({id: session.user.dni, role: session.user.role});

export async function submitAssignment(formData: FormData) {
  try {
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const file = formData.get("file") as File;

    const validatedData = assignmentSchema.parse({
      title,
      description,
      file,
    });

    // TODO: save file to server
    const fileUrl = `/uploads/${file.name}`;

    await prisma.assignment.create({
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
