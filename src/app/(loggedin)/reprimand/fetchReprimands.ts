'use server';
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchSelectedChild} from "@/lib/data/children";
import prisma from "@/lib/prisma";
import {mapReprimandWithTeacher} from "@/lib/data/mappings";
import {ReprimandWithTeacher} from "@/lib/definitions/reprimand";

export async function fetchReprimands({page, init, end}: { page: number, init?: Date, end?: Date }): Promise<ReprimandWithTeacher[]> {
    const NUMBER_OF_REPRIMANDS = 5;
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            let id;
            if (profile.role == "Student")
                id = profile.id;
            else if (profile.role == "Parent") {
                const selectedChild = await fetchSelectedChild();
                if (selectedChild != null)
                    id = selectedChild.id;
                else
                    return [];
            } else if (profile.role == "Teacher") {
                id = undefined;
            } else {
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


            const reprimands = await prisma.reprimand.findMany({
                skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                take: NUMBER_OF_REPRIMANDS,
                where: {
                    ...idFilter,
                    ...dateFilter,
                },
                include: {
                    teacher: {
                        include:{
                            profile: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    },
                },
                orderBy: {
                    dateTime: "desc"
                }

            });
            return reprimands.map(mapReprimandWithTeacher)
        } else {
            return [];
        }

    } catch (error) {
        console.error("Error fetching reprimands:", error);
        return [];
    }
}

export async function countReprimands(init?: Date, end?: Date) {
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            let id;
            if (profile.role == "Student")
                id = profile.id;
            else if (profile.role == "Parent") {
                const selectedChild = await fetchSelectedChild();
                if (selectedChild != null)
                    id = selectedChild.id;
                else
                    return 0;
            } else {
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
        } else {
            return 0;
        }

    } catch (error) {
        console.error("Error counting reprimands:", error);
        return 0;
    }
}
