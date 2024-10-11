import {AlertTriangle, BookOpen, CheckSquare, FileText, GraduationCap, UserCog, Users, Users2} from "lucide-react";
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
const reprimandsButton: HomeButton = { name: "Amonestaciones", Icon: AlertTriangle, href: "/reprimand" }
const reportCardsButton: HomeButton = { name: "Boletines", Icon: FileText, href: "/reportcard" }
const examMarksButton: HomeButton = { name: "Notas de exámenes", Icon: CheckSquare, href: "/exam-mark" }

export const homeButtonsByRole: Record<ProfileRole, HomeButton[]> = {
    "Student": [assignmentsButton, reprimandsButton, reportCardsButton, examMarksButton],
    "Teacher": [assignmentsButton, reprimandsButton, reportCardsButton, examMarksButton],
    "Parent": [assignmentsButton, reprimandsButton, reportCardsButton, examMarksButton],
    "Administrator": [studentsButton, teachersButton, parentsButton, adminsButton]
}