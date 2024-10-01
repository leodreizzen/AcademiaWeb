import {fetchTeachers} from "@/app/(loggedin)/teacher/fetchTeacher";
import {fetchTeachersFiltered} from "@/app/(loggedin)/teacher/fetchTeacherFiltered";

export async function getTeachers(page: number, dni?: string, lastName?: string) {
    // Si se proporcionan `dni` o `lastName`, filtrar la búsqueda
    if ((dni && dni.length > 0) || (lastName && lastName.length > 0)) {
        return await fetchTeachersFiltered({dni: Number(dni), lastName}, page );
    } else {
        // Si no hay filtros, devolver los estudiantes por página
        return await fetchTeachers(page);  // Asumiendo que fetchTeachers recibe solo `page` para paginar
    }
}