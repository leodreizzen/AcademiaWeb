import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function AddReprimandPage(){
    await assertPermission({resource: Resource.REPRIMAND, operation: "CREATE"});

    return (<div>
        <h1>Registrar amonestación</h1>
    </div>)
}