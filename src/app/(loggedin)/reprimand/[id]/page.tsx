import {assertPermission} from "@/lib/access_control"
import {Resource} from "@/lib/operation_list"
import {fetchCurrentUser} from "@/lib/data/users"
import {notFound, redirect} from "next/navigation"
import {format} from "date-fns"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {AlertDescription, AlertTitle} from "@/components/ui/alert"
import {AlertTriangle, CheckCircle, User, Calendar, MessageSquare} from "lucide-react"
import SignButtonWithDialog from "@/components/ui/signatures/SignButtonWithDialog"
import {fetchReprimandById} from "@/app/(loggedin)/reprimand/fetchReprimands"
import {fetchSelectedChild} from "@/lib/data/children"
import {ReprimandWithTeacherAndStudents, ReprimandWithTeacherStudentsAndSignature} from "@/lib/definitions/reprimand";

export default async function ReprimandInfoPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.REPRIMAND, operation: "READ"})

    const user = await fetchCurrentUser()
    const id_num = parseInt(id)
    if (!id_num) {
        redirect("/404")
    }
    if (!user) {
        redirect("/login")
    }
    const reprimand = await fetchReprimandById(id_num)

    if (!reprimand) {
        notFound()
    }

    let reprimandStudent;

    if (user.role === "Parent") {
        const child = await fetchSelectedChild()
        if (!child) {
            redirect("/selectstudent")
        }
        reprimandStudent = reprimand.students.find(student => student.student.dni === child.dni)
        if (!reprimandStudent) {
            redirect("/403")
        }
    } else if (user.role === "Student") {
        reprimandStudent = reprimand.students.find(student => student.student.dni === user.dni)
        if (!reprimandStudent) {
            redirect("/403")
        }
    } else if (user.role === "Teacher") {
        if(reprimand.teacher.id !== user.id){
            redirect("/403")
        }
        return <ReprimandInfoTeacher reprimand={reprimand}/>
    }
    else
        redirect("/403")

    const signature = reprimandStudent.signature
    return (
        <div className="min-h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 pt-0">
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Información de la Amonestación</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={<User className="h-5 w-5"/>} label="Profesor"
                                  value={`${reprimand.teacher.user.firstName} ${reprimand.teacher.user.lastName}`}
                                  testId="teacher"/>
                        <InfoItem icon={<User className="h-5 w-5"/>} label="Alumno/a"
                                  value={`${reprimandStudent.student.user.firstName} ${reprimandStudent.student.user.lastName}`}
                                  testId="student"/>
                        <InfoItem icon={<Calendar className="h-5 w-5"/>} label="Fecha y hora"
                                  value={format(reprimand.dateTime, "dd/MM/yyyy HH:mm")} testId="dateTime"/>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-primary"/>
                            <h3 className="text-lg font-semibold">Motivo:</h3>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg" data-testid="message">
                            <ReprimandMessage message={reprimand.message}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 pt-0 flex flex-col items-start space-y-4">
                    {signature ? (
                        <div className="w-full rounded-lg flex bg-green-100 dark:bg-green-900 p-4 gap-3">
                            <CheckCircle className="h-10 w-10 text-green-500"/>
                            <div className="flex flex-col">
                                <AlertTitle className="text-green-700 dark:text-green-300">Firmado</AlertTitle>
                                <AlertDescription className="text-green-600 dark:text-green-400">
                                    Firmado
                                    por {signature.parent.user.firstName} {signature.parent.user.lastName} el {format(signature.signedAt, "dd/MM/yyyy")} a
                                    las {format(signature.signedAt, "HH:mm")}
                                </AlertDescription>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full rounded-lg flex bg-red-100 dark:bg-red-900 p-4 gap-2">
                                <AlertTriangle className="h-8 w-8 text-white"/>
                                <div className="flex flex-col">
                                    <AlertTitle className="text-red-700 dark:text-white">No firmado</AlertTitle>
                                    <AlertDescription className="text-red-600 dark:text-white">
                                        {user.role === "Parent" ? "Debes firmar esta amonestación" : "Tu responsable debe firmar esta amonestación"}
                                    </AlertDescription>
                                </div>
                            </div>
                            {user.role === "Parent" &&
                                <SignButtonWithDialog type="reprimand" reprimandId={reprimand.id}/>}
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

function InfoItem({icon, label, value, testId}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    testId: string
}) {
    return (
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</p>
                <p className="font-semibold" data-testid={testId}>{value}</p>
            </div>
        </div>
    )
}


function MultiLineInfoItem({icon, label, value, testId}: {
    icon: React.ReactNode;
    label: string;
    value: string[];
    testId: string
}) {
    return (
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</p>
                <div className="font-semibold" data-testid={testId}>
                    {value.map((v, i) => (
                        <p key={i}>{v}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}



function ReprimandMessage({message}: { message: string }) {
    return <div>
        {message.split('\n').map((parrafo, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300">
                {parrafo}
            </p>
        ))}
    </div>
}

function ReprimandInfoTeacher({reprimand}: {reprimand: ReprimandWithTeacherAndStudents}){
    return (
        <div className="min-h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 pt-0">
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Información de la Amonestación</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={<User className="h-5 w-5"/>} label="Profesor"
                                  value={`${reprimand.teacher.user.firstName} ${reprimand.teacher.user.lastName}`}
                                  testId="teacher"/>
                        <MultiLineInfoItem icon={<User className="h-5 w-5"/>} label="Alumnos"
                                  value={reprimand.students.map(rs => `${rs.student.user.firstName} ${rs.student.user.lastName}`)}
                                  testId="students"/>
                        <InfoItem icon={<Calendar className="h-5 w-5"/>} label="Fecha y hora"
                                  value={format(reprimand.dateTime, "dd/MM/yyyy HH:mm")} testId="dateTime"/>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-primary"/>
                            <h3 className="text-lg font-semibold">Motivo:</h3>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg" data-testid="message">
                            <ReprimandMessage message={reprimand.message}/>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}