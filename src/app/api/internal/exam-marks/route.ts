import {NextRequest, NextResponse} from "next/server";
import {ExamMarkAPIResponse} from "@/app/api/internal/exam-marks/types";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchExamMarksForStudent} from "@/lib/actions/exam-marks-fetch";


export async function GET(request: NextRequest): Promise<NextResponse<ExamMarkAPIResponse>>{

    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});
    const searchParams = request.nextUrl.searchParams
    const studentId_param = searchParams.get('studentId')

    let studentId;
    if(studentId_param){
        studentId = Number(studentId_param);
        if(isNaN(studentId))
            return new NextResponse('Student ID must be a number', {status: 400})
    }
    else
        return new NextResponse('Missing query parameter', {status: 400})


    return NextResponse.json(await fetchExamMarksForStudent(studentId))
}