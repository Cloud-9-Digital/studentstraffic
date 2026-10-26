import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Brochure access cookie.
 *
 * After a student submits the lead form once (ctaVariant "brochure_download"),
 * the server action sets this httpOnly cookie. Every later brochure download on
 * the site skips the form while the cookie is valid. The value carries the
 * lead id so each download can be recorded against the lead, and is
 * HMAC-signed so it cannot be forged or pointed at another lead.
 *
 * Format: `v1.<leadId>.<issuedAtSeconds>.<base64url signature>`
 */

export const BROCHURE_CTA_VARIANT = "brochure_download";
export const BROCHURE_ACCESS_COOKIE = "st_brochure_access";
export const BROCHURE_ACCESS_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

export const brochureAccessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: BROCHURE_ACCESS_MAX_AGE_SECONDS,
};

const TOKEN_VERSION = "v1";
// Domain separation: the shared server secret is never used directly as this
// cookie's HMAC key, so a signature here is useless anywhere else.
const KEY_CONTEXT = "studentstraffic:brochure-access:v1";
// Tolerates small clock differences between server instances.
const MAX_CLOCK_SKEW_SECONDS = 5 * 60;

function deriveKey(secret: string) {
  return createHmac("sha256", secret).update(KEY_CONTEXT).digest();
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", deriveKey(secret)).update(payload).digest("base64url");
}

export function signBrochureAccessToken(
  leadId: number,
  secret: string,
  nowMs = Date.now(),
): string {
  if (!Number.isSafeInteger(leadId) || leadId <= 0) {
    throw new Error("Brochure access requires a positive integer lead id.");
  }
  if (!secret) {
    throw new Error("Brochure access requires a signing secret.");
  }

  const payload = `${TOKEN_VERSION}.${leadId}.${Math.floor(nowMs / 1000)}`;
  return `${payload}.${sign(payload, secret)}`;
}

export type BrochureAccess = { leadId: number; issuedAt: number };

export function verifyBrochureAccessToken(
  token: string | undefined | null,
  secret: string | undefined | null,
  nowMs = Date.now(),
): BrochureAccess | null {
  if (!token || !secret || token.length > 200) return null;

  const parts = token.split(".");
  if (parts.length !== 4) return null;

  const [version, leadIdRaw, issuedAtRaw, signature] = parts;
  if (version !== TOKEN_VERSION) return null;
  if (!/^[1-9]\d{0,15}$/.test(leadIdRaw) || !/^\d{1,12}$/.test(issuedAtRaw)) {
    return null;
  }

  const expected = Buffer.from(sign(`${version}.${leadIdRaw}.${issuedAtRaw}`, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  const leadId = Number(leadIdRaw);
  const issuedAt = Number(issuedAtRaw);
  const nowSeconds = Math.floor(nowMs / 1000);
  if (!Number.isSafeInteger(leadId)) return null;
  if (issuedAt > nowSeconds + MAX_CLOCK_SKEW_SECONDS) return null;
  if (nowSeconds - issuedAt > BROCHURE_ACCESS_MAX_AGE_SECONDS) return null;

  return { leadId, issuedAt };
}

/** Builds a safe `Content-Disposition` for "<University name> brochure.pdf". */
export function brochureContentDisposition(universityName: string) {
  const name = `${universityName.replace(/[\r\n"\\/]+/g, " ").replace(/\s+/g, " ").trim() || "University"} brochure.pdf`;
  // ASCII fallback for old clients; filename* carries the exact UTF-8 name.
  const asciiName = name.normalize("NFKD").replace(/[^\x20-\x7e]/g, "").replace(/\s+/g, " ").trim();
  const encoded = encodeURIComponent(name).replace(/['()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${asciiName || "brochure.pdf"}"; filename*=UTF-8''${encoded}`;
}
