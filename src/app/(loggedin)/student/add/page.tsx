import {StudentRegistrationFormComponent} from "@/app/(loggedin)/student/add/student-registration-form";


import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {getParents} from "@/app/(loggedin)/parent/getParents";
import {countParents} from "@/app/(loggedin)/parent/fetchParent";

export default async function AddStudentPage({
                                                 searchParams,
                                             }: {
    searchParams: { [key: string]: string | undefined }
}) {
    await assertPermission({resource: Resource.STUDENT, operation: "CREATE"});

    const dni = (searchParams.dni && searchParams.dni.length > 0) ? Number(searchParams.dni) : undefined;
    const lastName = (searchParams.lastName && searchParams.lastName.length > 0) ? searchParams.lastName : undefined;
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;
    const results = await getParents(page, dni, lastName);
    const count = await countParents();
    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <StudentRegistrationFormComponent data={results} count={numberOfPages}/>
    );
}