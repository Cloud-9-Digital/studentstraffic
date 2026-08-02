import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/llms-full.txt"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "GoogleOther", "Applebot"],
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
      },
      {
        userAgent: ["Claude-SearchBot", "Claude-User", "ClaudeBot", "anthropic-ai"],
        allow: "/",
      },
      {
        userAgent: ["PerplexityBot"],
        allow: "/",
      },
      {
        userAgent: ["Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      absoluteUrl("/universities/sitemap/0.xml"),
      absoluteUrl("/programs/sitemap/0.xml"),
      absoluteUrl("/news-sitemap.xml"),
    ],
  };
}
