import { and, desc, eq, gte } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/constants";

// Google News sitemap — only articles published in the last 48 hours are eligible.
// Submit this URL in Google News Publisher Center after approval.

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const db = getDb();

  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const posts = db
    ? await db
        .select({
          slug: blogPosts.slug,
          title: blogPosts.title,
          publishedAt: blogPosts.publishedAt,
        })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, "published"),
            gte(blogPosts.publishedAt, twoDaysAgo),
          ),
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(1000)
    : [];

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : new Date().toISOString();
      return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteConfig.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
