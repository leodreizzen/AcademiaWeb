import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {fetchCurrentUser} from "@/lib/data/users";

export async function fetchSubjectsFromSubject() {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            const id = profile?.id
            return await prisma.student.findMany({
                where: {
                    grade: {
                        subjects: {
                            some: {
                                teachers: {
                                    some: {
                                        id: id
                                    }
                                }
                            }
                        }
                    }
                },
            });
        }
        else {
            return [];
        }

    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}