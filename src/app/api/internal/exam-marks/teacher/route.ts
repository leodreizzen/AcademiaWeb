import {NextResponse, NextRequest} from "next/server";
import {TeacherMarkAPIResponse} from "@/app/api/internal/exam-marks/teacher/types";
import {fetchExamMarksForTeacher} from "@/lib/actions/exam-marks-fetch";
import {Resource} from "@/lib/operation_list";
import {assertPermission} from "@/lib/access_control";

export async function GET(request: NextRequest): Promise<NextResponse<TeacherMarkAPIResponse>>{
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});
    const searchParams = request.nextUrl.searchParams
    const teacherId_param = searchParams.get('teacherId')

    let teacherId;
    if(teacherId_param){
        teacherId = Number(teacherId_param);
        if(isNaN(teacherId))
            return new NextResponse('Teacher ID must be a number', {status: 400})
    }
    else
        return new NextResponse('Missing query parameter', {status: 400})

    return NextResponse.json(await fetchExamMarksForTeacher(teacherId))
}