import {UserWithoutPassword} from "@/lib/definitions";
import {Profile, Subject, Teacher} from "@prisma/client";

export interface TeacherWithUserSubject extends Teacher, Profile {
    user: UserWithoutPassword
    subjects: Subject[]
}