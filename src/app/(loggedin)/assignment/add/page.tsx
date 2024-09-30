"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/fileupload";
import { submitAssignment } from "@/app/server-actions/submit-assignment";

export default function AddAssignmentPage() {
  const [errors, setErrors] = useState<
    Partial<Record<"file" | "title" | "description", string[]>> | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const response = await submitAssignment(formData);

    if (response.success) {
      // Mostrar mensaje de éxito
      setSuccessMessage("¡El archivo se ha subido correctamente!");
      setErrors(null); // Limpiar errores si es necesario
    } else {
      // Manejar los errores de validación
      if (response.errors?.fieldErrors) {
        setErrors(response.errors.fieldErrors);
      } else {
        setErrors(null); // O manejar un error genérico si lo prefieres
      }
      setSuccessMessage(null); // Limpiar el mensaje de éxito en caso de error
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen relative">
      <div className="mt-10 w-full max-w-lg border border-gray-300 p-4 rounded-md">
        <div>
          <h3 className="text-left text-2xl font-extrabold text-gray-900 mb-2">
            Subir TP
          </h3>
        </div>
        {successMessage && (
          <div className="mb-4 p-2 text-green-700 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="flex space-x-4">
            <div className="w-1/2 flex items-center">
              <label
                htmlFor="file"
                className="block text-md font-medium text-gray-700 w-3/3 mr-2"
              >
                Subir archivo...
              </label>
              <FileUpload id="file" name="file" className="w-3/3" required />
              {errors?.file && <p className="text-red-500">{errors.file}</p>}
            </div>
            <div className="w-1/2 flex items-center">
              <label
                htmlFor="title"
                className="block text-md font-medium text-gray-700 w-1/3"
              >
                Título
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                className="w-2/3"
                required
              />
              {errors?.title && <p className="text-red-500">{errors.title}</p>}
            </div>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="description"
              className="block text-md font-medium text-gray-700 w-1/4"
            >
              Descripción
            </label>
            <TextArea id="description" name="description" className="w-3/4" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-auto">
              Subir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
