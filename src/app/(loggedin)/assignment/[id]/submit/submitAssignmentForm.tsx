'use client'
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validExtensions } from "@/lib/models/addAssignment";
import {Tooltip} from "@nextui-org/tooltip";
import { Assignment } from "@prisma/client";
import { useState } from "react";
import { submitAssignment } from "./submitAssignmentActions";
import { uploadFile } from "@/lib/fileUtils";
import { deleteFileFromCloudinary, getPublicIdFromURL } from "@/lib/cloudinary";

export interface SubmitAssignmentFormProps {
    assignment: Assignment;
}

export default function SubmitAssignmentForm({ assignment, }: SubmitAssignmentFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sending, setSending] = useState(false);
    
    const handleSubmit = async () => {
        setSending(true);
        let fileUrl: string | undefined = undefined;
        try {
            setError(null);
            setShowSuccess(false);
    
            if (!file) {
                setError("Debes seleccionar un archivo");
                return;
            }
            
            fileUrl = await uploadFile(file);
            if (!fileUrl) {
                setError("Error al subir el archivo");
                return;
            }
    
            await submitAssignment(fileUrl, assignment.id);
            setShowSuccess(true);
        } catch (error) {
            setError(`Error al enviar el trabajo: ${error}`);
            setShowSuccess(false);
            if (fileUrl) {
                const publicId = await getPublicIdFromURL(fileUrl);
                if (publicId) {
                    await deleteFileFromCloudinary(publicId);
                }
            }
        } finally {
            setSending(false);
        }
    };
    return (
        <div className="min-h-full bg-gray-900 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Entregar trabajo practico { assignment.title }
                    </h2>
                    <Button
                        onClick={handleSubmit}
                        variant="secondary"
                        disabled={sending}
                        className="bg-green-600 hover:bg-green-500 text-white"
                    >
                        {sending ? 'Enviando...' : 'Enviar'}
                    </Button>
                </div>

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
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
                {showSuccess && (
                    <p className="text-green-500 text-sm mt-1">Archivo entregado correctamente</p>
                )}
            </div>
        </div>
    )
}