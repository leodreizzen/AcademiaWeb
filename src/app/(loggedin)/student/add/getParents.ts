import {fetchParentsFiltered} from "@/app/(loggedin)/student/add/fetchParentsFiltered";
import {fetchParents} from "@/app/(loggedin)/student/add/fetchParents";


export async function getParents(page: number, dni?: string, lastName?: string){
    // If query is provided, filter the array based on the query
    if (dni && dni.length > 0 || (lastName && lastName.length > 0)) {
        return await fetchParentsFiltered({dni: Number(dni), lastName}, page );
    }
    else{
        return await fetchParents(page);
    }

}