export const analyticsEvents = {
  heroConsultationClick: "hero_consultation_click",
  finderFilterSubmit: "finder_filter_submit",
  finderUniversityClick: "finder_university_click",
  leadFormSubmit: "lead_form_submit",
  leadFormSuccess: "lead_form_success",
  landingUniversityClick: "landing_university_click",
  contactCallClick: "contact_call_click",
  contactWhatsappClick: "contact_whatsapp_click",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

type MetaTrackMethod = "track" | "trackCustom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
}

function trackMetaEvent(
  method: MetaTrackMethod,
  event: string,
  params?: Record<string, unknown>,
  attempt = 0,
  eventId?: string
) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    // The 4th argument is fbq's options bag. `eventID` here must match the
    // `event_id` the server sends to the Conversions API, or Meta counts the
    // same conversion twice.
    if (eventId) {
      window.fbq(method, event, cleanParams(params), { eventID: eventId });
    } else {
      window.fbq(method, event, cleanParams(params));
    }
    return;
  }

  if (attempt >= 20) return;

  window.setTimeout(
    () => trackMetaEvent(method, event, params, attempt + 1, eventId),
    attempt < 5 ? 100 : 250
  );
}

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export function trackMetaStandardEvent(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  trackMetaEvent("track", event, params, 0, eventId);
}

export function trackMetaCustomEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
) {
  trackMetaEvent("trackCustom", event, params);
}

export function trackLeadFormSubmit(params?: Record<string, unknown>) {
  trackEvent(analyticsEvents.leadFormSubmit, params);
  trackMetaCustomEvent(analyticsEvents.leadFormSubmit, params);
}

export function trackLeadFormSuccess(
  params?: Record<string, unknown>,
  eventId?: string
) {
  trackEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaCustomEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaStandardEvent(
    "Lead",
    {
      ...params,
      content_name: "Lead form submitted",
      content_category: "Website lead",
    },
    eventId
  );
}

export function trackContactClick(
  channel: "call" | "whatsapp",
  params?: Record<string, unknown>
) {
  const event =
    channel === "call"
      ? analyticsEvents.contactCallClick
      : analyticsEvents.contactWhatsappClick;

  trackEvent(event, params);
  trackMetaCustomEvent(event, params);
}

export function trackContactClickServer(params: {
  channel: "call" | "whatsapp";
  location: string;
  href?: string;
  pagePath: string;
  pageUrl?: string;
}) {
  if (typeof window === "undefined") return;

  const dedupeKey = [
    "contact-click",
    params.channel,
    params.location,
    params.pagePath,
    params.href ?? "",
  ].join(":");

  try {
    const previousTrackedAt = window.sessionStorage.getItem(dedupeKey);
    const now = Date.now();

    if (previousTrackedAt && now - Number(previousTrackedAt) < 30 * 60 * 1000) {
      return;
    }

    window.sessionStorage.setItem(dedupeKey, String(now));
  } catch {
    // Ignore storage failures and continue to best-effort tracking.
  }

  void fetch("/api/track-contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
    keepalive: true,
  }).catch(() => undefined);
}
