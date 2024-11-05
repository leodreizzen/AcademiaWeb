import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {redirect} from "next/navigation";
import {fetchCurrentUser} from "@/lib/data/users";


export default async function ShowAttendance(){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const user = await fetchCurrentUser();

    if (!user) redirect('/403')

    if (user.role != 'Teacher') redirect('/403')

    return (
        <div>Asistencia para profesor por año.</div>
    )
}