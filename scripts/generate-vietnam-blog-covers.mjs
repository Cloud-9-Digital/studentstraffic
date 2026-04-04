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

const requestedSlugs = new Set(process.argv.slice(2));

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
  {
    slug: "mbbs-in-vietnam-admission-2026-eligibility-documents-timeline",
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-admission-2026-eligibility-documents-timeline",
    filename: "mbbs-vietnam-admission-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for visual tone, spacing, and clean editorial infographic quality.

Required exact visible text:
MBBS in Vietnam Admission 2026
Eligibility • Documents • Timeline

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Vietnam map silhouette in the background
- admissions and processing theme with document stack, checklist, passport, calendar, hospital building, and admission file icons
- visual feel should suggest structure, clarity, and momentum
- polished editorial infographic style, trustworthy and premium

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no fake seals
- no dense paragraphs or tiny unreadable labels
- text must remain highly legible on mobile`,
  },
  {
    slug: "best-cities-in-vietnam-for-indian-medical-students",
    publicId:
      "studentstraffic/blog/best-cities-in-vietnam-for-indian-medical-students",
    filename: "best-cities-vietnam-medical-students-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for overall design polish and editorial consistency.

Required exact visible text:
Best Cities in Vietnam for Indian Medical Students
Hanoi • Da Nang • Can Tho • Buon Ma Thuot

Visual direction:
- warm white or light ivory background
- bold navy headline
- elegant Vietnam map in the background
- four color-coded city comparison panels or destination markers
- visual cues of skyline, airport, hospital, campus, location pins, and travel arrows
- feel like a serious city-comparison editorial cover, not a tourism poster
- premium, credible, and highly legible

Important:
- keep the text spelled exactly as written
- do not add logos, flags dominating the design, or watermarks
- avoid clutter and small unreadable text`,
  },
  {
    slug: "mbbs-in-vietnam-student-life-hostel-food-safety-budget",
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-student-life-hostel-food-safety-budget",
    filename: "mbbs-vietnam-student-life-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for design quality and infographic balance.

Required exact visible text:
MBBS in Vietnam Student Life 2026
Hostel • Food • Safety • Budget

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Vietnam map silhouette in the background
- clean student-life collage with hostel bed, meal tray, grocery bag, stethoscope, notebook, shield, and calculator
- should feel helpful, calm, and realistic rather than flashy
- premium editorial infographic style with generous negative space

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no dense tiny text
- text must remain clearly readable on mobile`,
  },
  {
    slug: "mbbs-in-vietnam-vs-russia-vs-georgia-for-indian-students",
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-vs-russia-vs-georgia-for-indian-students",
    filename: "mbbs-vietnam-vs-russia-vs-georgia-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for tone, spacing, and clean editorial infographic quality.

Required exact visible text:
MBBS in Vietnam vs Russia vs Georgia 2026
Which Is Better for Indian Students?

Visual direction:
- warm white or light ivory background
- bold navy headline
- elegant three-country comparison layout with clean country markers or map silhouettes
- subtle medical and study-abroad cues like hospital, airplane path, documents, stethoscope, and comparison arrows
- clear visual contrast between the three options without using heavy flag designs
- should feel authoritative, balanced, and editorial, not flashy

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no cluttered tiny labels
- maintain strong mobile legibility`,
  },
  {
    slug: "mbbs-in-vietnam-clinical-rotations-language-internship-guide",
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-clinical-rotations-language-internship-guide",
    filename: "mbbs-vietnam-clinical-rotations-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for visual polish and infographic balance.

Required exact visible text:
MBBS in Vietnam Clinical Rotations 2026
Language • Patient Exposure • Internship

Visual direction:
- warm white or light ivory background
- bold navy headline
- modern teaching-hospital scene with subtle Vietnam map silhouette
- visual cues of patient rounds, hospital building, simulation mannequin, clipboard, stethoscope, and language or communication icons
- should communicate serious medical training rather than generic campus life
- premium editorial infographic style, clean and trustworthy

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no tiny unreadable labels
- text must remain highly legible on mobile`,
  },
  {
    slug: "mbbs-in-vietnam-pre-departure-checklist-2026",
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-pre-departure-checklist-2026",
    filename: "mbbs-vietnam-pre-departure-checklist-cover.jpg",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for editorial consistency, spacing, and color discipline.

Required exact visible text:
MBBS in Vietnam Pre-Departure Checklist 2026
Visa • Payments • Packing • Forex

Visual direction:
- warm white or light ivory background
- bold navy headline
- structured travel-and-documents visual with passport, visa page, payment receipt, suitcase, forex card, airplane, and checklist icons
- subtle Vietnam map silhouette in the background
- should feel practical, organized, and reassuring rather than like a travel advertisement

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no fake seals
- avoid clutter and keep text highly legible on mobile`,
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
  const selectedCovers = requestedSlugs.size
    ? covers.filter((cover) => requestedSlugs.has(cover.slug))
    : covers;

  try {
    if (requestedSlugs.size > 0 && selectedCovers.length === 0) {
      throw new Error("No matching cover definitions found for the requested slugs.");
    }

    for (const cover of selectedCovers) {
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
