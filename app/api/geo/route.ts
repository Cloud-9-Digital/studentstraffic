import { getGeoCountry } from "@/lib/lead-residence";

/**
 * The visitor's country from Vercel's IP geolocation, used only to preselect
 * "Country of residence" on lead forms. Public pages are cached and the proxy
 * does not run on them, so the forms cannot read the header themselves; they
 * call this once, on the first interaction with a form, not on page view.
 */
export async function GET(request: Request) {
  return Response.json(
    { country: getGeoCountry(request.headers) ?? null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
