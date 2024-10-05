'use client'

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/textarea"
import { submitAssignment } from "@/app/server-actions/submitAssignment"
import { getGradesAndSubjects } from "@/app/server-actions/fetchGradeSubject"
import Link from "next/link"
import { generateSignature, uploadFileToCloudinary } from "@/lib/cloudinary"

interface Subject {
  id: number
  name: string
}

interface Grade {
  id: number
  name: string
  subjects: Subject[]
}

export default function AddAssignmentForm() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<"file" | "title" | "description", string[]>> | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    async function fetchGradesAndSubjects() {
      try {
        const data = await getGradesAndSubjects()
        const processedGrades = data.grades.map((grade: any) => ({
          id: Number(grade.id) || Math.floor(Math.random() * 1000000),
          name: grade.name || 'Unnamed Grade',
          subjects: (grade.subjects || []).map((subject: any) => ({
            id: Number(subject.id) || Math.floor(Math.random() * 1000000),
            name: subject.name || 'Unnamed Subject',
          })),
        }))
        setGrades(processedGrades)
        if (processedGrades.length > 0) {
          setSelectedGradeId(processedGrades[0].id)
          if (processedGrades[0].subjects.length > 0) {
            setSelectedSubjectId(processedGrades[0].subjects[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching grades and subjects:", error)
      }
    }
    fetchGradesAndSubjects()
  }, [])

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gradeId = Number(e.target.value)
    setSelectedGradeId(gradeId)
    const grade = grades.find(g => g.id === gradeId)
    if (grade && grade.subjects.length > 0) {
      setSelectedSubjectId(grade.subjects[0].id)
    } else {
      setSelectedSubjectId(null)
    }
  }

  const uploadFile = async () => {
    if (!file) return null
    const { apiKey, signature, timestamp } = await generateSignature()

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default")
    formData.append("api_key", apiKey)
    formData.append("signature", signature)
    formData.append("timestamp", timestamp.toString())
    setUploading(true)
    try {
      const responseData = await uploadFileToCloudinary(formData)
      if (!responseData.secure_url) {
        throw new Error(`Cloudinary upload failed: ${responseData.error?.message || "Unknown error"}`)
      }
      setUploading(false)
      return responseData.secure_url
    } catch (error) {
      console.error("Upload failed:", error)
      setUploading(false)
      return null
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors(null)
    setSuccessMessage(null)
    
    const formData = new FormData(event.currentTarget)
    const fileUrl = await uploadFile()
    if (fileUrl && selectedGradeId !== null && selectedSubjectId !== null) {
      formData.append("fileUrl", fileUrl)
      formData.append("subject", selectedSubjectId.toString())
      formData.append("grade", selectedGradeId.toString())
      try {
        const response = await submitAssignment(formData)
        if (response.success) {
          setSuccessMessage("¡El archivo se ha subido correctamente!")
          setErrors(null)
          if (formRef.current) {
            formRef.current.reset()
          }
          setFile(null)
          setSelectedGradeId(grades[0]?.id || null)
          setSelectedSubjectId(grades[0]?.subjects[0]?.id || null)
        } else {
          if (response.errors?.fieldErrors) {
            setErrors(response.errors.fieldErrors)
          } else {
            setErrors({ file: ["Error al subir el archivo"] })
          }
          setSuccessMessage(null)
        }
      } catch (error) {
        console.error("Error submitting assignment:", error)
        setErrors({ file: ["Error al subir el archivo"] })
        setSuccessMessage(null)
      }
    } else {
      setErrors({ file: ["Error al subir el archivo o seleccionar curso/materia"] })
      setSuccessMessage(null)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="w-full flex flex-col">
        <div className="mb-4 flex items-center">
          <label htmlFor="file" className="block text-md font-medium w-1/3 mr-2">
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

        <div className="mb-4 flex items-center">
          <label htmlFor="title" className="block text-md font-medium w-1/3">
            Título
          </label>
          <Input id="title" name="title" type="text" className="w-2/3" required />
          {errors?.title && <p className="text-red-500">{errors.title}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <label htmlFor="grade" className="block text-md font-medium w-1/4">
          Curso
        </label>
        <select
          id="grade"
          name="grade"
          className="w-3/4 border-gray-300 rounded-md"
          value={selectedGradeId?.toString() || ""}
          onChange={handleGradeChange}
        >
          <option value="">Selecciona un curso</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id.toString()}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor="subject" className="block text-md font-medium w-1/4">
          Materia
        </label>
        <select
          id="subject"
          name="subject"
          className="w-3/4 border-gray-300 rounded-md"
          value={selectedSubjectId?.toString() || ""}
          onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
        >
          <option value="">Selecciona una materia</option>
          {grades
            .find((grade) => grade.id === selectedGradeId)
            ?.subjects.map((subject) => (
              <option key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor="description" className="block text-md font-medium w-1/4">
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
          <Button type="submit" className="transition duration-200" disabled={uploading}>
            {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      </div>
    </form>
  )
}