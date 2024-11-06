import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchReportCardByStudentIDAndYear} from "@/lib/actions/fetchReportCardByStudentIDAndYear";
import ReportCardInfo from "@/components/ui/Reportcard/ReportcardInfo";
import {fetchCurrentUser} from "@/lib/data/users";
import {redirect} from "next/navigation";
import {fetchSelectedChild} from "@/lib/data/children";

export default async function ReportCardInfoPage() {
    await assertPermission({resource: Resource.REPORT_CARD, operation: "READ"});
    const year = new Date().getFullYear();
    let idStudent : number;

    const user = await fetchCurrentUser();
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
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
                <div className="w-full
                max-w-2xl bg-gray-800 text-gray-100">
                    <h1 className="text-2xl font-bold text-center">Boletín no encontrado</h1>
                    <p className="text-center">No se encontró un boletín para el ID seleccionado.</p>
                </div>
            </div>
        );
    }


    return (
        <ReportCardInfo reportCard={result}/>
    );
}