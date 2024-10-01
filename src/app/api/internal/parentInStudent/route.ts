import {NextResponse, NextRequest} from "next/server";
import getPrismaClient from '@/app/lib/prisma';
import {ParentAPIResponse} from "@/app/api/internal/parentInStudent/types";

export async function GET(request: NextRequest): Promise<NextResponse<ParentAPIResponse>>{

    //TODO: LA AUTORIZACION
    const prisma = getPrismaClient({id: 1, role: "Administrator"});
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