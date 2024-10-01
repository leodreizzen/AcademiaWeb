'use client'

import React, {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {addStudentToDataBase, addParentToDataBase} from "@/app/(loggedin)/student/add/studentBack";
import {fetchGrades} from "@/app/(loggedin)/student/add/fetchGrades";
import PaginationControls from "@/app/(loggedin)/student/add/paginationControls";


type PrincipalProps = {
  data: ParentWithUser[];
  count: number;
};

export function StudentRegistrationFormComponent({ data, count }: PrincipalProps) {
  const [step, setStep] = useState(1)
  const [yearSelected, setYearSelected] = useState("")
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: '',
    anio: ''
  })

  const [searchDNI, setSearchDNI] = useState('')
  const [searchApellido, setSearchApellido] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newParentData, setNewParentData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: '',
  })

  const [parents, setParents] = useState<ParentWithUser[]>([])


  const [grades, setGrades] = useState<string[]>([]);

  useEffect(() => {
    const fetchGradesData = async () => {
        const response = await fetchGrades();
        setGrades(response.map((grade) => grade.name));
    };

    fetchGradesData();
  }, []);




  const handleSelectedParent = (e: React.MouseEvent, parent: ParentWithUser) => {
   e.preventDefault()
    if (parents.some(p => p.id === parent.id)) {
      setParents(parents.filter(p => p.id !== parent.id))
    } else if (parents.length < 2) {
      setParents([...parents, parent])
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'telefono' || name === 'dni') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({...prev, [name]: numericValue}));
    }else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleNewParentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'telefono' || name === 'dni') {
      const numericValue = value.replace(/\D/g, '')
      setNewParentData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setNewParentData(prev => ({ ...prev, [name]: value }))
    }
  }
    const handleYearSelected = (value: string) => {
        setYearSelected(value)
        setFormData(prev => ({ ...prev, anio: value }))
  }


  const isStep1Valid = () => {
    return Object.values(formData).every(field => field.trim() !== '')
  }

  const isNewParentValid = () => {
    return Object.values(newParentData).every(field => field.trim() !== '')
  }

  const continueNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && isStep1Valid()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {

      e.preventDefault();
      if (step === 2 && parents.length > 0) {
          const resul = await addStudentToDataBase(formData, parents, yearSelected)
          if (resul && resul.errors) {
              alert(resul.message)
          } else {
              // Reset form after submission
              setFormData({
                  dni: '', nombre: '', apellido: '', telefono: '', direccion: '', correo: '', anio: '',
              })
              setParents([])
              setYearSelected("")
              setStep(1)
              // }


          }
      }
  }

  const handleCreateNewParent = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await addParentToDataBase(newParentData);
    if(result && result.errors){
        alert(result.message)
    }
    else{

        setIsDialogOpen(false)
         // Reset new parent form
        setNewParentData({
            dni: '',
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: '',
            correo: '',
          })
    }

  }

  const handleSearch = () => {
    // Here you would typically fetch data based on searchDNI and searchApellido
    console.log('Searching for:', { dni: searchDNI, apellido: searchApellido })
    // For now, we'll just log the search parameters
  }

  return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-100">
              {step === 1 ? "Registrar Alumno" : "Asociar Responsable"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step===1 ? (
                <>
                  <form onSubmit={continueNextStep} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="dni" className="text-gray-300">DNI</Label>
                          <Input
                              id="dni"
                              name="dni"
                              value={formData.dni}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nombre" className="text-gray-300">Nombre</Label>
                          <Input
                              id="nombre"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="direccion" className="text-gray-300">Dirección</Label>
                          <Input
                              id="direccion"
                              name="direccion"
                              value={formData.direccion}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="orden" className="text-gray-300">Año asociado</Label>
                          <Select
                              name="anio"
                              value={yearSelected}
                              onValueChange={handleYearSelected}
                          >
                            <SelectTrigger className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
                              <SelectValue placeholder="Elija un año"/>
                            </SelectTrigger>
                            <SelectContent>
                              {grades.map((grade) => (
                                  <SelectItem
                                      key={grade}
                                      className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                                      value={grade}
                                  >
                                    {grade}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>


                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefono" className="text-gray-300">Número de teléfono</Label>
                          <Input
                              id="telefono"
                              name="telefono"
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={formData.telefono}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido" className="text-gray-300">Apellido</Label>
                          <Input
                              id="apellido"
                              name="apellido"
                              value={formData.apellido}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="correo" className="text-gray-300">Correo electrónico</Label>
                          <Input
                              id="correo"
                              name="correo"
                              type="email"
                              value={formData.correo}
                              onChange={handleInputChange}
                              required
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>




                      </div>
                    </div>



                      <Button
                          type="submit"
                          disabled={!isStep1Valid()}
                          className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                      >
                        Siguiente
                      </Button>


                  </form>


                </>


            ) : (

                <>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="searchDNI" className="text-gray-300">Buscar por DNI</Label>
                          <Input
                              id="searchDNI"
                              value={searchDNI}
                              onChange={(e) => setSearchDNI(e.target.value)}
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="searchApellido" className="text-gray-300">Buscar por Apellido</Label>
                          <Input
                              id="searchApellido"
                              value={searchApellido}
                              onChange={(e) => setSearchApellido(e.target.value)}
                              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                          />
                        </div>
                      </div>
                      <Button
                          onClick={handleSearch}
                          className="bg-blue-600 text-white hover:bg-blue-500"
                      >
                        Buscar
                      </Button>
                          {data.map((parent) => (
                              <Card key={parent.id} className="bg-gray-700">
                                  <CardContent className="flex items-center justify-between p-3">
                                      <div>
                                          <p className="font-semibold text-white text-xl">{parent.user.firstName} {parent.user.lastName}</p>
                                          <p className="text-base text-gray-400 mt-1">DNI: {parent.user.dni}</p>
                                      </div>
                                      <div className="space-x-3">
                                          <Button
                                              onClick={(e) => handleSelectedParent(e,parent)}
                                              className={`${
                                                  parents.some(p => p.id === parent.id)
                                                      ? 'bg-blue-600 text-white'
                                                      : 'bg-gray-600 text-gray-100'
                                              } hover:bg-blue-500`}
                                              disabled={parents.length === 2 && !parents.some(p => p.id === parent.id)}
                                          >
                                              {parents.some(p => p.id === parent.id) ? 'Seleccionado' : 'Seleccionar'}
                                          </Button>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))}
                    <PaginationControls cantPages={count} />
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 text-white hover:bg-green-500 w-full mt-4">
                            Nuevo Responsable
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-gray-100">
                          <DialogHeader>
                            <DialogTitle>Nuevo Responsable</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="newParentDni" className="text-gray-300">DNI</Label>
                              <Input
                                  id="newParentDni"
                                  name="dni"
                                  value={newParentData.dni}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newParentNombre" className="text-gray-300">Nombre</Label>
                              <Input
                                  id="newParentNombre"
                                  name="nombre"
                                  value={newParentData.nombre}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newParentApellido" className="text-gray-300">Apellido</Label>
                              <Input
                                  id="newParentApellido"
                                  name="apellido"
                                  value={newParentData.apellido}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newParentTelefono" className="text-gray-300">Número de teléfono</Label>
                              <Input
                                  id="newParentTelefono"
                                  name="telefono"
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={newParentData.telefono}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newParentDireccion" className="text-gray-300">Dirección</Label>
                              <Input
                                  id="newParentDireccion"
                                  name="direccion"
                                  value={newParentData.direccion}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newParentCorreo" className="text-gray-300">Correo electrónico</Label>
                              <Input
                                  id="newParentCorreo"
                                  name="correo"
                                  type="email"
                                  value={newParentData.correo}
                                  onChange={handleNewParentInputChange}
                                  required
                                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                              />
                            </div>
                            <Button
                                onClick={handleCreateNewParent}
                                disabled={!isNewParentValid()}
                                className="w-full bg-green-600 text-white hover:bg-green-500"
                            >
                              Agregar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>










                    </div>
                    <CardFooter className="flex justify-between">
                      <Button
                          onClick={(e) => {e.preventDefault(); setStep(1)}}
                          className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                      >
                        Volver
                      </Button>
                      <Button
                          type="submit"
                          disabled={parents.length === 0}
                          className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                      >
                        Registrar
                      </Button>
                    </CardFooter>
                  </form>
                </>
            )}
          </CardContent>

        </Card>
      </div>
  )
}