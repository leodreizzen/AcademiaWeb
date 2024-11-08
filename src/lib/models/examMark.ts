import { z } from "zod";

export const ExamMarkEditModel = z.object({
    marks: z.array(
        z.object({
            id: z.number(),
            examId: z.number(),
            studentId: z.number(),
            mark: z.number()
        })
    )
});

export type ExamMarkEdit = z.infer<typeof ExamMarkEditModel>