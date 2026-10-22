import { getAppleAppSiteAssociation } from "@/lib/app-links";

// Served without an extension, as Apple requires, with a JSON content type.
// Apple fetches it through its CDN on install and periodically afterwards.
export function GET() {
  return Response.json(getAppleAppSiteAssociation(), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
