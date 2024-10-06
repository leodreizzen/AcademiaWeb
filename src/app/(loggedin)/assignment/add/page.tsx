import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import AddAssignmentForm from "@/components/ui/Assignment/addAssignmentForm";

export default async function AddAssignmentPage() {
  await assertPermission({
    resource: Resource.ASSIGNMENT,
    operation: "CREATE",
  });

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Agregar Trabajo Práctico
        </h1>
        <AddAssignmentForm />
      </div>
    </div>
  );
}
