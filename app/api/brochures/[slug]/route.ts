import { v2 as cloudinary } from "cloudinary";
import { and, eq } from "drizzle-orm";
import { after, type NextRequest } from "next/server";

import { BROCHURE_ACCESS_COOKIE } from "@/lib/brochure-access";
import { handleBrochureDownload } from "@/lib/brochure-download";
import { getDb } from "@/lib/db/server";
import { brochureDownloads, universities } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { fetchR2Brochure } from "@/lib/r2-storage";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Short-lived signed API URL for the private asset. It is only ever fetched
// here on the server; the student receives the bytes from our own domain.
const DOWNLOAD_URL_TTL_SECONDS = 120;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  return handleBrochureDownload(
    { slug, accessCookie: request.cookies.get(BROCHURE_ACCESS_COOKIE)?.value },
    {
      secret: env.nextAuthSecret,
      async getBrochure(universitySlug) {
        // The build catalogue contains an availability flag only. Read the
        // actual asset identifier from the live database after authorization.
        const db = getDb();
        if (!db) return null;
        const [university] = await db
          .select({ name: universities.name, brochure: universities.brochure })
          .from(universities)
          .where(and(eq(universities.slug, universitySlug), eq(universities.published, true)))
          .limit(1);
        return university?.brochure
          ? { universityName: university.name, brochure: university.brochure }
          : null;
      },
      async fetchAsset(brochure) {
        if (brochure.r2Key) {
          const asset = await fetchR2Brochure(brochure.r2Key).catch(() => undefined);
          if (asset) return asset;
        }
        const url = cloudinary.utils.private_download_url(brochure.publicId, "", {
          resource_type: "raw",
          type: "authenticated",
          expires_at: Math.floor(Date.now() / 1000) + DOWNLOAD_URL_TTL_SECONDS,
        });
        return fetch(url, { cache: "no-store", signal: AbortSignal.timeout(60_000) });
      },
      recordDownload({ leadId, universitySlug }) {
        // Written after the response so the insert never delays the download.
        after(async () => {
          const db = getDb();
          if (!db) return;
          try {
            await db.insert(brochureDownloads).values({ leadId, universitySlug });
          } catch (error) {
            console.error("Brochure download could not be recorded:", universitySlug, error);
          }
        });
      },
    },
  );
}
