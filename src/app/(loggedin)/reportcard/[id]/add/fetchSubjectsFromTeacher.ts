import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {fetchCurrentUser} from "@/lib/data/users";

export async function fetchSubjectsFromTeacher() {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            const id = profile?.id
            return await prisma.subject.findMany({
                where: {
                    teachers: {
                        some: {
                            id: id
                        }
                    }
                },
            });
        }
        else {
            return [];
        }

    } catch (error) {
        console.error("Error fetching reprimands:", error);
        return [];
    }
}