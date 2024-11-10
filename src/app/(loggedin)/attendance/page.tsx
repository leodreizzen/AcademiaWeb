import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";
import {AttendanceChooseYear} from "@/components/ui/attendance/AttendanceChooseYear";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchCurrentUser} from "@/lib/data/users";
import {redirect} from "next/navigation";
import {fetchSelectedChild} from "@/lib/data/children";


export default async function Attendance(){

    const response = await fetchGrades();
    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const user = await fetchCurrentUser()

    if(!user)
        redirect("/403")

    if(user.role === 'Parent'){
        const child = await fetchSelectedChild()
        if(!child)
            redirect("/403")
        redirect(`/attendance/student/${child.id}`)
    }

    return (
        <AttendanceChooseYear grades={response}/>
    )
}