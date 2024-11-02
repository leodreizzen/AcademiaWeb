import {NextResponse, NextRequest} from "next/server";
import {ParentAPIResponse} from "@/app/api/internal/parent/types";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {countParentsFiltered, fetchParentsFiltered} from "@/app/(loggedin)/parent/fetchParentsFiltered";
import {ParentCountAPIResponse} from "@/app/api/internal/parent/count/types";
import {PARENTS_PER_PAGE} from "@/lib/data/pagination";
import {z} from "zod";

export async function GET(request: NextRequest): Promise<NextResponse<ParentCountAPIResponse>>{

    await assertPermission({resource: Resource.PARENT, operation: "LIST"});
    const searchParams = request.nextUrl.searchParams
    const dni_param = searchParams.get('dni')
    const lastName = searchParams.get('lastName')
    const exclude_param = searchParams.get('exclude')

    let dni;
    if(dni_param){
        dni = Number(dni_param);
        if(isNaN(dni))
            return new NextResponse('DNI must be a number', {status: 400})
    }
    else
        dni = undefined

    let exclude = undefined;
    if(exclude_param){
        const excludeIds = exclude_param.split(",");
        const exclude_data = z.array(z.coerce.number().int()).safeParse(excludeIds)
        if(!exclude_data.success)
            return new NextResponse('Invalid exclude param', {status: 400})
        exclude = exclude_data.data;
    }
    const count = await countParentsFiltered({dni, lastName: lastName ?? undefined, exclude})
    return NextResponse.json({count: count, pages: Math.ceil(count / PARENTS_PER_PAGE)})
}