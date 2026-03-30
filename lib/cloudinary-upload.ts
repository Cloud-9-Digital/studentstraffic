import "server-only";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadOptions = {
  folder: string;
  /** "image" | "raw" — use "raw" for PDFs */
  resourceType?: "image" | "raw" | "auto";
  /** Max bytes — default 10 MB */
  maxBytes?: number;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_PROOF_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];

export async function uploadFileToCloudinary(
  file: File,
  options: UploadOptions
): Promise<{ url: string; publicId: string }> {
  const { folder, resourceType = "auto", maxBytes = 10 * 1024 * 1024 } = options;

  if (file.size > maxBytes) {
    throw new Error(`File is too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? "Upload failed."));
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      }
    );
    stream.end(buffer);
  });
}

export function isAllowedPhotoType(mimeType: string) {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isAllowedProofType(mimeType: string) {
  return ALLOWED_PROOF_TYPES.includes(mimeType);
}
