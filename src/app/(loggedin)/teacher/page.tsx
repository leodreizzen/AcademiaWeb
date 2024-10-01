
import {ListTeachers} from "@/components/list/ListTeachers";
import {getTeachers} from "@/app/(loggedin)/teacher/getTeachers";
import {countTeachers} from "@/app/(loggedin)/teacher/fetchTeacher";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function TeacherListPage() {

export default async function TeacherListPage({
                                                 searchParams,
                                             }: {
    searchParams: { [key: string]: string | undefined }
}) {
    const dni = searchParams?.dni || '';
    const lastName = searchParams?.lastName || '';
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;


    const results = await getTeachers(page, dni, lastName);
    console.log(results)
    const count = await countTeachers();

    await assertPermission({resource: Resource.TEACHER, operation: "LIST"});
    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <ListTeachers data={results} count={numberOfPages} />
    );
}