/*
* Imports necesarios
* */

import {ListParents} from "@/components/list/ListParents";
import {getParents} from "@/app/(loggedin)/parent/getParents";
import {countParents} from "@/app/(loggedin)/parent/fetchParent";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function ParentListPage({
                                           searchParams,
                                       }: {

    searchParams: { [key: string]: string | undefined }
}) {
    await assertPermission({resource: Resource.PARENT, operation: "LIST"});
    const dni = (searchParams.dni && searchParams.dni.length > 0) ? Number(searchParams.dni) : undefined;
    const lastName = (searchParams.lastName && searchParams.lastName.length > 0) ? searchParams.lastName : undefined;
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;


    const results = await getParents(page, dni, lastName);
    const count = await countParents();


    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <ListParents data={results} count={numberOfPages} numberOfParents={results.length}/>
    );
}