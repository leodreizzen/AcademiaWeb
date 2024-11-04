import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import StudentAttendance from "@/components/ui/attendance/StudentAttendance";
import {fetchSelectedChild} from "@/lib/data/children";
import {getAttendanceForStudent} from "@/lib/actions/get-attendance";
import {redirect} from "next/navigation";


export default async function ShowAttendance(){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const student = await fetchSelectedChild()

    if(!student) redirect('/403')

    const studentData = await getAttendanceForStudent(student.id)

    if (!studentData) redirect('/404')

    return (
        <StudentAttendance student={studentData}/>
    )
}