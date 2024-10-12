import "server-only"
import RouteRecognizer, {Results} from "route-recognizer";
import {Permission, Resource} from "@/lib/operation_list";

export const anonymousPages: string[] = [
    "/login",
    "/selectrole",
    "/403",
    "/forgotpassword",
    "/forgotpassword/confirmation",
    "/passwordreset"
]




const recognizer = new RouteRecognizer();
const routeList:{path: string, handler: Permission}[] = [
    {path: "/admin", handler: {resource: Resource.ADMINISTRATOR, operation: "LIST"}},
    {path: "/admin/:id", handler: {resource: Resource.ADMINISTRATOR, operation: "READ"}},
    {path: "/admin/:id/edit", handler: {resource: Resource.ADMINISTRATOR, operation: "UPDATE"}},
    {path: "/admin/add", handler: {resource: Resource.ADMINISTRATOR, operation: "CREATE"}},
    {path: "/assignment", handler: {resource: Resource.ASSIGNMENT, operation: "LIST"}},
    {path: "/assignment/:id", handler: {resource: Resource.ASSIGNMENT, operation: "READ"}},
    {path: "/assignment/:id/add", handler: {resource: Resource.ASSIGNMENT, operation: "CREATE"}},
    {path: "/assignment/:id/edit", handler: {resource: Resource.ASSIGNMENT, operation: "UPDATE"}},
    {path: "/changepassword", handler: {resource: Resource.USER, operation: "CHANGE_OWN_PASSWORD"}},
    {path: "/parent", handler: {resource: Resource.PARENT, operation: "LIST"}},
    {path: "/parent/:id", handler: {resource: Resource.PARENT, operation: "READ"}},
    {path: "/parent/:id/edit", handler: {resource: Resource.PARENT, operation: "UPDATE"}},
    {path: "/student", handler: {resource: Resource.STUDENT, operation: "LIST"}},
    {path: "/student/:id", handler: {resource: Resource.STUDENT, operation: "READ"}},
    {path: "/student/:id/edit", handler: {resource: Resource.STUDENT, operation: "UPDATE"}},
    {path: "/teacher", handler: {resource: Resource.TEACHER, operation: "LIST"}},
    {path: "/teacher/:id", handler: {resource: Resource.TEACHER, operation: "READ"}},
    {path: "/teacher/:id/edit", handler: {resource: Resource.TEACHER, operation: "UPDATE"}},
    {path: "/teacher/add", handler: {resource: Resource.TEACHER, operation: "CREATE"}},
]
routeList.forEach(route => recognizer.add([route]));

export function getPermission(path: string): Permission | null {
    const results: Results | undefined = recognizer.recognize(path);
    if (results && results.length > 0) {
        return results[0]?.handler as Permission ?? null;
    }
    else
        return null;
}