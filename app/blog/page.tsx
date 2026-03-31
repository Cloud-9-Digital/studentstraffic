import Link from "next/link";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Rss } from "lucide-react";
import readingTime from "reading-time";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";
import { categoryToSlug } from "@/app/blog/category/[slug]/page";

export const metadata: Metadata = {
  title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
  description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
  alternates: {
    canonical: absoluteUrl("/blog"),
    types: { "application/rss+xml": absoluteUrl("/blog/feed.xml") },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Students Traffic",
    url: absoluteUrl("/blog"),
    title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
    description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
    description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
  },
};

const getPosts = unstable_cache(
  async () => {
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
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  },
  ["blog-listing"],
  { tags: ["blog"], revalidate: 3600 }
);

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

// ── Category colour map ────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { pill: string; dot: string; placeholder: string }> = {
  "MBBS Abroad":       { pill: "bg-primary/10 text-primary border border-primary/20",            dot: "bg-primary",     placeholder: "from-primary/15 via-primary/8 to-primary/3" },
  "Country Guide":     { pill: "bg-amber-100 text-amber-800 border border-amber-200",            dot: "bg-amber-500",   placeholder: "from-amber-500/15 via-amber-400/8 to-amber-300/3" },
  "NMC & Licensing":   { pill: "bg-blue-100 text-blue-800 border border-blue-200",               dot: "bg-blue-500",    placeholder: "from-blue-500/15 via-blue-400/8 to-blue-300/3" },
  "University Guide":  { pill: "bg-violet-100 text-violet-800 border border-violet-200",         dot: "bg-violet-500",  placeholder: "from-violet-500/15 via-violet-400/8 to-violet-300/3" },
  "Admissions":        { pill: "bg-emerald-100 text-emerald-800 border border-emerald-200",      dot: "bg-emerald-500", placeholder: "from-emerald-500/15 via-emerald-400/8 to-emerald-300/3" },
  "Student Life":      { pill: "bg-rose-100 text-rose-800 border border-rose-200",               dot: "bg-rose-500",    placeholder: "from-rose-500/15 via-rose-400/8 to-rose-300/3" },
  "Fees & Scholarships":{ pill: "bg-orange-100 text-orange-800 border border-orange-200",        dot: "bg-orange-500",  placeholder: "from-orange-500/15 via-orange-400/8 to-orange-300/3" },
  "Tips & Advice":     { pill: "bg-teal-100 text-teal-800 border border-teal-200",               dot: "bg-teal-500",    placeholder: "from-teal-500/15 via-teal-400/8 to-teal-300/3" },
};
const DEFAULT_STYLE = { pill: "bg-muted text-muted-foreground border border-border", dot: "bg-muted-foreground", placeholder: "from-muted to-background" };

function getCategoryStyle(cat: string | null) {
  return cat ? (CATEGORY_STYLES[cat] ?? DEFAULT_STYLE) : DEFAULT_STYLE;
}

// ── Sub-components ────────────────────────────────────────────────────────

function CategoryPill({ category }: { category: string }) {
  const style = getCategoryStyle(category);
  return (
    <Link
      href={`/blog/category/${categoryToSlug(category)}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${style.pill} hover:opacity-80 transition-opacity`}
    >
      <span className={`size-1.5 rounded-full shrink-0 ${style.dot}`} />
      {category}
    </Link>
  );
}

function PlaceholderCover({ category, title }: { category: string | null; title: string }) {
  const style = getCategoryStyle(category);
  const initial = title.charAt(0).toUpperCase();
  return (
    <div className={`h-full w-full bg-gradient-to-br ${style.placeholder} flex items-center justify-center`}>
      <span className="font-display text-[8rem] font-bold leading-none select-none text-foreground/[0.06]">
        {initial}
      </span>
    </div>
  );
}

type PostRow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  category: string | null;
  content: string;
  publishedAt: Date | string | null;
};

function PostCard({ post }: { post: PostRow }) {
  const mins = Math.ceil(readingTime(post.content).minutes);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/25 hover:shadow-sm transition-all duration-200"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderCover category={post.category} title={post.title} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <div className="mb-3">
            <CategoryPill category={post.category} />
          </div>
        )}
        <h2 className="font-display text-[1.05rem] font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] text-muted-foreground/55">
          {post.publishedAt && <span>{fmtDate.format(new Date(post.publishedAt!))}</span>}
          <span>·</span>
          <span>{mins} min read</span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-background">

      {/* ── Masthead ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 py-10 md:flex-row md:items-end md:justify-between md:py-14">
            <div>
              <h1 className="font-display text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white md:text-[3rem] lg:text-[3.5rem]">
                Guides for <span className="italic text-accent">MBBS</span> abroad
              </h1>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="max-w-[260px] text-[13px] leading-relaxed text-white/45 md:text-right">
                Research-backed guides on universities, fees, admission, and life on campus.
              </p>
              <a
                href="/blog/feed.xml"
                className="flex items-center gap-1.5 text-[11px] font-medium text-white/30 hover:text-accent transition-colors"
              >
                <Rss className="size-3" />
                RSS
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {posts.length === 0 ? (
          <p className="py-32 text-center text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <div className="py-10 pb-20 md:pb-28">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
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
            "@id": absoluteUrl("/blog"),
            name: "Blog — MBBS Abroad Guides & Tips",
            description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life.",
            url: absoluteUrl("/blog"),
            inLanguage: "en-IN",
            isPartOf: { "@type": "WebSite", "@id": absoluteUrl("/"), name: "Students Traffic", url: absoluteUrl("/") },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: posts.map((post, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: absoluteUrl(`/blog/${post.slug}`),
                name: post.title,
              })),
            },
          }),
        }}
      />
    </main>
  );
}
