import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";


export default async function ShowAttendance(){

    await assertPermission({resource: Resource.ATTENDANCE, operation: "READ"});

    return (
        <div>Hi</div>
    )
}