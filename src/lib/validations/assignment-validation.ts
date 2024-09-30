import { z } from "zod";

const validExtensions = ["pdf", "docx", "pptx", "xlsx"];

// Schema de validación con Zod
export const assignmentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  file: z
    .custom<File>((file) => file instanceof File, "Archivo inválido")
    .refine((file) => {
      const extension = file.name.split(".").pop();
      return extension && validExtensions.includes(extension);
    }, "El archivo debe tener una extensión válida (.pdf, .docx, .pptx, .xlsx)"),
});
