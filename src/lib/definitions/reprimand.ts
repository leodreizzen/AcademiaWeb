import {Reprimand} from "@prisma/client";
import {TeacherWithUser} from "@/lib/definitions/teacher";

export interface ReprimandWithTeacher extends Reprimand {
    teacher: TeacherWithUser
}