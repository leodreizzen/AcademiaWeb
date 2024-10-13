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
    {resource: Resource.USER, operations: ["DELETE"]},
    {resource: Resource.PROFILE, operations: ["DELETE"]},
];

const teacherPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST", "CREATE", "UPDATE", "DELETE"]},
    {resource: Resource.EXAM_MARK, operations: ["LIST", "CREATE", "UPDATE"]},
    {resource: Resource.REPORT_CARD, operations: ["LIST", "READ", "CREATE", "UPDATE"]},
    {resource: Resource.REPRIMAND, operations: ["LIST", "CREATE", "READ"]},
];

const parentPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST"]},
    {resource: Resource.EXAM_MARK, operations: ["LIST"]},
    {resource: Resource.REPORT_CARD, operations: ["LIST", "READ"]},
    {resource: Resource.REPRIMAND, operations: ["LIST", "CREATE", "READ"]},
    {resource: Resource.USER, operations: ["SELECT_CHILD"]}
];

const studentPrivileges: PermissionList[] = [
    ...userPrivileges,
    {resource: Resource.ASSIGNMENT, operations: ["READ", "LIST"]},
    {resource: Resource.EXAM_MARK, operations: ["LIST"]},
    {resource: Resource.REPORT_CARD, operations: ["LIST", "READ"]},
    {resource: Resource.REPRIMAND, operations: ["LIST", "CREATE", "READ"]},
]



export const privileges: Record<ProfileRole, PermissionList[]> = {
    "Administrator": adminPrivileges,
    "Teacher": teacherPrivileges,
    "Parent": parentPrivileges,
    "Student": studentPrivileges
};