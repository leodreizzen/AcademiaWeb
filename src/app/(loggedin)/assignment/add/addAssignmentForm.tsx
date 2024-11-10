"use client";

import {useEffect, useState, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {TextArea} from "@/components/ui/textarea";
import {
    getAssignmentSignature,
    saveAssignment,
} from "@/app/server-actions/submitAssignment";
import Link from "next/link";
import {assignmentSchema, validExtensions} from "@/lib/models/addAssignment";
import {z} from "zod";
import {uploadFile} from "@/lib/cloudinary/cloudinary_client";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {GradeWithSubjects} from "@/lib/actions/exam-mark";

interface Subject {
    id: number;
    name: string;
}

export default function AddAssignmentForm({grades}: { grades: GradeWithSubjects[] }) {
    const [selectedGrade, setSelectedGrade] = useState<GradeWithSubjects | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        null
    );
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Partial<
        Record<"file" | "title" | "description" | "grade" | "subject", string[]>
    > | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleGradeChange = (e: string) => {
        const gradeId = Number(e);
        setSelectedGrade(grades.find(g => g.id === gradeId) ?? null);
        setSelectedSubject(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(null);
        setSuccessMessage(null);
        const formData = new FormData(event.currentTarget);

        if (!selectedGrade) {
            setErrors({grade: ["Debes seleccionar un curso"]});
            setSuccessMessage(null);
            return;
        }
        if (!selectedSubject) {
            setErrors({subject: ["Debes seleccionar una materia"]});
            setSuccessMessage(null);
            return;
        }
        if(!formData.get("title")){
            setErrors({title: ["El título es obligatorio"]});
            setSuccessMessage(null);
            return
        }

        if (!file) {
            setErrors({file: ["Debes subir un archivo"]});
            setSuccessMessage(null);
            return;
        }


        try {
            setUploading(true);
            const result = await uploadAssignment({
                description: formData.get("description") as string,
                title: formData.get("title") as string,
                subject: selectedSubject.id,
                fileName: file.name
            }, file);
            setUploading(false);
            if (result.success) {
                setSuccessMessage("¡El archivo se ha subido correctamente!");
                setErrors(null);
                if (formRef.current) {
                    formRef.current.reset();
                }
                setSelectedGrade(grades[0] || null);
                setSelectedSubject(grades[0]?.subjects[0] || null);
                setFile(null);
            } else {
                setErrors({file: [result.error]});
                console.error(result.error);
                setSuccessMessage(null);
            }
        } catch (error) {
            setErrors({file: ["Error al subir el archivo"]});
            setSuccessMessage(null);
            setUploading(false);
        }

    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
        >
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-2">
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
                        accept={validExtensions.map((ext) => `.${ext}`).join(", ")}
                        className="w-full py-1.5 bg-gray-700 text-white border-gray-600 rounded-md"
                        required
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>
                {errors?.file && (
                    <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}

                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="title"
                        className="block text-md font-medium text-white mr-4"
                    >
                        Título
                    </label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        className="bg-gray-700 text-white border-gray-600 rounded-md w-full"
                        required
                    />
                </div>
                {errors?.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}

                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="grade"
                        className="block text-md font-medium text-white"
                    >
                        Curso
                    </label>
                    <Select
                        name="grade"
                        value={selectedGrade?.id.toString() || ""}
                        onValueChange={handleGradeChange}
                    >
                        <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500">
                            <SelectValue placeholder="Selecciona un curso"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700">
                            {grades.map((grade) => (
                                <SelectItem
                                    key={grade.id}
                                    className="bg-gray-700 text-gray-100 focus:border-gray-500"
                                    value={grade.id.toString()}
                                >
                                    {grade.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {errors?.grade && (
                    <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
                )}
                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="subject"
                        className="block text-md font-medium text-white"
                    >
                        Materia
                    </label>
                    <Select
                        name="subject"
                        value={selectedSubject?.id.toString() || ""}
                        onValueChange={(e) => setSelectedSubject(selectedGrade?.subjects.find(s => s.id === Number(e)) || null)}
                    >
                        <SelectTrigger className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
                            <SelectValue placeholder="Selecciona una materia"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700">
                            {selectedGrade?.subjects.map((subject) => (
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
                {errors?.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="description"
                        className="block text-md font-medium text-white w-full"
                    >
                        Descripción
                    </label>
                    <TextArea
                        id="description"
                        name="description"
                        className="w-full bg-gray-700 text-white border-gray-600 rounded-md"
                    />
                </div>

                {successMessage && (
                    <div className="mb-4 p-2 text-green-700 bg-green-100 rounded-md">
                        {successMessage}
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
                    disabled={uploading}
                >
                    {uploading ? "Subiendo..." : "Subir"}
                </Button>
            </div>
        </form>
    );
}


async function uploadAssignment(data: z.infer<typeof assignmentSchema>, file: File): Promise<ActionResult> {
    const signatureResult = await getAssignmentSignature(data);
    if (!signatureResult.success) {
        return {
            success: false,
            error: signatureResult.error
        }
    }
    const fileUrl = await uploadFile(file, signatureResult.signatureData)
    if (!fileUrl) {
        return {
            success: false,
            error: "Error al subir el archivo"
        }
    }
    await saveAssignment(data, fileUrl);
    return {success: true}
}

