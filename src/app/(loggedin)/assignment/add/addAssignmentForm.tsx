"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { submitAssignment } from "@/app/server-actions/submitAssignment";
import { getGradesAndSubjects } from "@/app/server-actions/fetchGradeSubject";
import Link from "next/link";
import { generateSignature, uploadFileToCloudinary } from "@/lib/cloudinary";

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
  subjects: Subject[];
}

export default function AddAssignmentForm() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<
    Record<"file" | "title" | "description", string[]>
  > | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchGradesAndSubjects() {
      try {
        const data = await getGradesAndSubjects();
        const processedGrades = data.grades.map((grade: any) => ({
          id: Number(grade.id) || Math.floor(Math.random() * 1000000),
          name: grade.name || "Unnamed Grade",
          subjects: (grade.subjects || []).map((subject: any) => ({
            id: Number(subject.id) || Math.floor(Math.random() * 1000000),
            name: subject.name || "Unnamed Subject",
          })),
        }));
        setGrades(processedGrades);
        
      } catch (error) {
        console.error("Error fetching grades and subjects:", error);
      }
    }
    fetchGradesAndSubjects();
  }, []);

  const handleGradeChange = (e: string) => {
    const gradeId = Number(e);
    setSelectedGradeId(gradeId);
    const grade = grades.find((g) => g.id === gradeId);
    if (grade && grade.subjects.length > 0) {
      setSelectedSubjectId(grade.subjects[0].id);
    } else {
      setSelectedSubjectId(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    const { apiKey, signature, timestamp } = await generateSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
    );
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    setUploading(true);
    try {
      const responseData = await uploadFileToCloudinary(formData);
      if (!responseData.secure_url) {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const fileUrl = await uploadFile();
    if (fileUrl && selectedGradeId !== null && selectedSubjectId !== null) {
      formData.append("fileUrl", fileUrl);
      formData.append("subject", selectedSubjectId.toString());
      formData.append("grade", selectedGradeId.toString());
      try {
        const response = await submitAssignment(formData);
        if (response.success) {
          setSuccessMessage("¡El archivo se ha subido correctamente!");
          setErrors(null);
          if (formRef.current) {
            formRef.current.reset();
          }
          setFile(null);
          setSelectedGradeId(grades[0]?.id || null);
          setSelectedSubjectId(grades[0]?.subjects[0]?.id || null);
        } else {
          if (response.errors?.fieldErrors) {
            setErrors(response.errors.fieldErrors);
          } else {
            setErrors({ file: ["Error al subir el archivo"] });
          }
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error("Error submitting assignment:", error);
        setErrors({ file: ["Error al subir el archivo"] });
        setSuccessMessage(null);
      }
    } else {
      setErrors({
        file: ["Error al subir el archivo o seleccionar curso/materia"],
      });
      setSuccessMessage(null);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      <div className="w-full flex flex-col space-y-4">
        {/* File Upload */}
        <div className="flex items-center">
          <label
            htmlFor="file"
            className="block text-md font-medium text-white w-1/3 mr-4"
          >
            Subir archivo
          </label>
          <Input
            id="file"
            name="file"
            type="file"
            className="w-2/3 bg-gray-700 text-white border-gray-600 rounded-md"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        {errors?.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file}</p>
        )}

        {/* Title */}
        <div className="flex items-center">
          <label
            htmlFor="title"
            className="block text-md font-medium text-white w-1/3 mr-4"
          >
            Título
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            className="w-2/3 bg-gray-700 text-white border-gray-600 rounded-md"
            required
          />
        </div>
        {errors?.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Grade Selector */}
      <div className="flex items-center space-x-4">
        <label
          htmlFor="grade"
          className="block text-md font-medium text-white w-1/4"
        >
          Curso
        </label>
        <Select
          name="grade"
          value={selectedGradeId?.toString() || ""}
          onValueChange={handleGradeChange}
        >
          <SelectTrigger className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
            <SelectValue placeholder="Selecciona un curso" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem
                key={grade.id}
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                value={grade.id.toString()}
              >
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Selector */}
      <div className="flex items-center space-x-4">
        <label
          htmlFor="subject"
          className="block text-md font-medium text-white w-1/4"
        >
          Materia
        </label>
        <Select
          name="subject"
          value={selectedSubjectId?.toString() || ""}
          onValueChange={(e) => setSelectedSubjectId(Number(e))}
        >
          <SelectTrigger className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
            <SelectValue placeholder="Selecciona una materia" />
          </SelectTrigger>
          <SelectContent>
            {grades
              .find((grade) => grade.id === selectedGradeId)
              ?.subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="flex items-center space-x-4">
        <label
          htmlFor="description"
          className="block text-md font-medium text-white w-1/4"
        >
          Descripción
        </label>
        <TextArea
          id="description"
          name="description"
          className="w-3/4 bg-gray-700 text-white border-gray-600 rounded-md"
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center w-full mt-6">
        <Link href="/assignment">
          <Button className="bg-gray-600 text-white hover:bg-gray-500 transition duration-200">
            Volver
          </Button>
        </Link>
        <Button
          type="submit"
          className="bg-green-600 text-white hover:bg-green-500 transition duration-200"
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Subir"}
        </Button>
      </div>
    </form>
  );
}
