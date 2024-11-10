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
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { NoResultCard } from "./NoResultCard";
import { Tooltip } from "@nextui-org/tooltip";
import { PrismaProfileWithUser } from "@/lib/data/mappings";
import { GradeWithSubjects } from "@/lib/definitions/grade";

type TPListPageProps = {
  assignmentsInitial: AssignmentType[];
  count: number;
  totalAssignments: number;
  profile: PrismaProfileWithUser | null;
  grades: GradeWithSubjects[];
};

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  name: string;
  subjects: Subject[];
}

export default function TPListPage({
  assignmentsInitial = [],
  count,
  profile,
  grades,
}: TPListPageProps) {
  const [title, setTitle] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const { replace, push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTitle(searchParams.get("title") || "");
    setSelectedGrade(
      grades.find((grade) => grade.name == searchParams.get("grade")) ?? null
    );
    if (searchParams.get("subject")) {
      setSelectedSubject(
        selectedGrade?.subjects.find(
          (subject) => subject.id === Number(searchParams.get("subject"))
        ) ?? null
      );
    } else {
      setSelectedSubject(null);
    }
  }, [searchParams]);

  const handleGradeChange = (gradeName: string) => {
    setSelectedGrade(grades.find((grade) => grade.name == gradeName) ?? null);
    setSelectedSubject(null);
  };

  const handleSubjectChange = (e: string) => {
    setSelectedSubject(
      selectedGrade?.subjects.find((subject) => subject.id === Number(e)) ??
        null
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      title: title,
      subject: selectedSubject?.toString() || "",
      grade: selectedGrade?.name || "",
      page: "1",
    });

    replace(`${pathname}?${params.toString()}`);
  };

  const handleTitleEdit = (value: string) => {
    setTitle(value);
    setSelectedSubject(null);
  };

  const handleEdit = (id: number) => {
    push(`/assignment/${id}/edit`);
  };

  const handleView = (id: number) => {
    const assignment = assignmentsInitial.find(
      (assignment) => assignment.id === id
    );
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
          alert("Ocurrió un error al eliminar el trabajo práctico: " + response.error);
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
          {profile?.role === "Teacher" && (
            <Tooltip
              content="Agregar Trabajo Práctico"
              classNames={{ content: "text-white" }}
            >
              <Button
                onClick={handleCreate}
                variant="secondary"
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
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
              value={selectedGrade?.name || ""}
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
              value={selectedSubject?.toString() || ""}
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
                {selectedGrade?.subjects.map((subject) => (
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
            <Tooltip content="Buscar" classNames={{ content: "text-white" }}>
              <Button
                onClick={handleSearch}
                variant="secondary"
                className="bg-gray-600 hover:bg-gray-500 px-5 w-full sm:w-auto"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
          {assignmentsInitial.length > 0 ? (
            assignmentsInitial.map((assignment) => (
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
                    {profile?.role === "Teacher" && (
                      <Tooltip
                        content="Editar"
                        classNames={{ content: "text-white" }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(assignment.id)}
                          className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      content="Ver"
                      classNames={{ content: "text-white" }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(assignment.id)}
                        className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500 flex-grow sm:flex-grow-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    {profile?.role === "Teacher" && (
                      <Tooltip
                      content="Borrar"
                      classNames={{ content: "text-white" }}
                      >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        className="bg-red-600 text-white hover:bg-red-500 border-red-500 flex-grow sm:flex-grow-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      </Tooltip>
                    )}
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
