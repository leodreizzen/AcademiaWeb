import {NextResponse, NextRequest} from "next/server";
import getPrismaClient from '@/lib/prisma';
import {ParentAPIResponse} from "@/app/api/internal/parentInStudent/types";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";

export async function GET(request: NextRequest): Promise<NextResponse<ParentAPIResponse>>{

    await assertPermission({resource: Resource.PARENT, operation: "LIST"});
    const prisma = await getCurrentProfilePrismaClient();
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if(query === null){
        return new NextResponse('Missing query paramenter', {status: 400})
    }
    else{
        return NextResponse.json(await prisma.parent.findMany({
            where:
                {
                    user: {
                        lastName: {
                            contains: query,
                            mode : "insensitive"
                        }
                    }
                },
            include: {
                user: true
            }
        }))
    }


}