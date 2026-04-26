import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const doctorImages = [
  {
    path: "/Users/bharat/Downloads/Dr Shilpa (FMGE Moldova).png",
    publicId: "seminar/doctors/dr-shilpa-moldova",
  },
  {
    path: "/Users/bharat/Downloads/Dr Hemanth Kumar (FMGE from Russia).png",
    publicId: "seminar/doctors/dr-hemanth-kumar-russia",
  },
];

async function uploadDoctorImages() {
  console.log("Starting upload of doctor images to Cloudinary...\n");

  for (const image of doctorImages) {
    try {
      if (!fs.existsSync(image.path)) {
        console.log(`❌ File not found: ${image.path}`);
        continue;
      }

      console.log(`Uploading ${path.basename(image.path)}...`);
      const result = await cloudinary.uploader.upload(image.path, {
        public_id: image.publicId,
        folder: "seminar/doctors",
        resource_type: "image",
        overwrite: true,
      });

      console.log(`✅ Uploaded: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${image.path}:`, error);
    }
  }

  console.log("Upload complete!");
}

uploadDoctorImages();
