"use server";

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
    return { error: "Falta el parámetro 'fileId'" };
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!assignment || !assignment.fileUrl) {
      return { error: "Archivo no encontrado" };
    }

    return {
      fileUrl: assignment.fileUrl,
      fileName: assignment.title,
    };
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    return { error: "Error interno del servidor" };
  }
}
