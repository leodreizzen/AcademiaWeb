import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import AddReprimandForm from "@/components/ui/reprimand/AddReprimandForm";
import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";

export default async function AddReprimandPage(){
    await assertPermission({resource: Resource.REPRIMAND, operation: "CREATE"});
    const grades = await fetchGrades();
    return <AddReprimandForm grades={grades}/>
}