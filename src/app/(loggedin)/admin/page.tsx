import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import AdminList from "./AdminList";

interface AdminListPageParams {
    page: string;
    dni: string;
    lastName: string;
}

export default async function AdminListPage({ searchParams }: { searchParams: AdminListPageParams}) {
    await assertPermission( {resource: Resource.ADMINISTRATOR, operation: "LIST"});
    return (
        <AdminList pageQuery={searchParams.page == undefined ? undefined : Number(searchParams.page) }
            dniQuery={searchParams.dni} lastNameQuery={searchParams.lastName} />
    );
}