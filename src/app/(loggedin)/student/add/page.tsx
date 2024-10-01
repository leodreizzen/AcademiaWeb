import {StudentRegistrationFormComponent} from "@/app/(loggedin)/student/add/student-registration-form";


import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function AddStudentPage() {
    await assertPermission({resource: Resource.STUDENT, operation: "CREATE"});

    return (

                <StudentRegistrationFormComponent/>

    );
}