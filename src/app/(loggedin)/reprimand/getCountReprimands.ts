import {getCountReprimandsFiltered} from "@/app/(loggedin)/reprimand/fetchReprimandsFiltered";


export async function getCountReprimands(page: number, init?: Date, end?: Date) {
    // Si se proporciona una `date`, filtrar la búsqueda
    if (init && end) {
        return await getCountReprimandsFiltered({initDate: init, endDate : end}, page );
    } else {
        // Si no hay filtros, devolver las amonestaciones por página
        return await getCountReprimands(page);  // Asumiendo que solo recibe `page` para paginar
    }
}