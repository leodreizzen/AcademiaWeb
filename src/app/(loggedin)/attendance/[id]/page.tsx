import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {redirect} from "next/navigation";
import {fetchCurrentUser} from "@/lib/data/users";
import TeacherAttendance from "@/components/ui/attendance/TeacherAttendance";
import {getAttendanceForGrade} from "@/lib/actions/get-attendance";


export default async function ShowAttendance({ params: { id } }: { params: { id: string } }) {



    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const user = await fetchCurrentUser();

    if (!user) redirect('/403')

    if (user.role != 'Teacher') redirect('/403')

    const attendanceData = await getAttendanceForGrade(parseInt(id))

    console.log(attendanceData)

    if (!attendanceData) redirect('/404')

    return (
        <TeacherAttendance attendanceData={attendanceData}/>
    )
}