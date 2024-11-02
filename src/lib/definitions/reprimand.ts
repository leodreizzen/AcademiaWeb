import {Reprimand} from "@prisma/client";
import {TeacherWithUser} from "@/lib/definitions/teacher";
import {StudentWithUser} from "@/lib/definitions/student";

export interface ReprimandWithTeacher extends Reprimand {
    teacher: TeacherWithUser
}

export interface ReprimandWithTeacherAndStudents extends ReprimandWithTeacher {
    students: StudentWithUser[]
}