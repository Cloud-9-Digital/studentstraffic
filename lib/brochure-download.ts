import {
  brochureContentDisposition,
  verifyBrochureAccessToken,
} from "@/lib/brochure-access";
import type { UniversityBrochure } from "@/lib/data/types";

/**
 * Request logic for GET /api/brochures/[slug], kept free of Next.js and
 * database imports so it can be tested directly. The route file wires in the
 * real catalogue lookup, Cloudinary fetch and download recording.
 */
export type BrochureDownloadDeps = {
  secret: string | undefined;
  getBrochure: (
    slug: string,
  ) => Promise<{ universityName: string; brochure: UniversityBrochure } | null>;
  /** Fetches the private asset server-side; the URL it uses never leaves the server. */
  fetchAsset: (brochure: UniversityBrochure) => Promise<Response>;
  recordDownload: (input: { leadId: number; universitySlug: string }) => Promise<void> | void;
  now?: () => number;
};

const noStoreHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function jsonError(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status, headers: noStoreHeaders });
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function handleBrochureDownload(
  input: { slug: string; accessCookie: string | undefined },
  deps: BrochureDownloadDeps,
): Promise<Response> {
  if (!SLUG_PATTERN.test(input.slug) || input.slug.length > 200) {
    return jsonError(404, "not_found", "Brochure not found.");
  }

  const access = verifyBrochureAccessToken(
    input.accessCookie,
    deps.secret,
    deps.now?.() ?? Date.now(),
  );
  if (!access) {
    return jsonError(401, "lead_required", "Please share your details to download this brochure.");
  }

  const entry = await deps.getBrochure(input.slug);
  if (!entry) {
    return jsonError(404, "not_found", "Brochure not found.");
  }

  let upstream: Response;
  try {
    upstream = await deps.fetchAsset(entry.brochure);
  } catch (error) {
    console.error("Brochure fetch failed:", input.slug, error);
    return jsonError(502, "unavailable", "The brochure is unavailable right now. Please try again.");
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Brochure fetch failed:", input.slug, upstream.status);
    return jsonError(502, "unavailable", "The brochure is unavailable right now. Please try again.");
  }

  try {
    await deps.recordDownload({ leadId: access.leadId, universitySlug: input.slug });
  } catch (error) {
    // A tracking failure must not block a student who already gave their details.
    console.error("Brochure download could not be recorded:", input.slug, error);
  }

  const headers = new Headers({
    ...noStoreHeaders,
    "Content-Type": "application/pdf",
    "Content-Disposition": brochureContentDisposition(entry.universityName),
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length && /^\d+$/.test(length)) headers.set("Content-Length", length);

  return new Response(upstream.body, { status: 200, headers });
}
