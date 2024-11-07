import {SignatureData} from "@/lib/cloudinary/cloudinary_server";

let apiKey: string;
if (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY === undefined)
    throw new Error("NEXT_PUBLIC_CLOUDINARY_API_KEY not set");
apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export async function uploadFile(file: File, signatureData: SignatureData): Promise<string | null> {
    const originalFileName = file.name;
    const cleanFileName = originalFileName
        .normalize("NFD") // Elimina acentos y caracteres especiales
        .replace(/[\u0300-\u036f]/g, "") // Remueve los diacríticos
        .replace(/\s+/g, "_"); // Reemplaza espacios por guiones bajos
    const cleanFile = new File([file], cleanFileName, {type: file.type});

    const formData = new FormData();
    formData.append("file", cleanFile);
    formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
    );
    formData.append("api_key", apiKey);
    formData.append("signature", signatureData.signature);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("use_filename", "true");

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/auto/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );
        const responseData = await response.json();
        if (!responseData.secure_url) {
            throw new Error(
                `Cloudinary upload failed: ${
                    responseData.error?.message || "Unknown error"
                }`
            );
        }
        return responseData.secure_url;
    } catch (error) {
        return null;
    }
}