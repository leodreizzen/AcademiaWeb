"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Edit, Eye } from 'lucide-react'
import PaginationControls from "@/components/list/PaginationControls";
import {ParentWithUser} from "@/app/(loggedin)/parent/data";
import {usePathname, useRouter} from "next/navigation";

type PrincipalProps = {
  data: ParentWithUser[];
  count: number;
};




export function ListParents({ data, count }: PrincipalProps) {
  const [dni, setDni] = useState("")
  const [lastName, setLastName] = useState("")
  const { push, replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const params = new URLSearchParams({
      dni: dni,
      lastName: lastName
    });

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDniEdit = (dni: string) => {
      setDni(dni);
      setLastName("")
  }

  const handleLastNameEdit = (lastName: string) => {
    setDni("");
    setLastName(lastName)
  }

  const handleEdit = (id: number) => {
    push(`/parent/${id}/edit`)
  }

  const handleView = (id: number) => {
    push(`/parent/${id}`)
  }

  return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Listado de Padres</h2>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Input
                  type="text"
                  placeholder="Buscar por DNI"
                  value={dni}
                  onChange={(e) => handleDniEdit(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
              />
            </div>
            <div className="flex space-x-3">
              <Input
                  type="text"
                  placeholder="Buscar por Apellido"
                  value={lastName}
                  onChange={(e) => handleLastNameEdit(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 flex-grow text-lg py-5 max-w-md"
              />
              <Button onClick={handleSearch} variant="secondary" className="bg-gray-600 hover:bg-gray-500 px-5">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto">
            {data.map(parent => (
                <Card key={parent.id} className="bg-gray-700">
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-semibold text-white text-xl">{parent.user.firstName} {parent.user.lastName}</p>
                      <p className="text-base text-gray-400 mt-1">DNI: {parent.user.dni}</p>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" size="default" onClick={() => handleEdit(parent.id)} className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>
                      <Button variant="outline" size="default" onClick={() => handleView(parent.id)} className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500">
                        <Eye className="mr-2 h-4 w-4" /> Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
          <PaginationControls cantPages={count} />
        </div>
      </div>
  )
}