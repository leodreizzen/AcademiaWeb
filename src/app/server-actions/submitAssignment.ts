"use server";

import { z } from "zod";
import { assignmentSchema } from "@/lib/models/addAssignment";
import prisma from "@/lib/prisma";
import {generateSignature, SignatureData} from "@/lib/cloudinary/cloudinary_server";
import {revalidatePath} from "next/cache";

type SignatureResult = {
  success: true,
  signatureData: SignatureData
} | {
  success: false,
  error: string
}

export async function getAssignmentSignature(data: z.infer<typeof assignmentSchema>): Promise<SignatureResult> {
  try {
    const validatedData = assignmentSchema.parse(data);
    const signatureData = await generateSignature();
    return {success: true, signatureData: signatureData};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Error al validar datos: " + error.errors.map(e => e.message).join(", ") };
    }
    return {
      success: false,
      error: "Ocurrió un error al procesar el formulario.",
    };
  }
}

export async function saveAssignment(
  data: z.infer<typeof assignmentSchema>,
  fileUrl: string
) {
  try{
    const validatedData = assignmentSchema.parse(data);
    z.string().url().parse(fileUrl);

    await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        fileUrl: fileUrl,
        subjectId: Number(validatedData.subject),
      },
    });
    revalidatePath("/assignment");
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
