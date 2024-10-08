import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchCurrentUser} from "@/lib/data/users";
import ChangePasswordForm from "@/components/ui/ChangePassword/ChangePasswordForm";

export default async function ChangePasswordPage() {
    await assertPermission({resource: Resource.USER, operation: "CHANGE_OWN_PASSWORD"});

    const user = await fetchCurrentUser();

    if(!user) {
        return <div>Usuario no encontrado</div>
    }

    return <ChangePasswordForm user={user}/>
}