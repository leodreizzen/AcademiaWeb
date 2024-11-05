import { assertPermission } from "@/lib/access_control"
import { Resource } from "@/lib/operation_list"
import { fetchCurrentUser } from "@/lib/data/users"
import { fetchStudentMarkByExamId } from "@/lib/actions/fetch-student-mark-by-exam-id"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDescription, AlertTitle } from "@/components/ui/alert"
import {AlertTriangle, CheckCircle, User, Calendar, BookOpen, PenTool, CheckSquare} from "lucide-react"
import SignButtonWithDialog from "@/components/ui/signatures/SignButtonWithDialog"

export default async function ExamMarkByExamIDPage({ params: { id } }: { params: { id: string } }) {
    await assertPermission({ resource: Resource.EXAM_MARK, operation: "READ" })

    const user = await fetchCurrentUser()

    if (!user) {
        redirect("/login")
    }
    const examMark = await fetchStudentMarkByExamId(id)

    if (!examMark) {
        notFound()
    }

    if (user.role === "Parent") {
        if (!examMark.student.parents.find(parent => parent.id === user.id)) {
            redirect("/403")
        }
    } else if (user.role === "Student") {
        if (examMark.student.id !== user.id) {
            redirect("/403")
        }
    } else
        redirect("/403")

    const signature = examMark.signature

    return (
        <div className="min-h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 pt-0">
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Información del Examen</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem
                            icon={<BookOpen className="h-5 w-5" />}
                            label="Materia"
                            value={examMark.exam.subject.name}
                            testId="subject"
                        />
                        <InfoItem
                            icon={<User className="h-5 w-5" />}
                            label="Alumno/a"
                            value={`${examMark.student.user.firstName} ${examMark.student.user.lastName}`}
                            testId="student"
                        />
                        <InfoItem
                            icon={<Calendar className="h-5 w-5" />}
                            label="Fecha"
                            value={format(examMark.exam.date, "dd/MM/yyyy")}
                            testId="date"
                        />
                        <InfoItem
                            icon={<CheckSquare className="h-5 w-5" />}
                            label="Nota"
                            value={examMark.mark.toString()}
                            testId="mark"
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 pt-0 flex flex-col items-start space-y-4">
                    {signature ? (
                        <div className="w-full rounded-lg flex bg-green-100 dark:bg-green-900 p-4 gap-3">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                            <div className="flex flex-col">
                                <AlertTitle className="text-green-700 dark:text-green-300">Firmado</AlertTitle>
                                <AlertDescription className="text-green-600 dark:text-green-400">
                                    Firmado por {signature.parent.user.firstName} {signature.parent.user.lastName} el{" "}
                                    {format(signature.signedAt, "dd/MM/yyyy")} a las {format(signature.signedAt, "HH:mm")}
                                </AlertDescription>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full rounded-lg flex bg-red-100 dark:bg-red-900 p-4 gap-2">
                                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-white" />
                                <div className="flex flex-col">
                                    <AlertTitle className="text-red-700 dark:text-white">No firmado</AlertTitle>
                                    <AlertDescription className="text-red-600 dark:text-white">
                                        {user.role === "Parent" ? "Debes firmar esta nota" : "Tu responsable debe firmar esta nota"}
                                    </AlertDescription>
                                </div>
                            </div>
                            {user.role === "Parent" && <SignButtonWithDialog type="examMark" examMarkId={examMark.id} />}
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

function InfoItem({ icon, label, value, testId }: {
    icon: React.ReactNode
    label: string
    value: string
    testId: string
}) {
    return (
        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{label}:</p>
                <p className="font-semibold" data-testid={testId}>{value}</p>
            </div>
        </div>
    )
}