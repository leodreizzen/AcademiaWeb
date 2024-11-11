import {
    AlertTriangle,
    BookOpen,
    CalendarCheck2,
    CheckSquare,
    FileText,
    GraduationCap,
    UserCog,
    Users,
    Users2
} from "lucide-react";
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
const parentsButton: HomeButton = { name: "Responsables", Icon: Users2, href: "/parent" }
const assignmentsButton: HomeButton = { name: "Trabajos Prácticos", Icon: BookOpen, href: "/assignment" }
const reprimandsButton: HomeButton = { name: "Amonestaciones", Icon: AlertTriangle, href: "/reprimand" }
const reportCardsButtonView: HomeButton = { name: "Boletín", Icon: FileText, href: "/reportcard" }
const reportCardsButtonCreate: HomeButton = { name: "Boletines", Icon: FileText, href: "/reportcard/create" }
const examMarksButton: HomeButton = { name: "Notas de exámenes", Icon: CheckSquare, href: "/exam-mark" }
const attendanceButton: HomeButton = {name: "Asistencia", Icon: CalendarCheck2, href: "/attendance"}

export const homeButtonsByRole: Record<ProfileRole, HomeButton[]> = {
    "Student": [assignmentsButton, reprimandsButton, reportCardsButtonView, examMarksButton],
    "Teacher": [assignmentsButton, reprimandsButton, reportCardsButtonCreate, examMarksButton, attendanceButton],
    "Parent": [assignmentsButton, reprimandsButton, reportCardsButtonView, examMarksButton],
    "Administrator": [studentsButton, teachersButton, parentsButton, adminsButton]
}