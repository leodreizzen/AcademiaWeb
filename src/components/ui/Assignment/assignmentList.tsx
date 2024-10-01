import { getAssignments } from "@/app/server-actions/getAssignments";
import DownloadAssignment from "./downloadAssingment";

export default async function TPListPage() {
    const assignments = await getAssignments();
  
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen relative">
        <div className="mt-10 w-full max-w-lg border border-gray-300 p-4 rounded-md ">
          <h3 className="text-left text-2xl font-extrabold text-gray-900 mb-2">
            Listado de Trabajos Prácticos
          </h3>
          {assignments.length > 0 ? (
            <ul className="space-y-4">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <div>
                    <p className="text-lg font-semibold">{assignment.title}</p>
                    {assignment.description && (
                      <p className="text-sm text-gray-500">{assignment.description}</p>
                    )}
                  </div>
                  <DownloadAssignment fileId={assignment.id.toString()} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay trabajos prácticos subidos aún.</p>
          )}
        </div>
      </div>
    );
  }