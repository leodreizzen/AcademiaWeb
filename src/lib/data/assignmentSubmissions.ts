import prisma from "@/lib/prisma";

export function fetchSubmissionByStudentAndAssignment(studentId: number, assignmentId: number) {
    return prisma.assignmentSubmission.findUnique({
        where: {
            studentId_assignmentId: {
                studentId,
                assignmentId
            }
        }
    });
}