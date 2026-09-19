import type { LeadKind, LeadSyncPayload } from "@/lib/lead-sync-payload";

const LEAD_HANDOFF_VERSION = "2026-05";

type LeadHandoffInput = Omit<
  LeadSyncPayload,
  | "handoffVersion"
  | "sourceCategory"
  | "sourceName"
  | "acquisitionChannel"
  | "primaryInterestType"
  | "primaryInterestValue"
> & {
  leadKind: LeadKind;
};

function getSourceCategory(sourcePath: string) {
  if (sourcePath.startsWith("/seminar-2026")) {
    return "seminar";
  }

  if (sourcePath === "/wati") {
    return "whatsapp_inbound";
  }

  if (sourcePath.includes("peer")) {
    return "peer";
  }

  if (
    sourcePath.startsWith("/universities") ||
    sourcePath.startsWith("/countries") ||
    sourcePath.startsWith("/courses")
  ) {
    return "catalog";
  }

  return "website";
}

/**
 * Per-campaign source names for the CRM. The CRM matches these against its
 * `leadSources` table by name (creating the row if new) and shows the result as
 * the lead's Source, so the string must match what the sales team expects to
 * see -- it is a label, not a slug.
 *
 * Only paid landing pages need an entry. Everything else returns undefined and
 * the CRM applies its own default, so this must never return a placeholder.
 */
const SOURCE_NAME_BY_PATH: Record<string, string> = {
  "/free-mbbs-counselling-2026": "MBBS in 10 Lakhs",
};

function getSourceName(sourcePath: string) {
  return SOURCE_NAME_BY_PATH[sourcePath];
}

function getAcquisitionChannel(payload: LeadHandoffInput) {
  if (payload.sourcePath === "/wati") {
    return "whatsapp";
  }

  if (payload.utmMedium?.trim()) {
    return payload.utmMedium.trim().toLowerCase();
  }

  if (payload.utmSource?.trim()) {
    return payload.utmSource.trim().toLowerCase();
  }

  return "direct";
}

function getPrimaryInterest(payload: LeadHandoffInput) {
  if (payload.universitySlug) {
    return {
      primaryInterestType: "university" as const,
      primaryInterestValue: payload.universitySlug,
    };
  }

  if (payload.countrySlug) {
    return {
      primaryInterestType: "country" as const,
      primaryInterestValue: payload.countrySlug,
    };
  }

  if (payload.courseSlug) {
    return {
      primaryInterestType: "course" as const,
      primaryInterestValue: payload.courseSlug,
    };
  }

  if (payload.seminarEvent) {
    return {
      primaryInterestType: "seminar" as const,
      primaryInterestValue: payload.seminarEvent,
    };
  }

  return {
    primaryInterestType: "general" as const,
    primaryInterestValue: payload.sourcePath,
  };
}

export function buildLeadHandoffPayload(
  payload: LeadHandoffInput,
): LeadSyncPayload {
  const primaryInterest = getPrimaryInterest(payload);

  return {
    ...payload,
    handoffVersion: LEAD_HANDOFF_VERSION,
    sourceCategory: getSourceCategory(payload.sourcePath),
    sourceName: getSourceName(payload.sourcePath),
    acquisitionChannel: getAcquisitionChannel(payload),
    primaryInterestType: primaryInterest.primaryInterestType,
    primaryInterestValue: primaryInterest.primaryInterestValue,
  };
}
