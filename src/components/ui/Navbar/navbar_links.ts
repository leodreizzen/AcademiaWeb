import {ProfileRole} from "@/lib/definitions";

type NavbarItem = {
    name: string
    href: string
}
export const navbarItems: Record<ProfileRole, NavbarItem[]> = {
    Parent: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }],
    Student: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }],
    Teacher: [{
        name: "Trabajos prácticos",
        href: "/assignment"
    }],
    Administrator: [{
        name: "Alumnos",
        href: "/student"
    }, {
        name: "Docentes",
        href: "/teacher"
    }, {
        name: "Padres",
        href: "/parent"
    }, {
        name: "Administradores",
        href: "/admin"
    }
    ]
}