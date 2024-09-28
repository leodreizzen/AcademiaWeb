import {PrismaClient} from '@prisma/client';
import {auth, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import {enhance} from "@zenstackhq/runtime";

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    const globalWithPrisma = globalThis as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}


export default function getPrismaClient(userProfile: auth.Profile): zPrismaClient{
    return enhance(prisma, {user: userProfile});
}

export function getRawPrismaClient(): PrismaClient{
    // USE ONLY FOR LOGIN
    return prisma;
}