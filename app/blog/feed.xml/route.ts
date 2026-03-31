import { desc, eq } from "drizzle-orm";

import { siteConfig } from "@/lib/constants";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";


export async function GET() {
  const db = getDb();
  const posts = db
    ? await db
        .select({
          slug: blogPosts.slug,
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
          category: blogPosts.category,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(50)
    : [];

  const siteUrl = absoluteUrl("/");
  const blogUrl = absoluteUrl("/blog");
  const feedUrl = absoluteUrl("/blog/feed.xml");
  const buildDate = new Date().toUTCString();
  const lastBuildDate = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toUTCString()
    : buildDate;

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : buildDate;
      const description = post.excerpt
        ? `<![CDATA[${post.excerpt}]]>`
        : "";
      const category = post.category
        ? `<category><![CDATA[${post.category}]]></category>`
        : "";
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${category}
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${siteConfig.name} — Blog]]></title>
    <link>${blogUrl}</link>
    <description><![CDATA[Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life for Indian students.]]></description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <managingEditor>${siteConfig.email} (${siteConfig.name})</managingEditor>
    <webMaster>${siteConfig.email} (${siteConfig.name})</webMaster>
    <copyright>© ${new Date().getFullYear()} ${siteConfig.name}</copyright>
    <image>
      <url>${absoluteUrl("/images/logo.png")}</url>
      <title>${siteConfig.name}</title>
      <link>${siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
