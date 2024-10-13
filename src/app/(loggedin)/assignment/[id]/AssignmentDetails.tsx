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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
      <p className="text-lg mb-4">{assignment.description}</p>
      <div className="mb-4">
        <p>
          <strong>Grado:</strong> {assignment.grade?.name || "Sin Grado"}
        </p>
        <p>
          <strong>Materia:</strong> {assignment.subject?.name || "Sin Materia"}
        </p>
      </div>
      <button
        onClick={handleViewFile}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Ver archivo"}
      </button>
    </div>
  );
}
