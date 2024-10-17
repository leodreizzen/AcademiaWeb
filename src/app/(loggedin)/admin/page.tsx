import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import AdminList from "./AdminList";
import { getAdmins, getTotalAdmins } from "./adminActions";

interface AdminListPageParams {
    page: string;
    dni: string;
    lastName: string;
}

export default async function AdminListPage({ searchParams }: { searchParams: AdminListPageParams}) {
    await assertPermission( {resource: Resource.ADMINISTRATOR, operation: "LIST"});

    const page = searchParams.page == undefined ? 1 : Number(searchParams.page);
    const dni = searchParams.dni == undefined || searchParams.dni === "" ? undefined : Number(searchParams.dni);
    const lastName = searchParams.lastName;

    const administratorsFromDB = await getAdmins({page, dni, lastName});
    console.log(administratorsFromDB);
    const administratorCount = await getTotalAdmins()

    return (
        <AdminList administrators={administratorsFromDB} count={administratorCount} />
    );
}