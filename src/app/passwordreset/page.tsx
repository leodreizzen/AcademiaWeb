import {redirect} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {XCircle} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {checkPasswordResetToken} from "@/lib/data/passwordReset";
import PasswordResetForm from "@/components/ui/password_reset/PasswordResetForm";

export default async function PasswordResetPage({searchParams: {token}}: { searchParams: { token: string } }) {
    if (!token) {
        redirect("/forgotpassword")
    }

    const validToken = await checkPasswordResetToken(token)
    if (!validToken) {
        return <InvalidResetLink/>
    } else
        return <PasswordResetForm token={token}/>


}

function InvalidResetLink() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader className="space-y-1 pb-4">
                    <XCircle className="mx-auto my-2 h-16 w-16 text-red-500" />
                    <CardTitle className="text-2xl text-center text-white">Enlace Inválido</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                    <CardDescription className="text-gray-400">
                        El enlace de restablecimiento es inválido o ha expirado
                    </CardDescription>
                    <p className="text-sm text-gray-400">
                        Por favor, vuelve a intentar el proceso
                    </p>
                    <Link href="/forgotpassword" className="mt-4 block">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Intentar de nuevo</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
