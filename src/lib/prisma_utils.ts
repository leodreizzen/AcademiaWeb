
import getPrismaClient from "@/lib/prisma";
import {auth} from "@/auth";

export async function getCurrentProfilePrismaClient(){
    const session = await auth();
    if(!session || !session.user?.role || !session.user?.dni)
        throw new Error("No session found");
    return getPrismaClient({id: session.user.dni, role: session.user.role});
}