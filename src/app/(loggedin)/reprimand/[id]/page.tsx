import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ReprimandInfoPage({params: {id}}: {params: {id: string}}){
    await assertPermission({resource: Resource.REPRIMAND, operation: "READ"});

    return (<div>
        <h1>Detalle de amonestación {id}</h1>
    </div>)
}