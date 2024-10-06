import {LockIcon} from "lucide-react"
import {auth} from "@/auth";
import {roleDisplayNames} from "@/lib/roleDisplayNames";
import {redirect} from "next/navigation";

export default async function Error403Page() {
    const role = (await auth())?.user.role
    if(!role) {
        redirect("/selectrole");
    }
    const roleText = roleDisplayNames[role]
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-red-900/20 p-3 animate-pulse">
                            <LockIcon className="h-12 w-12 text-red-500" aria-hidden="true"/>
                        </div>
                    </div>
                    <h1 className="mt-6 text-3xl font-extrabold text-red-500 sm:text-4xl">
                        Acceso Denegado
                    </h1>
                    <div className="mt-4 flex justify-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-200">
                          Perfil: {roleText}
                        </span>
                    </div>
                    <p className="mt-4 text-lg text-gray-300">
                        No tienes permiso para acceder a esta página
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        Si crees que esto es un error, por favor contacta al administrador.
                    </p>
                    <div className="mt-6 space-y-4">
                        <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                            Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}