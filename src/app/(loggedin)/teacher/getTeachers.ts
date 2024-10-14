import {fetchTeachers} from "@/app/(loggedin)/teacher/fetchTeacher";
import {fetchTeachersFiltered} from "@/app/(loggedin)/teacher/fetchTeacherFiltered";

export async function getTeachers(page: number, dni?: number, lastName?: string) {
    // Si se proporcionan `dni` o `lastName`, filtrar la búsqueda
    if (dni || (lastName && lastName.length > 0)) {
        return await fetchTeachersFiltered({dni: dni, lastName}, page );
    } else {
        // Si no hay filtros, devolver los estudiantes por página
        return await fetchTeachers(page);  // Asumiendo que fetchTeachers recibe solo `page` para paginar
    }
}