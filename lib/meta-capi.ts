import "server-only";

import { createHash } from "node:crypto";

import { env } from "@/lib/env";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

/**
 * Meta Conversions API — the server-side mirror of the browser pixel.
 *
 * Why it exists: the browser pixel alone loses a large share of conversions to
 * ad blockers, ITP/ATT and people who close the tab before `lazyOnload` fires.
 * This sends the same `Lead` event from the server, where none of that applies.
 *
 * Deduplication: the browser and the server both send `Lead` for one submission.
 * Meta collapses them into one conversion when they share an `event_id` AND an
 * `event_name`. `submitLeadAction` mints the id, passes it here, and forwards it
 * to `/thank-you`, where the pixel sends it as `eventID`. If that id is ever
 * dropped on either side, conversions double-count — so treat it as load-bearing.
 */

const GRAPH_API_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 5_000;

/** Meta requires SHA-256 of normalised values for every PII field. */
function hash(value: string | undefined) {
  const normalised = value?.trim().toLowerCase();
  if (!normalised) return undefined;
  return createHash("sha256").update(normalised).digest("hex");
}

/** Phones hash as digits only, including country code, with no `+` or spaces. */
function hashPhone(phone: string | undefined) {
  const digits = phone?.replace(/\D/g, "");
  if (!digits) return undefined;
  return createHash("sha256").update(digits).digest("hex");
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: undefined, last: undefined };
  if (parts.length === 1) return { first: parts[0], last: undefined };
  return { first: parts[0], last: parts[parts.length - 1] };
}

function compact<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null),
  );
}

export type MetaCapiResult =
  | { status: "sent"; eventsReceived?: number }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

export async function sendMetaLeadEvent(
  payload: LeadSyncPayload,
): Promise<MetaCapiResult> {
  if (!env.hasMetaCapiConfig) {
    return { status: "skipped", reason: "missing_meta_capi_access_token" };
  }

  if (!payload.metaEventId) {
    // Without a shared id the server copy would double-count against the pixel.
    return { status: "skipped", reason: "missing_event_id" };
  }

  const { first, last } = splitName(payload.fullName);

  const userData = compact({
    em: hash(payload.email),
    ph: hashPhone(payload.phone),
    fn: hash(first),
    ln: hash(last),
    st: hash(payload.userState?.replace(/\s+/g, "")),
    country: hash("in"),
    // fbc/fbp and the IP/UA pair are unhashed by design — Meta matches on them raw.
    fbc: payload.fbc,
    fbp: payload.fbp,
    client_ip_address: payload.ipAddress,
    client_user_agent: payload.userAgent,
  });

  const body = compact({
    data: [
      compact({
        event_name: "Lead",
        event_time: Math.floor(Date.parse(payload.submittedAt) / 1000) || Math.floor(Date.now() / 1000),
        event_id: payload.metaEventId,
        event_source_url: payload.sourceUrl ?? `${env.siteUrl}${payload.sourcePath}`,
        action_source: "website",
        user_data: userData,
        custom_data: compact({
          content_name: "Lead form submitted",
          content_category: "Website lead",
          source_path: payload.sourcePath,
          cta_variant: payload.ctaVariant,
          lead_kind: payload.leadKind,
        }),
      }),
    ],
    test_event_code: env.metaCapiTestEventCode,
  });

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${env.metaPixelId}/events?access_token=${encodeURIComponent(env.metaCapiAccessToken ?? "")}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        status: "failed",
        error: `Meta CAPI responded ${response.status}: ${detail.slice(0, 300)}`,
      };
    }

    const json = (await response.json().catch(() => null)) as
      | { events_received?: number }
      | null;

    return { status: "sent", eventsReceived: json?.events_received };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "unknown Meta CAPI error",
    };
  }
}
