import {StudentRegistrationFormComponent} from "@/app/(loggedin)/student/add/student-registration-form";


import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {countParents} from "@/app/(loggedin)/parent/fetchParent";
import {STUDENTS_PER_PAGE} from "@/lib/data/pagination";
import {fetchParentsFiltered} from "@/app/(loggedin)/parent/fetchParentsFiltered";

export default async function AddStudentPage({
                                                 searchParams,
                                             }: {
    searchParams: { [key: string]: string | undefined }
}) {
    await assertPermission({resource: Resource.STUDENT, operation: "CREATE"});

    const dni = (searchParams.dni && searchParams.dni.length > 0) ? Number(searchParams.dni) : undefined;
    const lastName = (searchParams.lastName && searchParams.lastName.length > 0) ? searchParams.lastName : undefined;
    const page = Number(searchParams?.page) || 1;
    const results = await fetchParentsFiltered({dni, lastName}, page);
    const count = await countParents();
    const numberOfPages = Math.ceil(count / STUDENTS_PER_PAGE);

    return (
        <StudentRegistrationFormComponent data={results} numberPages={numberOfPages}/>
    );
}