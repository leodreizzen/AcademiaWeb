import { generateSignature, uploadFileToCloudinary } from "./cloudinary";

export async function uploadFile(file: File): Promise<string | undefined> {
    const { apiKey, signature, timestamp } = await generateSignature();
    const cleanFileName = file.name
      .normalize("NFD") // Elimina acentos y caracteres especiales
      .replace(/[\u0300-\u036f]/g, "") // Remueve los diacríticos
      .replace(/\s+/g, "_"); // Reemplaza espacios por guiones bajos
    const cleanFile = new File([file], cleanFileName, { type: file.type });
  
    const formData = new FormData();
    formData.append("file", cleanFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
    );
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("use_filename", "true");
  
    try {
      const responseData = await uploadFileToCloudinary(formData);
      if (!responseData.secure_url) {
        throw new Error(
          `Cloudinary upload failed: ${
            responseData.error?.message || "Unknown error"
          }`
        );
      }
      return responseData.secure_url;
    } catch (error) {
      return undefined;
    }
  }