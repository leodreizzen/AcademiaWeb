"use client";

import { useEffect, useState } from "react";
import DownloadAssignment from "./downloadAssingment";
import { getAssignments } from "@/app/server-actions/getAssignments";
import { deleteAssignment } from "@/app/server-actions/deleteAssignment";
import { AssignmentListProps } from "@/types/assignment";

export default function TPListPage({ initialAssignments }: AssignmentListProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const response = await getAssignments();
      setAssignments(response.initialAssignments);
      setLoading(false);
    };

    fetchAssignments();
  }, []);

  const handleDelete = async (assignmentId: string) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar esta asignación?");
    if (confirmed) {
      try {
        await deleteAssignment(assignmentId); // Llama a tu función para eliminar la asignación
        setAssignments(assignments.filter(assignment => assignment.id.toString() !== assignmentId)); // Actualiza el estado
      } catch (error) {
        console.error("Error al eliminar la asignación:", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col relative ">
      <div className="mt-4 w-full max-w-lg border border-gray-300 p-4 rounded-md shadow-md bg-white">
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : assignments.length > 0 ? (
          <ul className="space-y-2">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex justify-between p-3 border-b border-gray-300"
              >
                <div>
                  <p className="text-lg font-semibold">{assignment.title}</p>
                  {assignment.description && (
                    <p className="text-sm ">{assignment.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <DownloadAssignment fileId={assignment.id.toString()} />
                  <button
                    onClick={() => handleDelete(assignment.id.toString())}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No hay trabajos prácticos subidos aún.</p>
        )}
      </div>
    </div>
  );
}
