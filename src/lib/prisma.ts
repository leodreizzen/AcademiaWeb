import "server-only"
import {PrismaClient} from '@prisma/client';
import {auth} from "@zenstackhq/runtime";
import {enhance} from "@zenstackhq/runtime";

let prisma: ReturnType<typeof createPrismaClient>;

function createPrismaClient(){
    return new PrismaClient(
        {
            transactionOptions: {
                maxWait: 10000,
                timeout: 10000
            }
        }
    );
}

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient( );
} else {
    const globalWithPrisma = globalThis as typeof globalThis & {
        prisma: ReturnType<typeof createPrismaClient>;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = createPrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}


export default function getPrismaClient(userProfile: auth.Profile){
    return enhance(prisma, {user: userProfile});
}

export function getRawPrismaClient(): ReturnType<typeof createPrismaClient>{
    // USE ONLY FOR LOGIN
    return prisma;
}

