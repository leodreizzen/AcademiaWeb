import {fetchParents} from "@/app/(loggedin)/parent/fetchParent";
import {fetchParentsFiltered} from "@/app/(loggedin)/parent/fetchParentsFiltered";

export async function getParents(page: number, dni?: number, lastName?: string) {
    // Si se proporcionan `dni` o `lastName`, filtrar la búsqueda
    if (dni != undefined || (lastName && lastName)) {
        return await fetchParentsFiltered({dni: Number(dni), lastName}, page );
    } else {
        // Si no hay filtros, devolver los estudiantes por página
        return await fetchParents(page);  // Asumiendo que fetchStudents recibe solo `page` para paginar
    }
}