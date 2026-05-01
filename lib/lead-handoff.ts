import type { LeadKind, LeadSyncPayload } from "@/lib/lead-sync-payload";

const LEAD_HANDOFF_VERSION = "2026-05";

type LeadHandoffInput = Omit<
  LeadSyncPayload,
  | "handoffVersion"
  | "sourceCategory"
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
    acquisitionChannel: getAcquisitionChannel(payload),
    primaryInterestType: primaryInterest.primaryInterestType,
    primaryInterestValue: primaryInterest.primaryInterestValue,
  };
}
