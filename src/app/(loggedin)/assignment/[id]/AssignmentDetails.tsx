"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import fileDownload from "js-file-download";

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

export default function AssignmentDetailsPage({
  assignment: assignment,
}: AssignmentDetailsClientProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleViewFile = async () => {
    if (assignment.fileUrl) {
      setLoading(true);
      try {
        const response = await fetch(assignment.fileUrl, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");
        const downloadFile = async (
          fileUrl: string,
          title: string,
          extension: string
        ) => {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error("Error al descargar el archivo");
          }

          const blob = await response.blob();
          fileDownload(blob, `${title}.${extension}`);
        };
        if (contentType === "application/pdf") {
          // Si es un PDF, lo mostramos en el iframe
          setFileUrl(assignment.fileUrl);
        } else if (
          contentType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // Si es un Docx, lo descargamos
          await downloadFile(assignment.fileUrl, assignment.title, "docx");
        } else if (
          contentType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          // Si es un Xlsx, lo descargamos
          await downloadFile(assignment.fileUrl, assignment.title, "xlsx");
        } else if (
          contentType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          // Si es un Ppsx, lo descargamos
          await downloadFile(assignment.fileUrl, assignment.title, "ppsx");
        } else {
          console.error("Tipo de archivo no soportado:", contentType);
        }
      } catch (error) {
        console.error("Error al obtener el tipo de archivo:", error);
      }
      setLoading(false);
    } else {
      console.error("File URL not found");
    }
  };

  const handleCloseIframe = () => {
    setFileUrl(null);
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
        <div className="flex justify-between space-x-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleViewFile}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-700"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ver archivo"}
          </button>
        </div>
      </div>

      {fileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl h-full">
            <button
              onClick={handleCloseIframe}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-500"
              aria-label="Cerrar"
            >
              X
            </button>
            <iframe
              src={fileUrl}
              width="100%"
              height="100%"
              className="border rounded-lg"
              title="Archivo de Trabajo Práctico"
            />
          </div>
        </div>
      )}
    </div>
  );
}
