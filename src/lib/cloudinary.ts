import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getCloudinaryFile(fileUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error("Error al obtener el archivo desde Cloudinary");
      return null;
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error al descargar el archivo desde Cloudinary:", error);
    return null;
  }
}

export default cloudinary;
