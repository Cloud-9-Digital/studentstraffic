import { absoluteUrl } from "@/lib/metadata";

// Private and account surfaces. Every group repeats this list: a crawler obeys
// only the most specific group that names it (RFC 9309), so a named group with
// a bare `Allow: /` would let that bot into /admin and /api.
// /search and /thank-you stay crawlable so their `noindex` can be read.
export const PRIVATE_PATHS = [
  "/admin",
  "/api/",
  "/dashboard",
  "/calls/",
  "/login",
  "/register",
];

// Search engines, answer engines and AI assistants. All of them may read the
// public catalogue; the citation and training bots are allowed deliberately,
// because being quoted by assistants is a lead source for this site.
export const SEARCH_AND_AI_AGENTS = [
  // Search engines
  "Googlebot",
  "Bingbot",
  "GoogleOther",
  "Applebot",
  "DuckDuckBot",
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google, Apple, Meta, Amazon, Mistral, DuckDuckGo, Common Crawl
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "MistralAI-User",
  "DuckAssistBot",
  "CCBot",
];

// Content Signals (https://contentsignals.org): how crawled content may be
// used once accessed. Search, AI answers (RAG/grounding) and training are all
// granted, matching the allow-everyone policy above. Per contentsignals.org the
// line sits inside each User-Agent group, right after the User-Agent lines.
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

const SITEMAPS = [
  "/sitemap.xml",
  "/universities/sitemap/0.xml",
  "/programs/sitemap/0.xml",
  "/compare/sitemap/0.xml",
  "/news-sitemap.xml",
];

function group(userAgents: string[], disallow: string[]) {
  return [
    ...userAgents.map((agent) => `User-Agent: ${agent}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    ...disallow.map((path) => `Disallow: ${path}`),
  ];
}

/**
 * robots.txt, written by hand because MetadataRoute.Robots has no field for
 * Content-Signal. Apart from the Content-Signal lines the output matches what
 * the metadata route generated (same order, `User-Agent` casing and blank
 * lines), so crawler behaviour is unchanged.
 */
export function buildRobotsTxt() {
  const lines = [
    // The full catalogue dump is for AI agents; generic scrapers get /llms.txt.
    ...group(["*"], [...PRIVATE_PATHS, "/llms-full.txt"]),
    "",
    ...group(SEARCH_AND_AI_AGENTS, PRIVATE_PATHS),
    "",
    ...SITEMAPS.map((path) => `Sitemap: ${absoluteUrl(path)}`),
  ];
  return `${lines.join("\n")}\n`;
}
