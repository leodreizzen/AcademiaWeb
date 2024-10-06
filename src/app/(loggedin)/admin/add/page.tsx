/*
* Imports necesarios
* */

import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {AdminRegistrationFormComponent} from "@/app/(loggedin)/admin/add/admin-registration-form";
export default async function AddAdminPage() {
    await assertPermission({resource: Resource.ADMINISTRATOR, operation: "CREATE"});

    return (
        <AdminRegistrationFormComponent/>
    );
}