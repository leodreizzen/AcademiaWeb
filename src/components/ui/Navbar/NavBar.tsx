"use client"

import {useState} from "react"
import Link from "next/link"
import {User2, LogOut, Key, Menu, X, GraduationCap} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {ProfileRole, ProfileWithRoleAndUser} from "@/lib/definitions"
import {roleDisplayNames} from "@/lib/roleDisplayNames"
import {navbarItems} from "@/components/ui/Navbar/navbar_links"
import {logout} from "@/lib/actions/login"
import {roleColors} from "@/components/ui/roleColors"
import {Student} from "@prisma/client";
import {StudentWithUser} from "@/app/(loggedin)/student/data";

export type RoleAndParent = {
    role: Exclude<ProfileRole, "Parent">
} | {
    role: "Parent",
    selectedChild: StudentWithUser,
    hasMultipleChildren: boolean
}
export type NavbarProps = RoleAndParent & {
    firstName: string,
    lastName: string,
}


function childName(student: StudentWithUser) {
    return `${student.user.firstName} ${student.user.lastName}`
}

export default function NavBar(props: NavbarProps) {
    const {firstName, lastName, role} = props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const displayRole = roleDisplayNames[role];
    const [sheetOpen, setSheetOpen] = useState(false);

    async function handleLogout() {
        await logout()
    }

    const navItems = navbarItems[role];

    const NavItems = ({mobile = false}) => (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md font-medium
                      ${mobile ? 'block px-3 py-2 text-base' : 'px-3 py-2 text-sm'}`}
                >
                    {item.name}
                </Link>
            ))}
        </>
    )

    return (
        <nav className="bg-gray-800 min-h-16 flex items-center">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-white text-xl font-bold">
                                AcademiaWeb
                            </Link>
                        </div>
                        <div className="hidden sm:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <NavItems/>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center sm:ml-6">
                            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost"
                                            className="!h-[revert] p-1 py-3 hover:bg-gray-700 text-gray-300 overflow-hidden grid grid-cols-[auto_auto] gap-y-0.5">
                                        <Avatar className="h-8 w-8 mr-2 bg-gray-700 p-1" asChild>
                                            <User2 className={`h-5 w-5 ${roleColors[role]}`}/>
                                        </Avatar>
                                        <div className="text-left flex flex-col gap-y-1">
                                            <span className="block leading-none">{firstName} {lastName}</span>
                                            <span className="text-sm text-gray-400 leading-none">{displayRole}</span>
                                        </div>
                                        {role === "Parent" && (
                                            <span
                                                className="block text-xs text-blue-300 col-start-2 row-start-2 indent-0 text-start">Alumno: {childName(props.selectedChild)}</span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end"
                                                     className="w-56 bg-gray-700 text-gray-100 border-gray-600">
                                    {role == "Parent" && props.hasMultipleChildren && <>
                                        <DropdownMenuItem asChild>
                                            <a href={"/selectstudent"} className="flex">
                                                <GraduationCap className="mr-2 h-4 w-4"/>
                                                <span>Cambiar alumno</span>
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-gray-600"/>
                                    </>
                                    }
                                    <DropdownMenuItem asChild>
                                        <a href={"/changepassword"} className="flex">
                                            <Key className="mr-2 h-4 w-4"/>
                                            <span>Cambiar contraseña</span>
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-600"/>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        <span>Cerrar sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="p-1 hover:bg-gray-700 text-gray-300"
                                        data-testid="abrir-menu">
                                    <Menu className="h-6 w-6"/>
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full bg-gray-800 text-gray-100 p-0 border-gray-700"
                                          data-testid="menu" hideCloseButton>
                                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                                    <Link href="/" className="text-white text-xl font-bold">
                                        AcademiaWeb
                                    </Link>
                                    <Button variant="ghost" className="p-1 hover:bg-gray-700 text-gray-300"
                                            onClick={() => setSheetOpen(false)}>
                                        <X className="h-6 w-6"/>
                                        <span className="sr-only">Cerrar menú</span>
                                    </Button>
                                </div>
                                <div className="px-2 pt-2 pb-3 space-y-1">
                                    <NavItems mobile/>
                                </div>
                                <div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="flex items-center px-5 mb-3">
                                        <div className="flex-shrink-0">
                                            <Avatar className="bg-gray-700" asChild>
                                                <User2 className={`h-10 w-10 p-1 ${roleColors[role]}`}/>
                                            </Avatar>
                                        </div>
                                        <div className="ml-3">
                                            <div
                                                className="text-base font-medium leading-none text-white">{firstName} {lastName}</div>
                                            <div
                                                className="text-sm font-medium leading-none text-gray-400 mt-1">{displayRole}</div>
                                            {role === "Parent" && (
                                                <div
                                                    className="text-sm font-medium leading-none text-blue-300 mt-1">Alumno: {childName(props.selectedChild)}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 space-y-1">
                                        {role === "Parent" && props.hasMultipleChildren &&
                                            <Button variant="ghost" className="w-full justify-start px-3 py-4 text-base"
                                                    asChild>
                                                <a href="/selectstudent">
                                                    <GraduationCap className="mr-2 h-5 w-5"/>
                                                    Cambiar alumno
                                                </a>
                                            </Button>
                                        }
                                        <Button variant="ghost" className="w-full justify-start px-3 py-4 text-base"
                                                asChild>
                                            <a href="/changepassword">
                                                <Key className="mr-2 h-5 w-5"/>
                                                Cambiar contraseña
                                            </a>
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start px-3 py-4 text-base"
                                                onClick={handleLogout}>
                                            <LogOut className="mr-2 h-5 w-5"/>
                                            Cerrar sesión
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

type NavBarProps = {
    profile: ProfileWithRoleAndUser
}