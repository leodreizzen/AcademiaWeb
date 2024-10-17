/*
* Imports necesarios
* */
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import { AdminEditComponent } from "./admin-edit";
import { getAdmin } from "../../adminActions";


interface AdminEditPageParams {
    id: string
}

export default async function EditAdminPage({params} : {params: AdminEditPageParams}) {
    await assertPermission({resource: Resource.ADMINISTRATOR, operation: "UPDATE"});

    const administrator = await getAdmin(Number(params.id))

    if (!administrator) {
        return <div>Administrador no encontrado</div>
    }

    return (
        <AdminEditComponent administrator={administrator} />
    );
}