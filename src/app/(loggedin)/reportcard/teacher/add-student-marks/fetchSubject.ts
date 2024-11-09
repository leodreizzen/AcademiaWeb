import prisma from "@/lib/prisma";

export async function fetchSubject(id: number) {
    try {
        return await prisma.subject.findMany({
            where: {
                id: id
            },
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}