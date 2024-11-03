import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";
import {AttendanceChooseYear} from "@/components/ui/attendance/AttendanceChooseYear";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";


export default async function Attendance(){

    const response = await fetchGrades();
    await assertPermission({resource: Resource.ATTENDANCE, operation: "LIST"});

    return (
        <AttendanceChooseYear grades={response}/>
    )
}