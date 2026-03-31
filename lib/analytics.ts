export const analyticsEvents = {
  heroConsultationClick: "hero_consultation_click",
  finderFilterSubmit: "finder_filter_submit",
  finderUniversityClick: "finder_university_click",
  leadFormSubmit: "lead_form_submit",
  leadFormSuccess: "lead_form_success",
  landingUniversityClick: "landing_university_click",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
