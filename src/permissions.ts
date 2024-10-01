import {ProfileRole} from "@/lib/definitions";
import {PermissionList, Resource} from "@/lib/operation_list";


const userPrivileges: PermissionList[] = [
    {resource: Resource.USER, operations: ["CHANGE_OWN_PASSWORD"]}
];

const adminPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.PARENT, operations: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"]},
    {resource: Resource.STUDENT, operations: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"]},
    {resource: Resource.TEACHER, operations: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"]},
    {resource: Resource.ADMINISTRATOR, operations: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"]},
];

const teacherPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST", "CREATE", "DELETE"]},
];

const parentPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST"]},
];

const studentPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST"]}
]



export const privileges: Record<ProfileRole, PermissionList[]> = {
    "Administrator": adminPrivileges,
    "Teacher": teacherPrivileges,
    "Parent": parentPrivileges,
    "Student": studentPrivileges
};