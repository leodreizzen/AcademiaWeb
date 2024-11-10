import prisma from "@/lib/prisma";

export async function fetchSubject(id: number) {
    return prisma.subject.findUnique({
        where: {
            id: id
        },
        include : {
            grade: true
        }
    });
}