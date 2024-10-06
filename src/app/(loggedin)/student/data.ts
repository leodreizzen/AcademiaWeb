import {Student, User} from "@prisma/client"

export interface StudentWithUser  extends Student{
    user : User
}