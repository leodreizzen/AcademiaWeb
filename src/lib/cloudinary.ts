'use server'

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type SignatureData = {
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
};

export async function uploadFileToCloudinary(formData: FormData): Promise<any> {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  return response.json();
}
