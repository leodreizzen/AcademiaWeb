import {z} from 'zod';

// registerAttendance(attendance: Record<number, AttendanceStatus>, gradeId: number
export const AttendanceCheckSchema = z.object({
    students: z.record(z.enum(['PRESENT', 'ABSENT'])),
    gradeId: z.number()
})

export type AttendanceCheck = z.infer<typeof AttendanceCheckSchema>