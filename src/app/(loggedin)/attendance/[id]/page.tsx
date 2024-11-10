import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {redirect} from "next/navigation";
import {fetchCurrentUser} from "@/lib/data/users";
import TeacherAttendance from "@/components/ui/attendance/TeacherAttendance";
import {getAttendanceForGrade} from "@/lib/actions/get-attendance";
import {z} from "zod";
import {fetchGradeByID} from "@/lib/data/fetchGradeNameByID";


export default async function ShowAttendance({ params: { id } }: { params: { id: string } }) {

    const stringIsNumber = z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) {
            redirect("/404")
        }
        return num;
    });

    stringIsNumber.safeParse(id);

    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const user = await fetchCurrentUser();

    if (!user) redirect('/403')

    if (user.role != 'Teacher') redirect('/403')

    const grade = await fetchGradeByID(parseInt(id))

    if (!grade) redirect('/404')

    const gradeName = grade?.name

    const attendanceData = await getAttendanceForGrade(parseInt(id))

    if (!attendanceData) redirect('/404')

    return (
        <TeacherAttendance attendanceData={attendanceData} gradeId={parseInt(id)} gradeName={gradeName}/>
    )
}