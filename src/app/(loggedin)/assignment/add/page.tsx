import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import AddAssignmentForm from "@/components/ui/Assignment/addAssignmentForm";

export default async function AddAssignmentPage() {
  await assertPermission({
    resource: Resource.ASSIGNMENT,
    operation: "CREATE",
  });

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="mt-10 w-full max-w-lg border border-gray-300 p-4 rounded-md">
        <h1 className="text-2xl font-bold text-left mb-2">Agregar TP</h1>
        <AddAssignmentForm />
      </div>
    </div>
  );
}
