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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
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
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

export function trackMetaCustomEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackCustom", event, params);
}

export function trackLeadFormSubmit(params?: Record<string, unknown>) {
  trackEvent(analyticsEvents.leadFormSubmit, params);
  trackMetaCustomEvent(analyticsEvents.leadFormSubmit, params);
}

export function trackLeadFormSuccess(params?: Record<string, unknown>) {
  trackEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaCustomEvent(analyticsEvents.leadFormSuccess, params);
  trackMetaStandardEvent("Lead", params);
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
