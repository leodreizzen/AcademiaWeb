import {PrismaClient} from '@prisma/client';
import {auth, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import {enhance} from "@zenstackhq/runtime";

let prisma: PrismaClient;

function createPrisma(){
    return new PrismaClient(
        {
            transactionOptions: {
                isolationLevel: 'Serializable',
                timeout: 10000,
                maxWait: 10000,
        }
    });
}


if (process.env.NODE_ENV === 'production') {
    prisma = createPrisma();
} else {
    const globalWithPrisma = globalThis as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = createPrisma();
    }
    prisma = globalWithPrisma.prisma;
}


export default function getPrismaClient(userProfile: auth.Profile): zPrismaClient{
    return enhance(prisma, {user: userProfile});
}