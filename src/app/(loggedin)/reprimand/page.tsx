import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ReprimandListPage(){
    await assertPermission({resource: Resource.REPRIMAND, operation: "LIST"});

    return (<div>
        <h1>Listado de amonestaciones</h1>
    </div>)
}