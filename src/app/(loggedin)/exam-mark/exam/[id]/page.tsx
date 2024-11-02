import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchStudentMarkByExamId} from "@/lib/actions/fetch-student-mark-by-exam-id";
import {redirect} from "next/navigation";
import {format} from "date-fns"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {AlertDescription, AlertTitle} from "@/components/ui/alert"
import {AlertTriangle, CheckCircle} from "lucide-react"
import SignButtonWithDialog from "@/components/ui/signatures/SignButtonWithDialog";

export default async function ExamMarkByExamIDPage({params: {id}}: { params: { id: string } }) {
    await assertPermission({resource: Resource.EXAM_MARK, operation: "LIST"});

    const user = await fetchCurrentUser();

    if (!user) {
        redirect("/403")
    }
    const examMark = await fetchStudentMarkByExamId(id);

    if (!examMark) {
        redirect("/403")
    }

    if(user.role === "Parent"){
        if (!examMark.student.parents.find(parent => parent.id === user.id)) {
            redirect("/403")
        }
    }else if (user.role === "Student"){
        if (examMark.student.id !== user.id) {
            redirect("/403")
        }
    } else
        redirect("/403")


    const signature = examMark.signature;

    return (
        <div className="min-h-screen text-foreground  flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Información del examen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Materia:</p>
                            <p className="font-semibold" data-testid="subject">{examMark.exam.subject.name}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Alumno/a:</p>
                            <p className="font-semibold"
                               data-testid="student">{examMark.student.user.firstName} {examMark.student.user.lastName}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Fecha:</p>
                            <p className="font-semibold"
                               data-testid="date">{format(examMark.exam.date, "dd/MM/yyyy")}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Nota:</p>
                            <p className="font-semibold" data-testid="mark">{examMark.mark}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-4">
                    {signature ? (
                        <div className="w-full rounded-lg flex bg-gray-700 p-4 gap-3">
                            <CheckCircle className="h-10 w-01"/>
                            <div className="flex flex-col">
                                <AlertTitle>Firmado</AlertTitle>
                                <AlertDescription>
                                    Firmado
                                    por {signature.parent.user.firstName} {signature.parent.user.lastName} el {format(signature.signedAt, "dd/MM/yyyy")} a
                                    las {format(signature.signedAt, "HH:mm")}
                                </AlertDescription>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full rounded-lg flex bg-red-600 p-4 gap-2">
                                <AlertTriangle className="h-8 w-8" color="white"/>
                                <div className="flex flex-col">
                                    <AlertTitle>No firmado</AlertTitle>
                                    <AlertDescription>
                                        {user.role === "Parent" ? "Debes firmar esta nota": "Tu responsable debe firmar esta nota"}
                                    </AlertDescription>
                                </div>
                            </div>
                            {user.role === "Parent" && <SignButtonWithDialog type="examMark" examMarkId={examMark.id}/>}
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}