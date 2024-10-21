import { z } from "zod";

export const validExtensions = ["pdf", "docx", "pptx", "xlsx"];
export const assignmentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  subject: z.string().min(2, "La materia es obligatoria"),
  grade: z.string().min(2, "El grado es obligatorio"),
  fileName: z.string().refine(
    (value) => {
      const extension = value.split(".").pop();
      return validExtensions.includes(extension || "");
    },
    {
      message: "El archivo debe ser un PDF, DOCX, PPTX, XLSX",
    }
  ),
});
