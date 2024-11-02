import {Profile, Student, User} from "@prisma/client";
import {UserWithoutPassword} from "@/lib/definitions";

export interface StudentWithProfileData extends Student, Profile {

}

export interface StudentWithUser extends StudentWithProfileData {
    user: UserWithoutPassword
}