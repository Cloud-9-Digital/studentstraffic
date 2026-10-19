import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

const PLACEHOLDERS = new Set(["NA", "N/A", "-"]);

function value(input?: string | null, limit = 2000): string | undefined {
  const trimmed = input?.trim();
  return trimmed && !PLACEHOLDERS.has(trimmed.toUpperCase())
    ? trimmed.slice(0, limit)
    : undefined;
}

/** The scoped CRM API has a deliberately smaller contract than the legacy site intake. */
export function buildCrmCapturePayload(payload: LeadSyncPayload) {
  const isWati = payload.sourcePath === "/wati" || payload.ctaVariant === "wati_inbound";
  const isSeminar = !isWati &&
    (Boolean(value(payload.seminarEvent)) || payload.sourcePath.includes("/seminar-2026/register"));
  const source = isWati ? "WATI" : isSeminar ? "Seminar 2026"
    : value(payload.sourceName, 60)
      ?? (payload.sourcePath === "/free-mbbs-counselling-2026" ? "MBBS in 10 Lakhs" : "Website");

  // Field definitions and dropdown options differ by CRM organization. Sending an
  // unchecked `fields` value can reject the whole lead, so retain those details
  // in the timeline until the organization's active fields have been verified.
  // Put the visitor's message first; keep the whole note within the API limit.
  const context = [
    value(payload.notes, 2000) && `Notes: ${value(payload.notes, 2000)}`,
    `Website lead ID: ${payload.websiteLeadId ?? "unknown"}`,
    `Submitted: ${payload.submittedAt}`,
    `Source path: ${payload.sourcePath}`,
    `CTA: ${payload.ctaVariant}`,
    payload.leadKind && `Lead kind: ${payload.leadKind}`,
    payload.sourceCategory && `Source category: ${payload.sourceCategory}`,
    payload.acquisitionChannel && `Acquisition channel: ${payload.acquisitionChannel}`,
    payload.primaryInterestType && `Interest type: ${payload.primaryInterestType}`,
    payload.primaryInterestValue && `Interest: ${payload.primaryInterestValue}`,
    value(payload.fatherName) && `Father: ${value(payload.fatherName)}`,
    value(payload.alternatePhone) && `Alternate phone: ${value(payload.alternatePhone)}`,
    value(payload.city) && `City: ${value(payload.city)}`,
    value(payload.userState) && `State: ${value(payload.userState)}`,
    value(payload.courseSlug) && `Course: ${value(payload.courseSlug)}`,
    payload.interestedCountry && `Interested country: ${payload.interestedCountry}`,
    payload.countrySlug && `Country slug: ${payload.countrySlug}`,
    payload.universitySlug && `University slug: ${payload.universitySlug}`,
    payload.budgetRange && `Budget: ${payload.budgetRange}`,
    payload.seminarEvent && `Seminar: ${payload.seminarEvent}`,
    payload.neetScore != null && `NEET score: ${payload.neetScore}`,
    payload.neetCategory && `NEET category: ${payload.neetCategory}`,
    payload.seminarAttendeeCount !== undefined && `Seminar attendees: ${payload.seminarAttendeeCount}`,
    payload.needsFmgeSession != null && `FMGE session: ${payload.needsFmgeSession ? "yes" : "no"}`,
    value(payload.documentType) && `Document type: ${value(payload.documentType)}`,
    value(payload.documentUrl) && `Document URL: ${value(payload.documentUrl)}`,
    payload.gclid && `GCLID: ${payload.gclid}`,
    payload.fbclid && `FBCLID: ${payload.fbclid}`,
    payload.gbraid && `GBRAID: ${payload.gbraid}`,
    payload.wbraid && `WBRAID: ${payload.wbraid}`,
    payload.ttclid && `TTCLID: ${payload.ttclid}`,
    payload.fbc && `FBC: ${payload.fbc}`,
    payload.fbp && `FBP: ${payload.fbp}`,
    payload.metaEventId && `Meta event ID: ${payload.metaEventId}`,
    payload.sourceQuery && `Source query: ${JSON.stringify(payload.sourceQuery).slice(0, 500)}`,
    payload.clientContext && `Client context: ${JSON.stringify(payload.clientContext).slice(0, 500)}`,
    value(payload.userAgent, 300) && `User agent: ${value(payload.userAgent, 300)}`,
    value(payload.ipAddress, 100) && `IP: ${value(payload.ipAddress, 100)}`,
    value(payload.acceptLanguage, 100) && `Language: ${value(payload.acceptLanguage, 100)}`,
  ].filter(Boolean).join("\n").slice(0, 5000);

  const attribution = {
    pageUrl: value(payload.sourceUrl, 2000),
    pageTitle: value(payload.pageTitle, 300),
    referrer: value(payload.referrer ?? payload.documentReferrer, 2000),
    utmSource: value(payload.utmSource, 200),
    utmMedium: value(payload.utmMedium, 200),
    utmCampaign: value(payload.utmCampaign, 200),
    utmTerm: value(payload.utmTerm, 200),
    utmContent: value(payload.utmContent, 200),
    formName: value(payload.ctaVariant, 200),
  };

  return {
    name: payload.fullName.trim().slice(0, 200),
    phone: payload.phone.trim().slice(0, 32),
    email: value(payload.email, 254),
    source,
    notes: context,
    attribution,
    ...(payload.websiteLeadId ? { externalId: `studentstraffic:${payload.websiteLeadId}` } : {}),
  };
}
