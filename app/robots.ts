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
        userAgent: ["GPTBot", "OAI-SearchBot"],
        disallow: ["/"],
      },
      {
        userAgent: ["Claude-SearchBot"],
        disallow: ["/"],
      },
      {
        userAgent: ["PerplexityBot"],
        disallow: ["/"],
      },
      {
        userAgent: ["Google-Extended"],
        disallow: ["/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
