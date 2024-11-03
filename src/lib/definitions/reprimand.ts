import {Reprimand} from "@prisma/client";
import {TeacherWithUser} from "@/lib/definitions/teacher";
import {StudentWithUser} from "@/lib/definitions/student";
import {SignatureWithParent} from "@/lib/definitions/signature";

export interface ReprimandWithTeacher extends Reprimand {
    teacher: TeacherWithUser
}

export interface ReprimandWithTeacherAndStudents extends ReprimandWithTeacher {
    students: {
        student: StudentWithUser
    }[]
}
export interface ReprimandWithTeacherStudentsAndSignature extends Reprimand {
    students: {
        student: StudentWithUser
        signature: SignatureWithParent | null
    }[]
    teacher: TeacherWithUser
}