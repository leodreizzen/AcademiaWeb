import {z} from "zod";

export const validExtensions = ["pdf", "docx", "pptx", "xlsx"];
export const assignmentSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    description: z.string().optional(),
    fileUrl: z.string().url(),
    subject: z.string(),
    grade: z.string(),
})
    .refine(({fileUrl}) => {
        const extension = fileUrl.substring(fileUrl.lastIndexOf('.') + 1);
        return validExtensions.includes(extension.toLowerCase());
    }, {"message": "El archivo no tiene un tipo válido", path: ["fileUrl"]});