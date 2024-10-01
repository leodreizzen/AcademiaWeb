import { Button } from "@/components/ui/button";
import { downloadFile } from "@/app/server-actions/downloadFile";

export default function DownloadAssignment({ fileId }: { fileId: string }) {
  const handleDownload = async () => {
    try {
      await downloadFile(fileId);
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
