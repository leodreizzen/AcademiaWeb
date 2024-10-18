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

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  name: string;
  subjects: Subject[];
}

export default function EditAssignmentForm({
  assignment,
}: {
  assignment?: Assignment;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGradeName, setSelectedGradeName] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchGradesAndSubjects() {
      try {
        const data = await getGradesAndSubjects();
        const processedGrades = data.grades.map((grade: any) => ({
          name: grade.name || "Unnamed Grade",
          subjects: (grade.subjects || []).map((subject: any) => ({
            id: Number(subject.id) || Math.floor(Math.random() * 1000000),
            name: subject.name || "Unnamed Subject",
          })),
        }));
        setGrades(processedGrades);
      } catch (error) {
        console.error("Error fetching grades and subjects:", error);
        setError("Error fetching grades and subjects");
      }
    }

    fetchGradesAndSubjects();
  }, []);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description || "");
      const grade = grades.find((grade) =>
        grade.subjects.some((subject) => subject.id === assignment.subjectId)
      );
      if (grade) {
        setSelectedGradeName(grade.name);
      }
      setSelectedSubjectId(assignment.subjectId);
    }
  }, [assignment, grades]);

  const handleGradeChange = (gradeName: string) => {
    setSelectedGradeName(gradeName);
    setSelectedSubjectId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (assignment && selectedGradeName && selectedSubjectId) {
      try {
        await updateAssignment(assignment.id, {
          title: title,
          description: description,
          gradeName: selectedGradeName,
          subjectId: selectedSubjectId,
        });
        router.push("/assignment");
      } catch (error) {
        console.error("Error updating assignment:", error);
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
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 rounded-md w-full"
            required
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="grade" className="block text-md font-medium text-white">
            Curso
          </label>
          <Select
            name="grade"
            value={selectedGradeName || ""}
            onValueChange={handleGradeChange}
          >
            <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500">
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
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="subject" className="block text-md font-medium text-white">
            Materia
          </label>
          <Select
            name="subject"
            value={selectedSubjectId?.toString() || ""}
            onValueChange={(e) => setSelectedSubjectId(Number(e))}
          >
            <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500">
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700">
              {grades
                .find((grade) => grade.name === selectedGradeName)
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