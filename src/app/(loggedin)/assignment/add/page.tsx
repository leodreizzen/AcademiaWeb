import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/fileupload";

export default function AddAssignmentPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen relative px-4 ">
      <div className="mt-10 w-full max-w-md lg:max-w-lg border border-gray-300 p-4 rounded-md">
        <div>
          <h3 className="text-left text-2xl font-extrabold text-gray-900 mb-2">
            Subir TP
          </h3>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label
                htmlFor="file"
                className="block text-md font-medium text-gray-700 w-1/3 sm:w-auto mr-2"
              >
                Subir archivo...
              </label>
              <FileUpload id="file" name="file" className="w-full" required />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="title"
                className="block text-md font-medium text-gray-700 w-1/3 sm:w-auto mr-2"
              >
                Título
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="description"
              className="block text-md font-medium text-gray-700 w-1/4 sm:w-auto mr-2"
            >
              Descripción
            </label>
            <TextArea
              id="description"
              name="description"
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="w-auto">
              Subir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
