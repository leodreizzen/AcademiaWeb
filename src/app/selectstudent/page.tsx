import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {LogOut, GraduationCap} from "lucide-react"
import {fetchCurrentUserChildren} from "@/lib/data/children";

import {roleColors} from "@/components/ui/roleColors";
import LoginErrorPage from "@/components/ui/login/LoginErrorPage";
import {logout} from "@/lib/actions/login";
import {selectChild} from "@/lib/actions/select_child";

const studentColor = roleColors["Student"];

export default async function SelectStudentPage({searchParams: {callbackUrl}}: {searchParams: {callbackUrl?: string}}) {
    const students = await fetchCurrentUserChildren();
    if (students.length === 0) {
        return <LoginErrorPage title="No tienes alumnos asignados" message="Por favor, contacta con el administrador"/>
    }
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 ">
            <Card className="w-full max-w-sm p-6 space-y-4 bg-gray-800">
                <h1 className="text-2xl font-bold text-white text-center">Selecciona un alumno</h1>
                <div className="space-y-3">
                    {students.map((student) => (
                        <form action={selectChild.bind(null, student.id, callbackUrl)} key={student.id}>
                            <Button
                                variant="outline"
                                className="w-full h-16 justify-start px-4 text-white hover:bg-gray-700 hover:text-white transition-colors duration-200"
                            >
                                <GraduationCap className={`mr-4 h-6 w-6 ${studentColor}`}/>
                                <span className="text-lg">{student.firstName} {student.lastName}</span>
                            </Button>
                        </form>
                    ))}
                </div>
                <form action={logout}>
                    <Button
                        variant="destructive"
                        className="w-full mt-2"
                    >
                        <LogOut className="mr-2 h-4 w-4"/>
                        Cerrar sesión
                    </Button>
                </form>
            </Card>
        </div>
    )
}

