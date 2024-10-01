import {StudentRegistrationFormComponent} from "@/app/(loggedin)/student/add/student-registration-form";
import {countParents} from "@/app/(loggedin)/student/add/fetchParents";
import {getParents} from "@/app/(loggedin)/student/add/getParents";

import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function AddStudentPage({
                                                 searchParams,
                                             }: {
    searchParams: { [key: string]: string | undefined }
}) {
    await assertPermission({resource: Resource.STUDENT, operation: "CREATE"});

    const dni = searchParams?.dni || '';
    const lastName = searchParams?.lastName || '';
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;
    const results = await getParents(page, dni, lastName);
    const count = await countParents();
    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <StudentRegistrationFormComponent data={results} count={numberOfPages}/>
    );
}