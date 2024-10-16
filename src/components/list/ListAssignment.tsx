"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Edit, Eye, Plus, Trash2 } from "lucide-react";
import PaginationControls from "@/components/list/PaginationControls";
import { AssignmentType } from "@/types/assignment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteAssignment } from "@/app/server-actions/deleteAssignment";
import { getGradesAndSubjects } from "@/app/server-actions/fetchGradeSubject";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { NoResultCard } from "./NoResultCard";

type TPListPageProps = {
  data: AssignmentType[];
  count: number;
};

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  name: string;
  subjects: Subject[];
}

export default function TPListPage({ data = [], count }: TPListPageProps) {
  const [title, setTitle] = useState("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGradeName, setSelectedGradeName] = useState<string | null>(
    null
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );

  const { replace, push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTitle(searchParams.get("title") || "");
    setSelectedGradeName(searchParams.get("grade") || null);
    setSelectedSubjectId(
      searchParams.get("subject") ? Number(searchParams.get("subject")) : null
    );

    async function fetchGradesAndSubjects() {
      try {
        const data = await getGradesAndSubjects();
        const processedGrades = data.grades.map((grade: any) => ({
          name: grade.name || "Unnamed Grade",
          subjects: (grade.subjects || []).map((subject: any) => ({
            id: Number(subject.id),
            name: subject.name || "Unnamed Subject",
          })),
        }));
        setGrades(processedGrades);
      } catch (error) {
        console.error("Error fetching grades and subjects:", error);
      }
    }

    fetchGradesAndSubjects();
  }, [searchParams]);

  const handleGradeChange = (e: string) => {
    let gradeName = e;
    if (gradeName === "empty") {
      gradeName = "";
    }
    setSelectedGradeName(gradeName || null);
    setSelectedSubjectId(null);
  };

  const handleSubjectChange = (e: string) => {
    let subjectId = e;
    if (subjectId === "empty") {
      subjectId = "";
    }
    setSelectedSubjectId(subjectId ? Number(subjectId) : null);
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      title: title,
      subject: selectedSubjectId?.toString() || "",
      grade: selectedGradeName || "",
      page: "1",
    });

    replace(`${pathname}?${params.toString()}`);
  };

  const handleTitleEdit = (value: string) => {
    setTitle(value);
    setSelectedSubjectId(null);
  };

  const handleEdit = (id: number) => {
    push(`/assignment/${id}/edit`);
  };

  const handleView = (id: number) => {
    const assignment = data.find((assignment) => assignment.id === id);
    if (assignment && assignment.fileUrl) {
      push("/assignment/" + id);
    } else {
      console.error("URL not found for assignment with id", id);
    }
  };

  const handleCreate = () => {
    push("/assignment/add");
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar este trabajo práctico?"
    );
    if (confirmation) {
      try {
        const response = await deleteAssignment(id);
        if (!response.success) {
          alert("Ocurrió un error al eliminar el trabajo práctico.");
          return;
        }
        alert("Trabajo práctico eliminado con éxito");
        replace(pathname);
      } catch (error) {
        console.error("Error al eliminar el trabajo práctico:", error);
        alert("Ocurrió un error al eliminar el trabajo práctico.");
      }
    }
  };

  return (
    <div className="min-h-full bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Listado de Trabajos Prácticos
          </h2>
          <Button
            onClick={handleCreate}
            variant="secondary"
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo TP
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => handleTitleEdit(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
            />
            <Select
              name="grade"
              value={selectedGradeName || ""}
              onValueChange={handleGradeChange}
            >
              <SelectTrigger className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5">
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700">
                <SelectItem
                  value={"empty"}
                  key={"empty"}
                  className="bg-gray-700 text-gray-100 focus:border-gray-500"
                >
                  Curso
                </SelectItem>
                {grades.map((grade) => (
                  <SelectItem
                    key={grade.name}
                    value={grade.name}
                    className="bg-gray-700 text-gray-100 focus:border-gray-500"
                  >
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              name="subject"
              value={selectedSubjectId?.toString() || ""}
              onValueChange={handleSubjectChange}
            >
              <SelectTrigger className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5">
                <SelectValue placeholder="Materia" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700">
                <SelectItem
                  value={"empty"}
                  key={"empty"}
                  className="bg-gray-700 text-gray-100 focus:border-gray-500"
                >
                  Materia
                </SelectItem>
                {selectedGradeName &&
                  grades
                    .find((grade) => grade.name === selectedGradeName)
                    ?.subjects.map((subject) => (
                      <SelectItem
                        className="bg-gray-700 text-gray-100 focus:border-gray-500"
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-gray-600 hover:bg-gray-500 px-5 w-full sm:w-auto"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
          {data.length > 0 ? (
            data.map((assignment) => (
              <Card key={assignment.id} className="bg-gray-700">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 space-y-3 sm:space-y-0">
                  <div>
                    <p className="font-semibold text-white text-xl">
                      {assignment.title}
                    </p>
                    <p className="text-base text-gray-400 mt-1">
                      {assignment.gradeName + " " + assignment.subjectName}
                    </p>
                  </div>
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(assignment.id)}
                      className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(assignment.id)}
                      className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0"
                    >
                      <Eye className="mr-2 h-4 w-4" /> Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                      className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Borrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <NoResultCard user={"trabajos prácticos"} />
          )}
        </div>

        <div className="mt-6">
          <PaginationControls cantPages={count} />
        </div>
      </div>
    </div>
  );
}
