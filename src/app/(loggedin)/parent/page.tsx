/*
* Imports necesarios
* */

import {ListParents} from "@/components/list/ListParents";
import {getParents} from "@/app/(loggedin)/parent/getParents";
import {countParents} from "@/app/(loggedin)/parent/fetchParent";

export default async function ParentListPage({
                                           searchParams,
                                       }: {
    searchParams: { [key: string]: string | undefined }
}) {
    const dni = searchParams?.dni || '';
    const lastName = searchParams?.lastName || '';
    const page = Number(searchParams?.page) || 1;
    const COUNT_PER_PAGE = 10;


    const results = await getParents(page, dni, lastName);
    console.log(results)
    const count = await countParents();


    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    return (
        <ListParents data={results} count={numberOfPages} />
    );
}