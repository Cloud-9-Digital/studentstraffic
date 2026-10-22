import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/metadata";

// Private and account surfaces. Every group repeats this list: a crawler obeys
// only the most specific group that names it (RFC 9309), so a named group with
// a bare `allow: "/"` would let that bot into /admin and /api.
// /search and /thank-you stay crawlable so their `noindex` can be read.
const PRIVATE_PATHS = [
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
const SEARCH_AND_AI_AGENTS = [
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The full catalogue dump is for AI agents; generic scrapers get /llms.txt.
        disallow: [...PRIVATE_PATHS, "/llms-full.txt"],
      },
      {
        userAgent: SEARCH_AND_AI_AGENTS,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      absoluteUrl("/universities/sitemap/0.xml"),
      absoluteUrl("/programs/sitemap/0.xml"),
      absoluteUrl("/compare/sitemap/0.xml"),
      absoluteUrl("/news-sitemap.xml"),
    ],
  };
}
