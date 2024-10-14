import {Reprimand, Teacher, User} from "@prisma/client"

export interface ReprimandWithTeacherUser  extends Reprimand{
    Teacher : Teacher & { user : User}
}