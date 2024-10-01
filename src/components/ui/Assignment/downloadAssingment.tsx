"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/app/server-actions/downloadFile";

interface DownloadAssignmentProps {
  fileId: string;
}

export default function DownloadAssignment({
  fileId,
}: DownloadAssignmentProps) {
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await downloadFile(fileId);

      if ("error" in response) {
        setError(response.error as string);
      } else if ("fileUrl" in response) {
        const res = await fetch(response.fileUrl);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = response.fileName || "archivo";
        a.click();

        window.URL.revokeObjectURL(url);
        setError(null);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setError("Ocurrió un error inesperado al intentar descargar el archivo");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={handleDownload} disabled={downloading}>
        {downloading ? "Descargando..." : "Descargar archivo"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
