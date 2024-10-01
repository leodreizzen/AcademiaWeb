"use client";

import { useEffect, useState } from "react";
import DownloadAssignment from "./downloadAssingment";
import { getAssignments } from "@/app/server-actions/getAssignments";
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
                <DownloadAssignment fileId={assignment.id.toString()} />
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
