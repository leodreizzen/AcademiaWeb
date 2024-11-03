import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function RegisterAttendance(){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "CREATE"});

    return (
        <div>Hi owo</div>
    )
}