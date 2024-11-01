import {Profile, Teacher} from "@prisma/client";
import {UserWithoutPassword} from "@/lib/definitions";

export interface AdministratorWithProfileData extends Teacher, Profile {

}

export interface AdministratorWithUser extends AdministratorWithProfileData {
    user: UserWithoutPassword;
}
