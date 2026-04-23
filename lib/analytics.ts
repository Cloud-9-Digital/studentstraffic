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
  attempt = 0
) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq(method, event, cleanParams(params));
    return;
  }

  if (attempt >= 20) return;

  window.setTimeout(
    () => trackMetaEvent(method, event, params, attempt + 1),
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
  params?: Record<string, unknown>
) {
  trackMetaEvent("track", event, params);
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

export function trackLeadFormSuccess(params?: Record<string, unknown>) {
  trackEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaCustomEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaStandardEvent("Lead", {
    ...params,
    content_name: "Lead form submitted",
    content_category: "Website lead",
  });
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

  void fetch("/api/track-contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
    keepalive: true,
  }).catch(() => undefined);
}
