import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchReportCardByStudentIDAndYear} from "@/lib/actions/fetchReportCardByStudentIDAndYear";
import ReportCardInfo from "@/components/ui/Reportcard/ReportcardInfo";
import {fetchCurrentUser} from "@/lib/data/users";
import {redirect} from "next/navigation";
import {fetchSelectedChild} from "@/lib/data/children";
import {CardHeader, CardTitle} from "@/components/ui/card";
import {Card, CardContent} from "@/components/ui/card";

export default async function ReportCardInfoPage() {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "READ"});
    const year = new Date().getFullYear();
    let idStudent : number;

    const user = await fetchCurrentUser();
    if (!user) {
        return (
            <div className="min-h-full bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <div className="w-full
                max-w-2xl bg-gray-800 text-gray-100">
                    <h1 className="text-2xl font-bold text-center">Usuario no encontrado</h1>
                    <p className="text-center">El usuario no existe.</p>
                </div>
            </div>
        )
    }

    if(user.role === 'Student'){
        idStudent = user.id;
    }
    else if(user.role === 'Parent') {
        const child = await fetchSelectedChild();
        if (!child) {
            return (
                <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                    <div className="w-full
                    max-w-2xl bg-gray-800 text-gray-100">
                        <h1 className="text-2xl font-bold text-center">Estudiante no encontrado</h1>
                        <p className="text-center">El estudiante no existe.</p>
                    </div>
                </div>
            )
        }
        else{
            idStudent = child.id;
        }
    }
    else {
        redirect("/403");
    }
    const result = await fetchReportCardByStudentIDAndYear(idStudent, year);

    if (!result) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card
                    className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl border border-gray-700">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Boletín no disponible</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center text-gray-200">
                            <p>Los datos de este boletín aún no están disponibles.</p>
                            <p>Por favor, vuelva a intentarlo más tarde.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        );
    }


    return (
        <ReportCardInfo reportCard={result}/>
    );
}