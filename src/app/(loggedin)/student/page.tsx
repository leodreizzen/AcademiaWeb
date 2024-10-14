import {ListStudents} from "@/components/list/ListStudents"
import {countStudents} from "@/app/(loggedin)/student/fetchStudents";
import {getStudents} from "@/app/(loggedin)/student/getStudents";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function StudentListPage({
                                                  searchParams,
                                              }: {
    searchParams: Record<"dni" | "lastName" | "page", string | undefined> ;
}) {
    await assertPermission({resource: Resource.STUDENT, operation: "LIST"});

    const dni = (searchParams.dni && searchParams.dni.length > 0) ? Number(searchParams.dni) : undefined;
    const lastName = (searchParams.lastName && searchParams.lastName.length > 0) ? searchParams.lastName : undefined;
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;

    const results = await getStudents(page, dni, lastName);
    const count = await countStudents();


    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <ListStudents data={results} count={numberOfPages} numberOfStudents={results.length} />
    );
}