import {Button} from "@/components/ui/button"
import Link from "next/link"
import {homeButtonsByRole} from "@/components/ui/home/home_buttons";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import clsx from "clsx";

export default async function HomePage() {
    const role = (await auth())?.user.role
    if (!role) {
        redirect("/selectrole")
    }

    const options = homeButtonsByRole[role]

    return (
        <div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
                    Bienvenido a AcademiaWeb
                </h1>
                <div className={clsx("gap-x-10 gap-y-6 mx-10",{
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3": options.length >= 3,
                    "flex justify-center flex-wrap": options.length < 3
                })}>
                    {options.map((option) => (
                        <Link key={option.name} href={option.href} className={clsx( {
                            "w-full sm:w-1/2 md:w-1/3": options.length < 3,
                            "w-full": options.length >= 3
                        })}>
                            <Button
                                variant="outline"
                                className="group w-full h-24 text-lg flex flex-col items-center justify-center space-y-2 bg-gray-800 hover:bg-gray-700 border-gray-700 text-white hover:text-gray-300"
                            >
                                <option.Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-600"/>
                                <span>{option.name}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}