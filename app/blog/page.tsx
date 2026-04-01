import Link from "next/link";
import Image from "next/image";
import { desc, eq, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Rss, ChevronLeft, ChevronRight } from "lucide-react";

import { ResearchNextSteps } from "@/components/site/research-next-steps";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";
import { categoryToSlug } from "@/app/blog/category/[slug]/page";
import { contentAuthorName, contentAuthorSlug } from "@/lib/content-governance";

const PAGE_SIZE = 12;

// ── Data ──────────────────────────────────────────────────────────────────

const getPostsPage = unstable_cache(
  async (page: number) => {
    const db = getDb();
    if (!db) return { posts: [], total: 0 };
    const offset = (page - 1) * PAGE_SIZE;
    const [posts, [{ total }]] = await Promise.all([
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          coverUrl: blogPosts.coverUrl,
          category: blogPosts.category,
          readingTimeMinutes: blogPosts.readingTimeMinutes,
          publishedAt: blogPosts.publishedAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(PAGE_SIZE)
        .offset(offset),
      db
        .select({ total: sql<number>`cast(count(*) as int)` })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published")),
    ]);
    return { posts, total };
  },
  ["blog-listing-page"],
  { tags: ["blog"], revalidate: 3600 }
);

// ── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { total } = await getPostsPage(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const canonical = page === 1 ? absoluteUrl("/blog") : absoluteUrl(`/blog?page=${page}`);

  return {
    title: page === 1
      ? "Blog — MBBS Abroad Guides & Tips | Students Traffic"
      : `Blog — Page ${page} of ${totalPages} | Students Traffic`,
    description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
    alternates: {
      canonical,
      types: { "application/rss+xml": absoluteUrl("/blog/feed.xml") },
      ...(page > 1 ? { prev: absoluteUrl(page === 2 ? "/blog" : `/blog?page=${page - 1}`) } : {}),
      ...(page < totalPages ? { next: absoluteUrl(`/blog?page=${page + 1}`) } : {}),
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Students Traffic",
      url: canonical,
      title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
      description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
      description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
    },
  };
}

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

// ── Category colour map ────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { pill: string; dot: string; placeholder: string }> = {
  "MBBS Abroad":        { pill: "bg-primary/10 text-primary border border-primary/20",           dot: "bg-primary",     placeholder: "from-primary/15 via-primary/8 to-primary/3" },
  "Country Guide":      { pill: "bg-amber-100 text-amber-800 border border-amber-200",           dot: "bg-amber-500",   placeholder: "from-amber-500/15 via-amber-400/8 to-amber-300/3" },
  "NMC & Licensing":    { pill: "bg-blue-100 text-blue-800 border border-blue-200",              dot: "bg-blue-500",    placeholder: "from-blue-500/15 via-blue-400/8 to-blue-300/3" },
  "University Guide":   { pill: "bg-violet-100 text-violet-800 border border-violet-200",        dot: "bg-violet-500",  placeholder: "from-violet-500/15 via-violet-400/8 to-violet-300/3" },
  "Admissions":         { pill: "bg-emerald-100 text-emerald-800 border border-emerald-200",     dot: "bg-emerald-500", placeholder: "from-emerald-500/15 via-emerald-400/8 to-emerald-300/3" },
  "Student Life":       { pill: "bg-rose-100 text-rose-800 border border-rose-200",              dot: "bg-rose-500",    placeholder: "from-rose-500/15 via-rose-400/8 to-rose-300/3" },
  "Fees & Scholarships":{ pill: "bg-orange-100 text-orange-800 border border-orange-200",        dot: "bg-orange-500",  placeholder: "from-orange-500/15 via-orange-400/8 to-orange-300/3" },
  "Tips & Advice":      { pill: "bg-teal-100 text-teal-800 border border-teal-200",              dot: "bg-teal-500",    placeholder: "from-teal-500/15 via-teal-400/8 to-teal-300/3" },
};
const DEFAULT_STYLE = { pill: "bg-muted text-muted-foreground border border-border", dot: "bg-muted-foreground", placeholder: "from-muted to-background" };
const blogNextSteps = [
  {
    href: "/countries",
    label: "Destinations",
    title: "Explore country guides",
    description: "Start with destination-level research before you compare universities or fees.",
  },
  {
    href: "/universities",
    label: "Finder",
    title: "Browse universities",
    description: "Move from reading into actual university-level comparisons and fee filters.",
  },
  {
    href: "/compare",
    label: "Compare",
    title: "Open comparison guides",
    description: "Use side-by-side pages when your shortlist is starting to narrow.",
  },
  {
    href: `/authors/${contentAuthorSlug}`,
    label: "Author",
    title: `About ${contentAuthorName}`,
    description: "See who writes and reviews the research content across Students Traffic.",
  },
] as const;

function getCategoryStyle(cat: string | null) {
  return cat ? (CATEGORY_STYLES[cat] ?? DEFAULT_STYLE) : DEFAULT_STYLE;
}

// ── Sub-components ─────────────────────────────────────────────────────────

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
  return (
    <div className={`h-full w-full bg-gradient-to-br ${style.placeholder} flex items-center justify-center`}>
      <span className="font-display text-[8rem] font-bold leading-none select-none text-foreground/[0.06]">
        {title.charAt(0).toUpperCase()}
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
  readingTimeMinutes: number | null;
  publishedAt: Date | string | null;
};

function PostCard({ post }: { post: PostRow }) {
  const mins = post.readingTimeMinutes ?? 5;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/25 hover:shadow-sm transition-all duration-200">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderCover category={post.category} title={post.title} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <div className="relative z-20 mb-3">
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
    </div>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const prevHref = page === 2 ? "/blog" : `/blog?page=${page - 1}`;
  const nextHref = `/blog?page=${page + 1}`;

  // Show up to 5 page numbers around current page
  const delta = 2;
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, page + delta);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Link
        href={prevHref}
        aria-disabled={page === 1}
        className={`flex size-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${
          page === 1
            ? "pointer-events-none opacity-30"
            : "hover:bg-muted text-foreground"
        }`}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {start > 1 && (
        <>
          <Link href="/blog" className="flex size-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-muted transition-colors">1</Link>
          {start > 2 && <span className="px-1 text-muted-foreground/40 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? "/blog" : `/blog?page=${p}`}
          className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
            p === page
              ? "border-primary bg-primary text-white"
              : "border-border hover:bg-muted text-foreground"
          }`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground/40 text-sm">…</span>}
          <Link href={`/blog?page=${totalPages}`} className="flex size-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-muted transition-colors">{totalPages}</Link>
        </>
      )}

      <Link
        href={nextHref}
        aria-disabled={page === totalPages}
        className={`flex size-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${
          page === totalPages
            ? "pointer-events-none opacity-30"
            : "hover:bg-muted text-foreground"
        }`}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { posts, total } = await getPostsPage(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
            <div className="mb-10">
              <ResearchNextSteps
                title="Use the blog as the start of a broader research path"
                description="Articles help students ask better questions. The next step is usually to compare destinations, inspect universities, and test a shortlist against budget and fit."
                items={[...blogNextSteps]}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-14">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
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
                position: (page - 1) * PAGE_SIZE + idx + 1,
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
