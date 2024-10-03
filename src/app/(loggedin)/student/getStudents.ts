import {fetchStudentsFiltered} from "@/app/(loggedin)/student/fetchStudentsFiltered";
import {fetchStudents} from "@/app/(loggedin)/student/fetchStudents";


export async function getStudents(page: number, dni?: string, lastName?: string) {
    // Si se proporcionan `dni` o `lastName`, filtrar la búsqueda
    if ((dni && dni.length > 0) || (lastName && lastName.length > 0)) {
        return await fetchStudentsFiltered({dni: Number(dni), lastName}, page );
    } else {
        // Si no hay filtros, devolver los estudiantes por página
        return await fetchStudents(page);  // Asumiendo que fetchStudents recibe solo `page` para paginar
    }
}