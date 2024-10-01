import {ProfileRole} from "@/lib/definitions";
import {Permission} from "@/lib/operation_list";
import {privileges} from "@/permissions";

export function hasPermission(role: ProfileRole, permission: Permission ) {
    const rolePermissions = privileges[role];
    const allowedOperations = rolePermissions.filter(p => p.resource === permission.resource).map(p => p.operations).flat();
    return allowedOperations.includes(permission.operation);
}