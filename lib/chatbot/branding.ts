/**
 * Client-safe chatbot constants. Kept apart from config.ts so the browser
 * bundle never pulls in the server-side model and key lookups.
 */

export const CHATBOT_NAME = "Mira";

export const CHATBOT_GREETING =
  "Hi — I'm Mira. Ask me anything about studying abroad: universities, fees, intakes, eligibility. I'll answer from what Students Traffic has actually verified.";

/**
 * Routes where the assistant stays out of the way.
 *
 * Admin, dashboard and auth are not visitor surfaces. The bespoke admission
 * landing pages are deliberately single-task — one form, no chrome — and a
 * floating bubble there competes with the form it exists to feed.
 */
const HIDDEN_PREFIXES = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/calls",
  "/seminar-2026",
  "/mbbs-abroad",
];

const HIDDEN_EXACT = new Set([
  "/free-mbbs-counselling-2026",
  "/mbbs-in-russia-admission",
  "/mbbs-in-vietnam-admission",
  "/mbbs-in-georgia-admission",
  "/thank-you",
]);

export function showsChatbot(pathname: string) {
  if (HIDDEN_EXACT.has(pathname)) return false;
  return !HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
