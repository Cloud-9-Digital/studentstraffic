const cloudinary = require('cloudinary').v2;
const { readFileSync } = require('fs');
const { join } = require('path');
const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf8');
const env = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]; })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Usage: set LOCAL_IMAGE_PATH env var or edit the path below
const imagePath = process.env.LOCAL_IMAGE_PATH || "/path/to/image.png";
cloudinary.uploader.upload(
  imagePath,
  { folder: "studentstraffic/countries" },
  function(error, result) {
    if (error) {
      console.error("error:", error);
    } else {
      console.log("url:", result.secure_url);
    }
  }
);
