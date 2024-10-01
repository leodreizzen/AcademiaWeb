"use client"

import {useState} from "react"
import Link from "next/link"
import {User2, LogOut, Key, Menu, X} from "lucide-react"
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
import {ProfileRole, ProfileWithRoleAndUser} from "@/lib/definitions";
import {roleDisplayNames} from "@/lib/roleDisplayNames";
import {navbarItems} from "@/components/ui/Navbar/navbar_links";
import {logout} from "@/lib/actions/login";
import {roleColors} from "@/components/ui/roleColors";

export default function NavBar({firstName, lastName, role}: {
    firstName: string,
    lastName: string,
    role: ProfileRole
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const displayRole = roleDisplayNames[role];
    const [sheetOpen, setSheetOpen] = useState(false);


    async function handleLogout() {
        await logout();
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
        <nav className="bg-gray-800">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
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
                    <div className="hidden sm:block">
                        <div className="ml-4 flex items-center sm:ml-6">
                            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-1 hover:bg-gray-700 text-gray-300 flex-wrap overflow-hidden">
                                            <Avatar className="h-8 w-8 mr-2 bg-gray-700 p-1" asChild>
                                                    <User2 className={`h-5 w-5 ${roleColors[role]}`}/>
                                            </Avatar>
                                            <span className="hidden sm:inline md:mr-1">{firstName}</span>
                                            <span className="hidden sm:inline">{lastName}</span>

                                            <span className="hidden sm:inline ml-2 text-sm text-gray-400">{displayRole}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end"
                                                     className="w-56 bg-gray-700 text-gray-100 border-gray-600">
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
                    <div className="sm:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} >
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="p-1 hover:bg-gray-700 text-gray-300" data-testid="abrir-menu">
                                    <Menu className="h-6 w-6"/>
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full bg-gray-800 text-gray-100 p-0 border-gray-700" data-testid = "menu"
                                          hideCloseButton>
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
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 space-y-1">
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
