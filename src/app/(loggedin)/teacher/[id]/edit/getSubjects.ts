import prisma from "@/lib/prisma";

export async function fetchSubjects() {
    try {
        return await prisma.subject.findMany({});
    } catch (error) {
        console.error("Error fetching grades:", error);
        return [];
    }
}