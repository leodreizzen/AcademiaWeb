"use server";

import cloudinary from "@/lib/cloudinary";
import { z } from "zod";
import  getPrismaClient  from "@/lib/prisma";
const session: { user: { dni: number; role: "Teacher" | "Superuser" | "Student" | "Parent" | "Administrator" } } = {
  user: {
    dni: 22222222,
    role: "Teacher",
  },
}
const prisma = getPrismaClient({id: session.user.dni, role: session.user.role});

const fileSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  file: z.string().min(1, "El archivo es requerido"),
});

export async function uploadFile(formData: FormData) {
  const parsedData = fileSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    file: formData.get("file"),
  });

  if (!parsedData.success) {
    return {
      success: false,
      errors: parsedData.error.flatten(),
    };
  }

  const { title, description, file } = parsedData.data;

  try {
    const uploadedFile = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    await prisma.assignment.create({
      data: {
        title,
        description: description ?? "",
        fileUrl: uploadedFile.secure_url,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, errors: { general: "Error al subir el archivo." } };
  }
}
