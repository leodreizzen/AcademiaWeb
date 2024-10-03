import {NextResponse, NextRequest} from "next/server";
import {ParentAPIResponse} from "@/app/api/internal/parent/types";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchParentsFiltered} from "@/app/(loggedin)/parent/fetchParentsFiltered";

export async function GET(request: NextRequest): Promise<NextResponse<ParentAPIResponse>>{

    await assertPermission({resource: Resource.PARENT, operation: "LIST"});
    const searchParams = request.nextUrl.searchParams
    const dni_param = searchParams.get('dni')
    const lastName = searchParams.get('last_name')
    const page_param = searchParams.get('page')

    if(page_param === ""){
        return new NextResponse('Missing query paramenter', {status: 400})
    }
    let dni;
    if(dni_param){
        dni = Number(dni_param);
        if(isNaN(dni))
            return new NextResponse('DNI must be a number', {status: 400})
    }
    else
        dni = undefined

    const page = Number(page_param);
    if (isNaN(page))
        return new NextResponse('Page must be a number', {status: 400})

    return NextResponse.json(await fetchParentsFiltered({dni, lastName: lastName ?? undefined}, page))
}