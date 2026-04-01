import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function findLogo() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "studentstraffic/images/universities/",
      max_results: 300
    });
      
    console.log("Images found in folder matching danang:");
    result.resources.forEach(res => {
      if (res.public_id.includes("danang")) {
        console.log(`- ${res.public_id} => ${res.secure_url}`);
      }
    });
  } catch (err) {
    console.error("Cloudinary error:", err);
  }
}

findLogo();
