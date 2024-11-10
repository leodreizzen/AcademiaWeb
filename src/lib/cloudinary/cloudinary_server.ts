import "server-only";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type SignatureData = {
  apiKey: string;
  signature: string;
  timestamp: number;
};

export async function generateSignature(): Promise<SignatureData> {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    use_filename: 'true',
  };

  const signature = cloudinary.v2.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET || '',
  );

  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  return { apiKey, signature, timestamp };
}

export async function deleteFileFromCloudinary(public_id: string): Promise<any>{
  const searchResult = await cloudinary.v2.search.expression(`public_id=${public_id}*`).execute();
  if(searchResult.resources.length !== 1) {
    return {result: "not_found"};
  }
  else{
    return cloudinary.v2.uploader.destroy(searchResult.resources[0].public_id, {resource_type: searchResult.resources[0].resource_type});
  }
}
