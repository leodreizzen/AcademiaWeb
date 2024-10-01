"use server";

import { getCloudinaryFile } from "@/lib/cloudinary";
import { NextResponse } from "next/server";
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

export async function downloadFile(fileId: string) {
  if (!fileId) {
    throw new Error("Falta el parámetro 'fileId'");
  }

  // Obtener la URL del archivo desde la base de datos
  const file = await prisma.assignment.findUnique({
    where: { id: parseInt(fileId) },
  });

  if (!file || !file.fileUrl) {
    throw new Error("Archivo no encontrado");
  }

   const cloudinaryFile = await getCloudinaryFile(file.fileUrl);

   if (!cloudinaryFile) {
     throw new Error("No se pudo obtener el archivo desde el servidor");
   }
 
   return NextResponse.json({ file: cloudinaryFile });
}
