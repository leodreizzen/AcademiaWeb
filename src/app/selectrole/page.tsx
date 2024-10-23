import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {User2, LogOut} from "lucide-react"
import {ProfileRole} from "@/lib/definitions";
import {roleDisplayNames} from "@/lib/roleDisplayNames";
import {logout, selectRole} from "@/lib/actions/login";
import {auth} from "@/auth";
import {fetchUserProfiles} from "@/lib/data/users";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import { AlertTriangle } from "lucide-react"
import {roleColors} from "@/components/ui/roleColors";
import LoginErrorPage from "@/components/ui/login/LoginErrorPage";

export default async function RoleSelectPage({searchParams: {callbackUrl}}: {searchParams: {callbackUrl?: string}} ) {
    const dni = (await auth())?.user.dni;
    if (!dni) {
        console.error("Could not get user dni")
        return <ErrorPage />
    }

    if((await auth())?.user.role) {
        if(callbackUrl && new URL(callbackUrl).host === headers().get("host"))
            redirect(callbackUrl)
        else
            redirect("/")
    }

    const roles: ProfileRole[] = await fetchUserProfiles(dni).then(profiles => profiles.map(profile => profile.role))

    if(roles.length === 0) {
        console.error("User has no roles")
        return <LoginErrorPage title="Se ha producido un error" message="El usuario no tiene roles asignados. Por favor contacta a un administrador."/>
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
            <Card className="w-full max-w-sm p-6 space-y-4 bg-gray-800 transition-colors duration-200">
                <h1 className="text-2xl font-bold text-white text-center">Selecciona un rol</h1>
                <div className="space-y-3">
                    {roles.map((role) => (
                        <form action={selectRole.bind(null, role, callbackUrl)} key={role}>
                            <Button
                                type="submit"
                                variant="outline"
                                className="dark w-full h-16 justify-start px-4 text-white hover:bg-slate-900 hover:border-white transition-colors duration-200"
                            >
                                <User2 className={`mr-4 h-6 w-6 ${roleColors[role] || ""}`}/>
                                <span className="text-lg">{roleDisplayNames[role]}</span>
                            </Button>
                        </form>
                    ))}
                </div>
                <form action={logout}>
                    <Button variant="destructive" className="w-full mt-2" type="submit">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Cerrar sesión
                    </Button>
                </form>
            </Card>
        </div>
    )
}




function ErrorPage() {

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <AlertTriangle className="h-24 w-24 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Se ha producido un error</h1>
                <p className="text-gray-600">Prueba cerrar sesión y volver a iniciarla. Si el problema persiste, contacta a un administrador</p>
                <form action={logout}>
                <Button
                    className="w-full"
                    variant="destructive"
                >
                    Cerrar sesión
                </Button>
                </form>
            </div>
        </div>
    )
}
