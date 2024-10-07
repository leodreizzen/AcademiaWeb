import {BookOpen, GraduationCap, UserCog, Users, Users2} from "lucide-react";
import {ReactComponentLike} from "prop-types";
import {ProfileRole} from "@/lib/definitions";


export type HomeButton = {
    name: string,
    Icon: ReactComponentLike,
    href: string
}

const studentsButton: HomeButton = { name: "Alumnos", Icon: GraduationCap, href: "/student" }
const teachersButton: HomeButton = { name: "Docentes", Icon: Users, href: "/teacher" }
const adminsButton: HomeButton = { name: "Administradores", Icon: UserCog, href: "/admin" }
const parentsButton: HomeButton = { name: "Padres", Icon: Users2, href: "/parent" }
const assignmentsButton: HomeButton = { name: "Trabajos Prácticos", Icon: BookOpen, href: "/assignment" }


export const homeButtonsByRole: Record<ProfileRole, HomeButton[]> = {
    "Student": [assignmentsButton],
    "Teacher": [assignmentsButton],
    "Parent": [assignmentsButton],
    "Administrator": [studentsButton, teachersButton, parentsButton, adminsButton]
}