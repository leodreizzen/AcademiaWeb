import {Reprimand, Student, Teacher, User} from "@prisma/client"

export interface ReprimandWithTeacherUser extends Reprimand {
    teacher: Teacher & { user: User }
    students: (Student & { user: User })[]
}