import {assertPermission} from "@/lib/access_control";
import {fetchCurrentUser} from "@/lib/data/users";
import {Resource} from "@/lib/operation_list";
import {redirect} from "next/navigation";
import {fetchSelectedChild} from "@/lib/data/children";


export default async function Attendance() {

    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    const user = await fetchCurrentUser()

    if (!user)
        redirect("/403")

    if (user.role === 'Parent') {
        const child = await fetchSelectedChild()
        if (!child)
            redirect("/403")
        redirect(`/attendance/student/${child.id}`)
    } else {
        redirect("/403")
    }

    return (
        <div></div>
    )

}