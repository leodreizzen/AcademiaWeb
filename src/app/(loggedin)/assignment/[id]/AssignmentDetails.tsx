"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Definir la interfaz para los props
interface Subject {
  id: number;
  name: string;
}

interface Grade {
  name: string;
}

interface AssignmentType {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  grade: Grade;
  subject: Subject;
}

interface AssignmentDetailsClientProps {
  assignment: AssignmentType;
}

export default function AssignmentDetailsClient({
  assignment,
}: AssignmentDetailsClientProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleViewFile = () => {
    if (assignment.fileUrl) {
      setLoading(true);
      router.push(assignment.fileUrl); // Redirige al archivo de Cloudinary
    } else {
      console.error("File URL not found");
    }
  };

  return (
    <div className="min-h-full bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {assignment.title}
          </h1>
          <p className="text-lg text-gray-400 mb-4">{assignment.description}</p>
        </div>
        <div className="mb-6">
          <p className="text-lg text-white">
            <strong>Grado:</strong>{" "}
            <span className="text-gray-300">
              {assignment.grade?.name || "Sin Grado"}
            </span>
          </p>
          <p className="text-lg text-white mt-2">
            <strong>Materia:</strong>{" "}
            <span className="text-gray-300">
              {assignment.subject?.name || "Sin Materia"}
            </span>
          </p>
        </div>
        <button
          onClick={handleViewFile}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-700"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ver archivo"}
        </button>
      </div>
    </div>
  );
}
