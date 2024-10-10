import {Card} from "@/components/ui/card";
import {AlertTriangle} from "lucide-react";
import {logout} from "@/lib/actions/login";
import {Button} from "@/components/ui/button";

export default function LoginErrorPage({title, message}: {title: string, message: string}) {

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <Card className="rounded-lg shadow-xl p-6 max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <AlertTriangle className="h-24 w-24 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p>{message}</p>
                <form action={logout}>
                    <Button
                        className="w-full"
                        variant="destructive"
                    >
                        Cerrar sesión
                    </Button>
                </form>
            </Card>
        </div>
    )
}
