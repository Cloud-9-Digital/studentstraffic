import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["Googlebot", "Bingbot", "GoogleOther", "Applebot"],
        allow: "/",
      },
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
      },
      {
        userAgent: ["Claude-SearchBot", "Claude-User"],
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
