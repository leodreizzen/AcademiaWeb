import {Parent, Profile, User} from "@prisma/client";

import {StudentWithUser} from "@/lib/definitions/student";
import {UserWithoutPassword} from "@/lib/definitions";

export interface ParentWithProfileData extends Parent, Profile{

}

export interface ParentWithUser extends ParentWithProfileData{
    user : UserWithoutPassword
}

export interface ParentWithUserAndChildren extends ParentWithUser{
    children: StudentWithUser[]
}

export interface StudentWithUserAndParent extends StudentWithUser{
    parents: ParentWithUser[]
}