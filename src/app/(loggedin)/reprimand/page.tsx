import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import ListReprimands from "@/components/list/ListReprimands";
import {countReprimands, fetchReprimands} from "@/app/(loggedin)/reprimand/fetchReprimands";
import {z} from "zod";
import {format} from "date-fns";
const paramsModel = z.object({
    initDate: z.optional(z.coerce.date()),
    endDate: z.optional(z.coerce.date()),
    page: z.optional(z.coerce.number().int())
})

export default async function ReprimandListPage({
                                                    searchParams,
                                                }: {
    searchParams: Record<"initDate" | "endDate" | "page", string | undefined>
}){

    await assertPermission({resource: Resource.REPRIMAND, operation: "LIST"});

    const data = paramsModel.parse(searchParams);
    const {initDate, endDate, page} = data;
    const COUNT_PER_PAGE = 5;


    const results = await fetchReprimands({page: page ?? 1, init: initDate, end: endDate});
    const count = await countReprimands(initDate, endDate);


    const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

    let defaultInitDate = "";
    if(initDate){
        defaultInitDate = format(initDate, "dd-mm-yyyy");
    }
    let defaultEndDate = "";
    if(endDate)
        defaultEndDate = format(endDate, "dd-mm-yyyy");

    return (
        <ListReprimands data={results} count={numberOfPages} defaultInitDate={defaultInitDate} defaultEndDate={defaultEndDate}/>
    )
}