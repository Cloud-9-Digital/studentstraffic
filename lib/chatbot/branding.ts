/**
 * Client-safe chatbot constants. Kept apart from config.ts so the browser
 * bundle never pulls in the server-side model and key lookups.
 */

export const CHATBOT_NAME = "Mira";

/**
 * Short on purpose. The empty state is an invitation, not a pitch — an opening
 * line that argues for its own trustworthiness puts the claim before the
 * visitor has asked anything, and the answers make that case better than the
 * greeting can.
 */
export const CHATBOT_GREETING =
  "Hi, I'm Mira. Ask me anything about education — courses, exams, universities, or studying abroad.";

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
