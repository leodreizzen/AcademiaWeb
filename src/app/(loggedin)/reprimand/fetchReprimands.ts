'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {auth} from "@/auth";
import {fetchCurrentUser} from "@/lib/data/users";

export async function fetchReprimands(page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    const NUMBER_OF_REPRIMANDS = 5;
    const role = (await auth())?.user.role;
    const profile = await fetchCurrentUser();
    try {
        if (profile != null) {
            const id = profile?.id
            return await prisma.reprimand.findMany({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        students: {
                            some: {
                                id: id
                            }
                        }
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

export async function countReprimands() {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    const role = (await auth())?.user.role;
    try {
        if (profile != null) {
            if (role === "Student") {
                return await prisma.reprimand.count({
                    where: {
                        students: {
                            some: {
                                id: profile.id
                            }
                        }
                    }
                });
            } else {
                return await prisma.reprimand.count({
                    where: {
                        students: {
                            some: {
                                parents: {
                                    some: {
                                        id: profile.id
                                    }

                                }
                            }
                        }
                    }
                });
            }
        }
        else {
            return 0;
        }
    } catch (error) {
        console.error("Error counting reprimands:", error);
        return 0;
    }
}