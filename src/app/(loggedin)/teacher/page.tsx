
import {ListTeachers} from "@/components/list/ListTeachers";
import {getTeachers} from "@/app/(loggedin)/teacher/getTeachers";
import {countTeachers} from "@/app/(loggedin)/teacher/fetchTeacher";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function TeacherListPage({
                                                 searchParams,
                                             }: {
    searchParams: { [key: string]: string | undefined }
}) {
    const dni = (searchParams.dni && searchParams.dni.length > 0) ? Number(searchParams.dni) : undefined;
    const lastName = (searchParams.lastName && searchParams.lastName.length > 0) ? searchParams.lastName : undefined;
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;


    const results = await getTeachers(page, dni, lastName);
    const count = await countTeachers();

    await assertPermission({resource: Resource.TEACHER, operation: "LIST"});
    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <ListTeachers data={results} count={numberOfPages} numberOfTeachers={results.length} />
    );
}