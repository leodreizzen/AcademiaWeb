
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/Assignment/fileupload";
import { submitAssignment } from "@/app/server-actions/submitAssignment";

export default function ClientAddAssignmentForm() {
  const [errors, setErrors] = useState<Partial<Record<"file" | "title" | "description", string[]>> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const response = await submitAssignment(formData);

    if (response.success) {
      setSuccessMessage("¡El archivo se ha subido correctamente!");
      setErrors(null);
    } else {
      if (response.errors?.fieldErrors) {
        setErrors(response.errors.fieldErrors);
      } else {
        setErrors(null);
      }
      setSuccessMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex space-x-4">
        <div className="w-1/2 flex items-center">
          <label htmlFor="file" className="block text-md font-medium text-gray-700 w-3/3 mr-2">
            Subir archivo...
          </label>
          <FileUpload id="file" name="file" className="w-3/3" required />
          {errors?.file && <p className="text-red-500">{errors.file}</p>}
        </div>
        <div className="w-1/2 flex items-center">
          <label htmlFor="title" className="block text-md font-medium text-gray-700 w-1/3">
            Título
          </label>
          <Input id="title" name="title" type="text" className="w-2/3" required />
          {errors?.title && <p className="text-red-500">{errors.title}</p>}
        </div>
      </div>
      <div className="flex items-center">
        <label htmlFor="description" className="block text-md font-medium text-gray-700 w-1/4">
          Descripción
        </label>
        <TextArea id="description" name="description" className="w-3/4" />
      </div>
      {successMessage && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit" className="w-auto">
          Subir
        </Button>
      </div>
    </form>
  );
}
