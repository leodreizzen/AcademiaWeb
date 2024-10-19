import {Profile, Student, User} from "@prisma/client"

export interface StudentWithUser  extends Student, Profile{
    user : User
}