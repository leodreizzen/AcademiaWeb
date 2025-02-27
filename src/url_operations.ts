import "server-only"
import RouteRecognizer, {Results} from "route-recognizer";
import {Permission, Resource} from "@/lib/operation_list";

export const anonymousPages: string[] = [
    "/login",
    "/selectrole",
    "/403",
    "/forgotpassword",
    "/forgotpassword/confirmation",
    "/passwordreset",
    "/loginredirect"
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
    {path: "/assignment/:id/submit", handler: {resource: Resource.ASSIGNMENT, operation: "SUBMIT"}},
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
    {path: "/selectstudent", handler: {resource: Resource.USER, operation: "SELECT_CHILD"}},
    {path: "/exam-mark", handler: {resource: Resource.EXAM_MARK, operation: "LIST"}},
    {path: "/exam-mark/exam/:id/edit", handler: {resource: Resource.EXAM_MARK, operation: "UPDATE"}},
    {path: "/exam-mark/subject/:id", handler: {resource: Resource.EXAM_MARK, operation: "LIST"}},
    {path: "/exam-mark/exam/:id", handler: {resource: Resource.EXAM_MARK, operation: "LIST"}},
    {path: "/exam-mark/add", handler: {resource: Resource.EXAM_MARK, operation: "CREATE"}},
    {path: "/exam-mark/add/subject", handler: {resource: Resource.EXAM_MARK, operation: "CREATE"}},
    {path: "/exam-mark/add/subject/:id", handler: {resource: Resource.EXAM_MARK, operation: "CREATE"}},
    {path: "/reportcard", handler: {resource: Resource.REPORT_CARD, operation: "READ"}},
    {path: "/reportcard/:id/edit", handler: {resource: Resource.REPORT_CARD, operation: "UPDATE"}},
    {path: "/reportcard/teacher", handler: {resource: Resource.REPORT_CARD, operation: "CREATE"}},
    {path: "/reportcard/teacher/add-student-marks", handler: {resource: Resource.REPORT_CARD, operation: "CREATE"}},
    {path: "/reprimand", handler: {resource: Resource.REPRIMAND, operation: "LIST"}},
    {path: "/reprimand/:id", handler: {resource: Resource.REPRIMAND, operation: "READ"}},
    {path: "/reprimand/add", handler: {resource: Resource.REPRIMAND, operation: "CREATE"}},
    {path: "/api/reprimand/student", handler: {resource: Resource.REPRIMAND, operation: "CREATE"}},
    {path: "/attendance", handler: {resource: Resource.ATTENDANCE, operation: "READ"}},
    {path: "/attendance/:id", handler: {resource: Resource.ATTENDANCE, operation: "READ"}},
    {path: "/attendance/:id/add", handler: {resource: Resource.ATTENDANCE, operation: "CREATE"}},
    {path: "/attendance/student/:id", handler: {resource: Resource.ATTENDANCE, operation: "READ"}},
    {path: "/attendance/student", handler: {resource: Resource.ATTENDANCE, operation: "READ"}},
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