
import {fetchCurrentUser} from "@/lib/data/users";
import Prisma from "@/lib/prisma";

export async function fetchSubjectsFromTeacher() {
    const prisma = Prisma
    const profile = await fetchCurrentUser();
    console.log( "Id del profesor " + profile?.id)
    try {
        if (profile != null) {
            const teacherid = profile?.id
            return await prisma.subject.findMany({
                where: {
                    teachers: {
                        some: {
                            id: teacherid
                        }
                    }
                }
            });
        }
        else {
            return [];
        }

    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
}