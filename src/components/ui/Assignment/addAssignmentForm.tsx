"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { submitAssignment } from "@/app/server-actions/submitAssignment";
import Link from "next/link";

export default function AddAssignmentForm() {
  const [errors, setErrors] = useState<Partial<
    Record<"file" | "title" | "description", string[]>
  > | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) return null;

    console.log("Cloud Name:", process.env.CLOUD_NAME);
    console.log(
      "Upload Preset:",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "my_unsigned_preset"
    );

    setUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/duafjqwy9/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        console.error("Cloudinary Error:", responseData);
        throw new Error(
          `Cloudinary upload failed: ${
            responseData.error?.message || "Unknown error"
          }`
        );
      }
      setUploading(false);
      return responseData.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const fileUrl = await uploadFile();
    if (fileUrl) {
      formData.append("fileUrl", fileUrl);
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
    } else {
      setErrors({ file: ["Error al subir el archivo"] });
      setSuccessMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex space-x-4">
        <div className="w-1/2 flex items-center">
          <label
            htmlFor="file"
            className="block text-md font-medium w-3/3 mr-2"
          >
            Subir archivo...
          </label>
          <Input
            id="file"
            name="file"
            type="file"
            className="w-3/3"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {errors?.file && <p className="text-red-500">{errors.file}</p>}
        </div>
        <div className="w-1/2 flex items-center">
          <label htmlFor="title" className="block text-md font-medium w-1/3">
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
          className="block text-md font-medium w-1/4"
        >
          Descripción
        </label>
        <TextArea id="description" name="description" className="w-3/4" />
      </div>
      {successMessage && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}
      <div className="flex justify-between items-center w-full mt-4">
        <Link href="/assignment">
          <Button className="w-3/3 transition duration-200">Volver</Button>
        </Link>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="transition duration-200"
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      </div>
    </form>
  );
}
