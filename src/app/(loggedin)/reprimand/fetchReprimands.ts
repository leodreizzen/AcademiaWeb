'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {auth} from "@/auth";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchSelectedChild} from "@/lib/data/children";

export async function fetchReprimands({page, init, end}:{page: number, init?: Date, end?: Date}) {
    const prisma = await getCurrentProfilePrismaClient()
    const NUMBER_OF_REPRIMANDS = 5;
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            let id;
            if(profile.role == "Student")
                id = profile.id;
            else if(profile.role == "Parent") {
                const selectedChild = await fetchSelectedChild();
                if(selectedChild != null)
                    id = selectedChild.id;
                else
                    return [];
            }
            else{
                console.error("Error fetching reprimands: User is not a student or parent");
                return [];
            }

            const dateFilter = init && end ? {
                dateTime: {
                    gte: init,
                    lte: end
                }
            } : {};

            const idFilter = id !== undefined ? {
                students: {
                    some: {
                        id: id
                    }
                }
            } : {};



            return await prisma.reprimand.findMany({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        ...idFilter,
                        ...dateFilter,
                    },
                    include: {
                        Teacher: {
                            include: {
                                user: true
                            }
                        },
                    }
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

export async function countReprimands(init?: Date, end?: Date) {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            let id;
            if(profile.role == "Student")
                id = profile.id;
            else if(profile.role == "Parent") {
                const selectedChild = await fetchSelectedChild();
                if(selectedChild != null)
                    id = selectedChild.id;
                else
                    return 0;
            }
            else{
                console.error("Error counting reprimands: User is not a student or parent");
                return 0;
            }

            const dateFilter = init && end ? {
                dateTime: {
                    gte: init,
                    lte: end
                }
            } : {};

            const idFilter = id !== undefined ? {
                students: {
                    some: {
                        id: id
                    }
                }
            } : {};



            return await prisma.reprimand.count({
                where: {
                    ...idFilter,
                    ...dateFilter,
                }
            });
        }
        else {
            return 0;
        }

    } catch (error) {
        console.error("Error counting reprimands:", error);
        return 0;
    }
}
