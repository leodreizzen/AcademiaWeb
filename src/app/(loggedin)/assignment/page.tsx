import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import assignmentList from "@/components/ui/Assignment/assignmentList";

export default async function AssignmentPage() {
    await assertPermission( {resource: Resource.ASSIGNMENT, operation: "LIST"});

    return (
        <div className=" w-full flex flex-col items-center justify-center min-h-screen relative">
            <div className=" absolute">
                <h3 className="text-left text-2xl font-extrabold text-gray-900 mb-2">
                    Listado de Trabajos Prácticos
                </h3>
                {await assignmentList()}
            </div>
        </div>
    );
}