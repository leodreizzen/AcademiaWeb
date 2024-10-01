import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import ClientAddAssignmentForm from "@/components/ui/Assignment/addAssignmentForm";

export default async function AddAssignmentPage() {
    await assertPermission({ resource: Resource.ASSIGNMENT, operation: "CREATE" });

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen relative">
            <div className="mt-10 w-full max-w-lg border border-gray-300 p-4 rounded-md">
                <ClientAddAssignmentForm />
            </div>
        </div>
    );
}
