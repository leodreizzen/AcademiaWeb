import {Reprimand, Teacher, User} from "@prisma/client"

export interface ReprimandWithTeacherUser  extends Reprimand{
    teacher : Teacher & { user : User}
}