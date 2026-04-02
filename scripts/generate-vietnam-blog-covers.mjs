import "dotenv/config";

import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, ".tmp", "generated-blog-covers");

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is required.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary credentials are required.");
}

mkdirSync(outDir, { recursive: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

neonConfig.webSocketConstructor = WebSocket;

const styleReferenceUrl =
  "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1775127931/studentstraffic/blog/mbbs-vietnam-fees-2026-total-cost-guide.jpg";

const covers = [
  {
    slug: "best-vietnam-medical-universities-for-indian-students-ranking",
    publicId:
      "studentstraffic/blog/best-vietnam-medical-universities-for-indian-students-ranking",
    filename: "best-vietnam-medical-universities-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for visual tone, spacing, color discipline, and clean editorial infographic feel.

Required exact visible text:
Best Medical Universities in Vietnam 2026
For Indian Students
Recognition • Cost • Clinical Depth

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Vietnam map silhouette in the background
- elegant ranked university comparison scene with premium medical-campus cues
- include 4 to 5 clean comparison blocks or ranking ribbons, but keep them graphical rather than dense tables
- visual hints of teaching hospitals, academic buildings, stethoscope, medal, graduation cap, and clipboard
- polished, trustworthy, authoritative editorial design
- made for organic blog traffic, not a flashy ad

Important:
- text must be highly legible on desktop and mobile
- do not add logos, watermarks, agent branding, or fake university seals
- do not invent long paragraphs or tiny unreadable labels
- keep the design balanced and premium`,
  },
  {
    slug: "is-mbbs-in-vietnam-valid-in-india-nmc-next-neet",
    publicId:
      "studentstraffic/blog/is-mbbs-in-vietnam-valid-in-india-nmc-next-neet",
    filename: "is-mbbs-in-vietnam-valid-in-india-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for visual tone, spacing, color discipline, and clean editorial infographic feel.

Required exact visible text:
Is MBBS in Vietnam Valid in India?
NMC • NEET • NExT 2026

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle split-map feel using Vietnam and India in the background
- document-checklist and compliance theme with medical symbolism
- visual elements like shield, checklist, passport, degree certificate, stethoscope, hospital cross, and arrows connecting study abroad to India-return planning
- polished editorial infographic style, calm and authoritative
- should communicate clarity, compliance, and trust

Important:
- keep the text spelled exactly as written
- no flags dominating the composition
- no dense paragraphs, no logos, no watermarks
- avoid political or legal poster style; keep it modern and informative
- text must remain legible on mobile`,
  },
];

async function fetchAsInlineData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch reference image: ${url}`);
  }

  const mimeType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    inline_data: {
      mime_type: mimeType,
      data: buffer.toString("base64"),
    },
  };
}

async function generateImage(prompt, outputFile) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, await fetchAsInlineData(styleReferenceUrl)],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K",
      },
    },
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": geminiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${text.slice(0, 500)}`);
  }

  const data = JSON.parse(text);
  const parts = data.candidates?.flatMap((candidate) => candidate?.content?.parts ?? []) ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);

  if (!imagePart) {
    throw new Error(`No image returned by Gemini: ${text.slice(0, 500)}`);
  }

  const base64Data = imagePart.inlineData?.data || imagePart.inline_data?.data;
  writeFileSync(outputFile, Buffer.from(base64Data, "base64"));
}

async function uploadAndUpdate({ slug, publicId }, outputFile, client) {
  const uploadResult = await cloudinary.uploader.upload(outputFile, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  const result = await client.query(
    `UPDATE blog_posts
       SET cover_url = $1,
           updated_at = NOW()
     WHERE slug = $2
     RETURNING id, slug, cover_url`,
    [uploadResult.secure_url, slug]
  );

  return result.rows[0];
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    for (const cover of covers) {
      const outputFile = join(outDir, cover.filename);
      console.log(`Generating ${cover.slug}...`);
      await generateImage(cover.prompt, outputFile);
      console.log(`Saved ${basename(outputFile)}`);

      const row = await uploadAndUpdate(cover, outputFile, client);
      console.log(JSON.stringify(row, null, 2));
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
