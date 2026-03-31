import Link from "next/link";
import Image from "next/image";
import { desc, eq, and } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import readingTime from "reading-time";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";

// Canonical category definitions — slug → display name
const CATEGORIES: Record<string, string> = {
  "mbbs-abroad":        "MBBS Abroad",
  "university-guide":   "University Guide",
  "country-guide":      "Country Guide",
  "admissions":         "Admissions",
  "student-life":       "Student Life",
  "fees-scholarships":  "Fees & Scholarships",
  "nmc-licensing":      "NMC & Licensing",
  "tips-advice":        "Tips & Advice",
};

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&\s*/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

const getPostsByCategory = unstable_cache(
  async (categoryName: string) => {
    const db = getDb();
    if (!db) return [];
    return db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverUrl: blogPosts.coverUrl,
        category: blogPosts.category,
        content: blogPosts.content,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.category, categoryName)))
      .orderBy(desc(blogPosts.publishedAt));
  },
  ["blog-category"],
  { tags: ["blog"], revalidate: 3600 }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = CATEGORIES[slug];
  if (!categoryName) return {};

  const title = `${categoryName} — Blog | Students Traffic`;
  const description = `All articles in the "${categoryName}" category — guides and insights for Indian students planning to study MBBS abroad.`;
  const canonicalUrl = absoluteUrl(`/blog/category/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Students Traffic",
      url: canonicalUrl,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "long", year: "numeric",
});

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = CATEGORIES[slug];
  if (!categoryName) notFound();

  const posts = await getPostsByCategory(categoryName);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface-dark py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Link
            href="/blog"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="size-4" /> All posts
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
            Category
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {categoryName}
          </h1>
          <p className="mt-3 text-base text-white/70">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">
            No posts in this category yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                {post.coverUrl ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-primary/8" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        {fmtDate.format(new Date(post.publishedAt!))}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {Math.ceil(readingTime(post.content).minutes)} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${categoryName} — Students Traffic Blog`,
            url: absoluteUrl(`/blog/category/${slug}`),
            inLanguage: "en-IN",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
                { "@type": "ListItem", position: 3, name: categoryName, item: absoluteUrl(`/blog/category/${slug}`) },
              ],
            },
          }),
        }}
      />
    </main>
  );
}
