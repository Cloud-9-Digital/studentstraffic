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
  "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1775057455/studentstraffic/blog/best-russian-medical-universities-india.jpg";

const requestedSlugs = new Set(process.argv.slice(2));

const covers = [
  {
    slug: "is-mbbs-in-russia-valid-in-india-nmc-next-neet",
    publicId: "studentstraffic/blog/is-mbbs-in-russia-valid-in-india-nmc-next-neet",
    filename: "is-mbbs-in-russia-valid-in-india-cover.jpg",
    kicker: "Russia Compliance Guide",
    titleLines: ["Is MBBS in Russia", "Valid in India?"],
    chips: ["NMC", "NEET", "NExT 2026"],
    accent: "#B63A2B",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Russia university cover as a style reference only for tone, spacing, typography discipline, and polished editorial feel.

Required exact visible text:
Is MBBS in Russia Valid in India?
NMC • NEET • NExT 2026

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Russia and India map silhouettes in the background
- document-validation and medical-compliance theme
- visual elements like passport, degree certificate, shield, checklist, hospital cross, stethoscope, and a clean connection path from study abroad to India-return planning
- calm, trustworthy, authoritative editorial infographic design

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no fake seals
- no cluttered paragraphs or unreadable labels
- do not make it look political or legalistic; it should feel modern, helpful, and highly legible on mobile`,
  },
  {
    slug: "mbbs-in-russia-fees-2026-total-cost-guide",
    publicId: "studentstraffic/blog/mbbs-in-russia-fees-2026-total-cost-guide",
    filename: "mbbs-in-russia-fees-2026-cover.jpg",
    kicker: "Russia Cost Breakdown",
    titleLines: ["MBBS in Russia", "Fees 2026"],
    chips: ["Total Cost", "Hostel", "Living Budget"],
    accent: "#1E7A57",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Russia university cover as a style reference only for visual quality, spacing, and clean editorial consistency.

Required exact visible text:
MBBS in Russia Fees 2026
Total Cost • Hostel • Living Budget

Visual direction:
- warm white or light ivory background
- bold navy headline
- elegant Russia map silhouette in the background
- cost-planning theme with tuition card, hostel building, wallet, calculator, winter jacket, airplane, and city-budget markers
- polished editorial infographic design that feels valuable and realistic, not salesy
- include subtle premium cues for both flagship-city and budget-city comparison

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no dense price tables
- avoid clutter and tiny labels
- text must remain highly legible on mobile`,
  },
  {
    slug: "mbbs-in-russia-admission-2026-eligibility-documents-timeline",
    publicId: "studentstraffic/blog/mbbs-in-russia-admission-2026-eligibility-documents-timeline",
    filename: "mbbs-in-russia-admission-2026-cover.jpg",
    kicker: "Russia Admission Guide",
    titleLines: ["MBBS in Russia", "Admission 2026"],
    chips: ["Eligibility", "Documents", "Timeline"],
    accent: "#D97624",
    prompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Russia university cover as a style reference only for tone, spacing, and professional editorial polish.

Required exact visible text:
MBBS in Russia Admission 2026
Eligibility • Documents • Timeline

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Russia map silhouette in the background
- structured admission-processing scene with passport, checklist, document folder, calendar, student file, hospital building, and boarding-pass cues
- premium editorial infographic style that communicates order, clarity, and momentum
- should feel like a serious admissions guide, not an ad banner

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no fake stamps
- avoid clutter and long tiny text blocks
- ensure strong desktop and mobile legibility`,
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

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderFallbackSvg(cover) {
  const titleSvg = cover.titleLines
    .map(
      (line, index) =>
        `<text x="104" y="${250 + index * 94}" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#16324F">${escapeXml(line)}</text>`
    )
    .join("");

  const chipsSvg = cover.chips
    .map((chip, index) => {
      const x = 104 + index * 230;
      return `
        <rect x="${x}" y="660" rx="20" ry="20" width="200" height="58" fill="#FFFFFF" stroke="${cover.accent}" stroke-width="2" />
        <text x="${x + 100}" y="698" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#16324F">${escapeXml(chip)}</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#F7F2EA"/>
  <rect x="0" y="0" width="1600" height="18" fill="${cover.accent}"/>
  <rect x="1135" y="86" width="360" height="728" rx="36" fill="#16324F"/>
  <circle cx="1438" cy="172" r="58" fill="${cover.accent}" fill-opacity="0.16"/>
  <circle cx="1298" cy="702" r="102" fill="${cover.accent}" fill-opacity="0.12"/>
  <rect x="104" y="126" width="280" height="44" rx="22" fill="${cover.accent}" fill-opacity="0.14"/>
  <text x="124" y="156" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${cover.accent}">${escapeXml(cover.kicker)}</text>
  ${titleSvg}
  <text x="104" y="480" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500" fill="#42566B">Long-form organic-traffic guide for Indian medical aspirants</text>
  <rect x="104" y="560" width="920" height="2" fill="#D7CFC1"/>
  ${chipsSvg}
  <text x="1186" y="214" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">Students Traffic</text>
  <text x="1186" y="254" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Study Abroad Insights</text>
  <rect x="1186" y="310" width="256" height="1" fill="#46627D"/>
  <text x="1186" y="382" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">Why this guide matters</text>
  <text x="1186" y="432" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Clearer decisions.</text>
  <text x="1186" y="468" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Cleaner shortlists.</text>
  <text x="1186" y="504" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Fewer costly mistakes.</text>
  <rect x="1186" y="584" width="210" height="56" rx="18" fill="${cover.accent}"/>
  <text x="1291" y="620" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">Russia 2026</text>
  <rect x="1186" y="678" width="214" height="56" rx="18" fill="#FFFFFF" fill-opacity="0.10" stroke="#7D94AA" stroke-width="2"/>
  <text x="1293" y="714" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Editorial Cover</text>
</svg>`;
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
      let uploadFile = outputFile;
      console.log(`Generating ${cover.slug}...`);
      try {
        await generateImage(cover.prompt, outputFile);
        console.log(`Saved ${basename(outputFile)}`);
      } catch (error) {
        uploadFile = outputFile.replace(/\.jpg$/i, ".svg");
        writeFileSync(uploadFile, renderFallbackSvg(cover));
        console.warn(
          `Gemini generation failed for ${cover.slug}; uploaded fallback cover instead: ${error instanceof Error ? error.message : String(error)}`
        );
      }

      const row = await uploadAndUpdate(cover, uploadFile, client);
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
