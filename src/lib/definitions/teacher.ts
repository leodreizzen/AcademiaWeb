import {Profile, Teacher} from "@prisma/client";
import {UserWithoutPassword} from "@/lib/definitions";

export interface TeacherWithProfileData extends Teacher, Profile {

}

export interface TeacherWithUser extends TeacherWithProfileData {
    user: UserWithoutPassword;
}
