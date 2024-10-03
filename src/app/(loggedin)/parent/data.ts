import {Parent, User} from "@prisma/client"

export interface ParentWithUser  extends Parent{
    user : User
}