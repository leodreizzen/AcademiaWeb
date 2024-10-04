"use client";

import { useEffect, useState } from "react";
import DownloadAssignment from "./downloadAssingment";
import { getAssignments } from "@/app/(loggedin)/assignment/add/getAssignments";
import { deleteAssignment } from "@/app/server-actions/deleteAssignment";
import { AssignmentType } from "@/types/assignment";
import { Button } from "../button";
import { Input } from "../input";
import { Edit, Eye, Search } from "lucide-react";
import { Card, CardContent } from "../card";
import { usePathname, useRouter } from "next/navigation";
import PaginationControls from "./PaginationControls";

type TPListPageProps = {
  initialAssignments: AssignmentType[];
  count: number;
}

export default function TPListPage({ initialAssignments, count }: TPListPageProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const { replace, push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const response = await getAssignments(1);
      setAssignments(response);
      setLoading(false);
    };
    fetchAssignments();
  }, []);

  const handleDelete = async (assignmentId: number) => {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar esta asignación?"
    );
    if (confirmed) {
      try {
        await deleteAssignment(assignmentId);
        setAssignments(
          assignments.filter(
            (assignment) => assignment.id !== assignmentId
          )
        );
      } catch (error) {
        console.error("Error al eliminar la asignación:", error);
      }
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      title: title,
      subject: subject,
    });

    replace(`${pathname}?${params.toString()}`);
  };

  function handleTitleEdit(value: string): void {
    setTitle(value);
  }

  function handleSubjectEdit(value: string): void {
    setSubject(value);
  }

  function handleView(id: number): void {
    console.log("Viewing TP with id", id);
  }

  function handleEdit(id: number): void {
    console.log("Editing TP with id", id);
  }

  const handleCreate = () => {
    push("/assignment/add");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
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
            Agregar TP
          </Button>
        </div>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : assignments.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="text"
              placeholder="Buscar por titulo"
              onChange={(e) => handleTitleEdit(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
            />
            <Input
              type="text"
              placeholder="Buscar por materia"
              onChange={(e) => handleSubjectEdit(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-2 sm:py-5"
            />
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-gray-600 hover:bg-gray-500 px-5 w-full sm:w-auto"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="bg-gray-700">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 space-y-3 sm:space-y-0">
                  <div>
                    <p className="font-semibold text-white text-xl">
                      {assignment.title}
                    </p>
                    <p className="text-base text-gray-400 mt-1">
                      {assignment.description}
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
                      <Eye className="mr-2 h-4 w-4" /> Borrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <PaginationControls cantPages={count} />
          </div>
        </div>
        ) : (
            <p className="text-center text-white text-lg">No hay trabajos prácticos subidos aún.</p>
        )}
      </div>
    </div>
  );
}
