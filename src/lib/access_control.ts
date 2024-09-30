import "server-only"
import {Permission, Resource} from "@/lib/operation_list";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {hasPermission} from "@/lib/permissions";
export async function assertPermission(permission: Permission) {
    const role = (await auth())?.user.role;

    if(!role) {
        redirect("/selectrole");
    }
    if (!hasPermission(role, permission)) {
        console.log(`User with role ${role} tried to access ${permission}`);
        redirect("/403");
    }
}