import {Parent, Profile, User} from "@prisma/client";
import {StudentWithUser} from "@/app/(loggedin)/student/data";

export interface ParentWithUser extends Parent, Profile{
    user : User
}

export interface ParentWithUserAndChildren extends ParentWithUser{
    children: StudentWithUser[]
}

export interface StudentWithUserAndParent extends StudentWithUser{
    parents: ParentWithUser[]
}