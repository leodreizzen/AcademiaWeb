"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Assignment } from "@prisma/client";
import { updateAssignment } from "@/app/(loggedin)/assignment/add/fetchAssignments";
import { getGradesAndSubjects } from "@/app/server-actions/fetchGradeSubject";
import {GradeWithSubjects} from "@/lib/definitions/grade";
import {AssignmentWithSubject} from "@/lib/definitions/assignment";

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  name: string;
  subjects: Subject[];
}

interface FormErrors {
  title?: string;
  gradeName?: string;
  subjectId?: string;
  description?: string;
}

export default function EditAssignmentForm({
  assignment, grades
}: {
  assignment: AssignmentWithSubject;
  grades: GradeWithSubjects[]
}) {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description || "");
  const [selectedGrade, setSelectedGrade] = useState<GradeWithSubjects | null>(grades.find(grade => grade.name == assignment.subject.gradeName) ?? null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(assignment.subject);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleGradeChange = (gradeName: string) => {
    setSelectedGrade(grades.find(grade => grade.name == gradeName) ?? null);
    setSelectedSubject(null);
    setFormErrors((prev) => ({ ...prev, gradeName: undefined, subjectId: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!title.trim()) errors.title = "El título es requerido";
    if (!selectedGrade) errors.gradeName = "Debes seleccionar un curso";
    if (!selectedSubject) errors.subjectId = "Debes seleccionar una materia";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (assignment && selectedGrade && selectedSubject) {
      try {
        await updateAssignment(assignment.id, {
          title: title,
          description: description,
          subjectId: selectedSubject.id,
        });
        router.push("/assignment");
      } catch (error) {
        console.error("Error editando trabajo práctico:", error);
        setError("Error updating assignment");
      }
    }
    setIsLoading(false);
  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title" className="block text-md font-medium text-white">
            Título
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFormErrors((prev) => ({ ...prev, title: undefined }));
            }}
            className={`bg-gray-700 text-white border-gray-600 rounded-md w-full ${
              formErrors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="grade" className="block text-md font-medium text-white">
            Curso
          </label>
          <Select
            name="grade"
            value={selectedGrade?.name || ""}
            onValueChange={handleGradeChange}
          >
            <SelectTrigger className={`bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500 ${
              formErrors.gradeName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}>
              <SelectValue placeholder="Selecciona un curso" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700">
              {grades.map((grade) => (
                <SelectItem
                  key={grade.name}
                  className="bg-gray-700 text-gray-100 focus:border-gray-500"
                  value={grade.name}
                >
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.gradeName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.gradeName}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="subject" className="block text-md font-medium text-white">
            Materia
          </label>
          <Select
            name="subject"
            value={selectedSubject?.id.toString() || ""}
            onValueChange={(e) => {
              setSelectedSubject(selectedGrade?.subjects.find((subject) => subject.id === Number(e)) ?? null);
              setFormErrors((prev) => ({ ...prev, subjectId: undefined }));
            }}
          >
            <SelectTrigger className={`bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500 ${
              formErrors.subjectId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}>
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700">
              {selectedGrade
                ?.subjects.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id.toString()}
                    className="bg-gray-700 text-gray-100 focus:border-gray-500"
                  >
                    {subject.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formErrors.subjectId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.subjectId}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="description" className="block text-md font-medium text-white w-full">
            Descripción
          </label>
          <TextArea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md"
          />
        </div>

        {error && (
          <div className="mb-4 p-2 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full mt-6">
        <Link href="/assignment">
          <Button className="bg-gray-600 text-white hover:bg-gray-500 transition duration-200">
            Volver
          </Button>
        </Link>
        <Button
          type="submit"
          className="bg-green-600 text-white hover:bg-green-500 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>
    </form>
  );
}