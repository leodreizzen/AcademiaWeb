'use client';

import { Button } from "@/components/ui/button";
import { downloadFile } from "@/app/server-actions/downloadFile";

interface DownloadAssignmentProps {
  fileId: string;
}

export default function DownloadAssignment({ fileId }: DownloadAssignmentProps) {
  const handleDownload = async () => {
    try {
      const fileBlob = await downloadFile(fileId);
      
      if (fileBlob) {
        const file = await fileBlob.json();
        const url = window.URL.createObjectURL(file.file);

        // Crear un enlace para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // Coloca aquí el nombre del archivo si lo tienes
        a.target = '_blank';
        a.click();

        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error: No se pudo obtener el archivo');
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  return (
    <Button onClick={handleDownload}>
      Descargar archivo
    </Button>
  );
}
