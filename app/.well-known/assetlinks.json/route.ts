import { getAndroidAssetLinks } from "@/lib/app-links";

// Android verifies App Links against this file at install time.
export function GET() {
  return Response.json(getAndroidAssetLinks(), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
