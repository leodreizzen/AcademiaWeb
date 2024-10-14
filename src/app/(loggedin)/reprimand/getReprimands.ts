import {fetchReprimands} from "@/app/(loggedin)/reprimand/fetchReprimands";
import {DateTime} from "@auth/core/providers/kakao";
import {fetchReprimandsFiltered} from "@/app/(loggedin)/reprimand/fetchReprimandsFiltered";


export async function getReprimands(page: number, init?: Date, end?: Date) {
    // Si se proporciona una `date`, filtrar la búsqueda
    if (init && end) {
        return await fetchReprimandsFiltered({initDate: init, endDate : end}, page );
    } else {
        // Si no hay filtros, devolver las amonestaciones por página
        return await fetchReprimands(page);  // Asumiendo que solo recibe `page` para paginar
    }
}