import {NextResponse, NextRequest} from "next/server";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {ReprimandStudentApiResponse} from "@/app/api/internal/reprimand/student/types";
import {fetchAllStudentsByGrade} from "@/lib/data/student";
import {z} from "zod";

export async function GET(request: NextRequest): Promise<NextResponse<ReprimandStudentApiResponse>>{

    await assertPermission({resource: Resource.REPRIMAND, operation: "CREATE"});
    const searchParams = request.nextUrl.searchParams
    const grade_param = searchParams.get('grade');
    const grade = z.string().min(1).safeParse(grade_param)
    if(!grade.success){
        return new NextResponse('Missing query paramenter', {status: 400})
    }


    const students = await fetchAllStudentsByGrade(grade.data)

    const result = students.map(student =>({id: student.id, dni: student.dni, firstName: student.user.firstName, lastName: student.user.lastName}))
    return NextResponse.json(result)
}