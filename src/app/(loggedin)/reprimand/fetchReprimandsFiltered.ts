'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";
import {auth} from "@/auth";
import {fetchCurrentUser} from "@/lib/data/users";

export async function fetchReprimandsFiltered({initDate, endDate}: {
    initDate?: Date,
    endDate?: Date,
}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    const role = (await auth())?.user.role;

    try {
        const NUMBER_OF_REPRIMANDS = 5;
        if (profile != null) {
            if (role === "Student") {
                return await prisma.reprimand.findMany({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        dateTime: {
                            gte: initDate,
                            lte: endDate
                        },
                        students: {
                            some: {
                                id: profile.id
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
                })
            } else { //TODO cuando este lo de seleccionar hijo para las sancicones esto sera modificado
                return await prisma.reprimand.findMany({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        dateTime: {
                            gte: initDate,
                            lte: endDate
                        },
                        students: {
                            some: {
                                parents: {
                                    some: {
                                        id: profile.id
                                    }

                                }
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
                })
            }
        }{
            return [];
        }

    } catch (error) {
        console.error("Error fetching reprimands:", error);
        return [];
    }
}

export async function getCountReprimandsFiltered({initDate, endDate}: {
    initDate?: Date,
    endDate?: Date,
}, page: number) {
    const prisma = await getCurrentProfilePrismaClient()
    const profile = await fetchCurrentUser();
    const role = (await auth())?.user.role;

    try {
        const NUMBER_OF_REPRIMANDS = 5;
        if (profile != null) {
            if (role === "Student") {
                return await prisma.reprimand.count({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        dateTime: {
                            gte: initDate,
                            lte: endDate
                        },
                        students: {
                            some: {
                                id: profile.id
                            }
                        }
                    }
                })
            } else { //TODO cuando este lo de seleccionar hijo para las sancicones esto sera modificado
                return await prisma.reprimand.findMany({
                    skip: (page - 1) * NUMBER_OF_REPRIMANDS,
                    take: NUMBER_OF_REPRIMANDS,
                    where: {
                        dateTime: {
                            gte: initDate,
                            lte: endDate
                        },
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
                })
            }
        }{
            return 0;
        }

    } catch (error) {
        console.error("Error fetching reprimands:", error);
        return [];
    }
}