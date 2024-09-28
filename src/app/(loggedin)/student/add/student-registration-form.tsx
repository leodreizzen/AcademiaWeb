'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";



export function StudentRegistrationFormComponent() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: '',
  })
  const [selectedParent, setSelectedParent] = useState(false)
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

  const [parent, setParent] = useState( {
    id: -1,
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
  })

  const mockParent = {
    id: 1,
    dni: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '123456789',
  }

  const handleSelectedParent = (e: React.MouseEvent, parent: React.SetStateAction<{ id: number; dni: string; nombre: string; apellido: string; telefono: string }>) => {
    console.log("HOLAAAA LPMMMM")
   e.preventDefault()
    if(selectedParent){
        setParent({ id: -1, dni: '', nombre: '', apellido: '', telefono: '' })
        setSelectedParent(false)
    }
    else{
      setParent(parent)
      setSelectedParent(true)
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'telefono' || name === 'dni') {
      const numericValue = value.replace(/\D/g, '')
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
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

  const handleSubmit = (e: React.FormEvent) => {
    console.log("PREGUNTO EL SUBMIT")
    e.preventDefault();
    if (step === 2 && selectedParent) {
      console.log("OK SUBMITEO")
      console.log('Form submitted:', { ...formData, parent: selectedParent })
      // Reset form after submission
      setFormData({
        dni: '', nombre: '', apellido: '', telefono: '', direccion: '', correo: '',
      })
      setParent({ id: -1, dni: '', nombre: '', apellido: '', telefono: '' })

      setSelectedParent(false)
      setStep(1)
    }
  }

  const handleCreateNewParent = (e: React.MouseEvent) => {
    console.log('New parent created:', newParentData)
    e.preventDefault();
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


                    <CardFooter className="flex justify-between">
                      <Button
                          type="submit"
                          disabled={!isStep1Valid()}
                          className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                      >
                        Siguiente
                      </Button>

                    </CardFooter>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-300">DNI</TableHead>
                            <TableHead className="text-gray-300">Nombre</TableHead>
                            <TableHead className="text-gray-300">Apellido</TableHead>
                            <TableHead className="text-gray-300">Teléfono</TableHead>
                            <TableHead className="text-gray-300">Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow key={mockParent.id}>
                            <TableCell className="text-gray-300">{mockParent.dni}</TableCell>
                            <TableCell className="text-gray-300">{mockParent.nombre}</TableCell>
                            <TableCell className="text-gray-300">{mockParent.apellido}</TableCell>
                            <TableCell className="text-gray-300">{mockParent.telefono}</TableCell>
                            <TableCell>
                              <Button
                                  onClick={(e) => handleSelectedParent(e,mockParent)}
                                  className={`${
                                      parent?.id != -1
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-gray-600 text-gray-100'
                                  } hover:bg-blue-500`}
                              >
                                {parent.id != -1 ? 'Seleccionado' : 'Seleccionar'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

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
                          disabled={!selectedParent}
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