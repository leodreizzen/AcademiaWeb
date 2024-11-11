import {ProfileRole} from "@/lib/definitions";

type NavbarItem = {
    name: string
    href: string
}
export const navbarItems: Record<ProfileRole, NavbarItem[]> = {
    Parent: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }, {
        name: "Amonestaciones",
        href: "/reprimand"
    }, {
        name: "Notas de exámenes",
        href: "/exam-mark"
    }, {
        name: "Boletín",
        href: "/reportcard"
    }, {
        name: "Asistencia",
        href: "/attendance"
    }],
    Student: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }, {
        name: "Amonestaciones",
        href: "/reprimand"
    }, {
        name: "Notas de exámenes",
        href: "/exam-mark"
    }, {
        name: "Boletín",
        href: "/reportcard"
    }],
    Teacher: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }, {
        name: "Amonestaciones",
        href: "/reprimand"
    }, {
        name: "Notas de exámenes",
        href: "/exam-mark"
    }, {
        name: "Boletines",
        href: "/reportcard"
    }, {
        name: "Asistencia",
        href: "/attendance"
        }],
    Administrator: [{
        name: "Alumnos",
        href: "/student"
    }, {
        name: "Docentes",
        href: "/teacher"
    }, {
        name: "Responsables",
        href: "/parent"
    }, {
        name: "Administradores",
        href: "/admin"
    }
    ]
}