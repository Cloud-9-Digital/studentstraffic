import Link from "next/link";
import Image from "next/image";
import { and, desc, eq, lt, gt, ne } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { CalendarDays, Clock, ArrowLeft, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import readingTime from "reading-time";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { MarkdownContent } from "@/components/site/markdown-content";
import { absoluteUrl } from "@/lib/metadata";
import { categoryToSlug } from "@/app/blog/category/[slug]/page";
import { siteConfig } from "@/lib/constants";
import { buildLinkRules, linkifyMarkdown } from "@/lib/blog-autolinks";
import { ReadingProgress } from "@/components/blog/reading-progress";

const getPost = unstable_cache(
  async (slug: string) => {
    const db = getDb();
    if (!db) return null;
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return post ?? null;
  },
  ["blog-post"],
  { tags: ["blog"], revalidate: 3600 }
);

const getRelatedPosts = unstable_cache(
  async (slug: string, category: string | null) => {
    const db = getDb();
    if (!db) return [];
    // Try same category first, fall back to any recent posts
    const sameCat = category
      ? await db
          .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, excerpt: blogPosts.excerpt, coverUrl: blogPosts.coverUrl, category: blogPosts.category, publishedAt: blogPosts.publishedAt, content: blogPosts.content })
          .from(blogPosts)
          .where(and(eq(blogPosts.status, "published"), eq(blogPosts.category, category), ne(blogPosts.slug, slug)))
          .orderBy(desc(blogPosts.publishedAt))
          .limit(3)
      : [];
    if (sameCat.length >= 2) return sameCat;
    // top up with any recent posts
    const recent = await db
      .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, excerpt: blogPosts.excerpt, coverUrl: blogPosts.coverUrl, category: blogPosts.category, publishedAt: blogPosts.publishedAt, content: blogPosts.content })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), ne(blogPosts.slug, slug)))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3);
    const seen = new Set(sameCat.map((p) => p.slug));
    return [...sameCat, ...recent.filter((p) => !seen.has(p.slug))].slice(0, 3);
  },
  ["blog-related"],
  { tags: ["blog"], revalidate: 3600 }
);

const getPrevNext = unstable_cache(
  async (slug: string, publishedAt: Date | string | null) => {
    const db = getDb();
    if (!db || !publishedAt) return { prev: null, next: null };
    const ts = new Date(publishedAt);
    const [prev] = await db
      .select({ title: blogPosts.title, slug: blogPosts.slug })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), lt(blogPosts.publishedAt, ts)))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(1);
    const [next] = await db
      .select({ title: blogPosts.title, slug: blogPosts.slug })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), gt(blogPosts.publishedAt, ts)))
      .orderBy(blogPosts.publishedAt)
      .limit(1);
    return { prev: prev ?? null, next: next ?? null };
  },
  ["blog-prevnext"],
  { tags: ["blog"], revalidate: 3600 }
);

export async function generateStaticParams() {
  const db = getDb();
  if (!db) return [];
  const posts = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;

  const canonicalUrl = absoluteUrl(`/blog/${slug}`);
  const coverImages = post.coverUrl
    ? [{ url: post.coverUrl, width: 1200, height: 630, alt: title }]
    : [];

  return {
    title: `${title} | Students Traffic`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      locale: "en_IN",
      siteName: "Students Traffic",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      section: post.category ?? "MBBS Abroad",
      authors: ["Students Traffic"],
      images: coverImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverUrl ? [post.coverUrl] : [],
    },
  };
}

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "long", year: "numeric",
});

function extractFaqs(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  // Match **Q: question text?** followed by answer paragraphs
  const re = /\*\*Q:\s*(.+?)\*\*\n+([\s\S]+?)(?=\n\*\*Q:|\n---|\n##|$)/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, " ");
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || post.status !== "published") notFound();

  const rt = readingTime(post.content);
  const faqs = extractFaqs(post.content);
  const [related, { prev, next }, linkRules] = await Promise.all([
    getRelatedPosts(post.slug, post.category),
    getPrevNext(post.slug, post.publishedAt),
    buildLinkRules(post.slug),
  ]);
  const linkedContent = linkifyMarkdown(post.content, linkRules);
  const shareUrl = absoluteUrl(`/blog/${post.slug}`);
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`;

  return (
    <main className="min-h-screen bg-background">
      <ReadingProgress />

      {/* ── Hero masthead ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface-dark">
        {/* 3px accent top line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />

        {/* Dot-grid background texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          {/* Two-column layout */}
          <div className="grid items-center gap-8 py-10 md:grid-cols-[1fr_auto] md:gap-12 md:py-14 lg:gap-16 lg:py-16">

            {/* Left — text */}
            <div className="min-w-0">
              {post.category && (
                <div className="mb-4">
                  <Link
                    href={`/blog/category/${categoryToSlug(post.category)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent hover:bg-accent/20 transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                    {post.category}
                  </Link>
                </div>
              )}

              <h1 className="font-display text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white md:text-[2.1rem] lg:text-[2.5rem]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-3 text-[0.9rem] leading-relaxed text-white/52">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/[0.08] pt-4 text-[11px] text-white/40">
                {post.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3" />
                    {fmtDate.format(new Date(post.publishedAt!))}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  {Math.ceil(rt.minutes)} min read
                </span>
              </div>
            </div>

            {/* Right — cover image */}
            {post.coverUrl && (
              <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[260px] md:w-[380px] lg:h-[300px] lg:w-[440px] shrink-0">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Article wrapper ───────────────────────────────────────── */}
      <div className="mx-auto max-w-[720px] px-5 pb-24 md:px-6 pt-10">

        {/* ── Article body ──────────────────────────────────────────── */}
        <article className="mb-14">
          <MarkdownContent content={linkedContent} />
        </article>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div className="mb-10 overflow-hidden rounded-2xl bg-surface-dark">
          <div className="px-7 py-8 md:px-10 md:py-10">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Free counselling
            </p>
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              Ready to apply for<br />MBBS abroad?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              Talk to a student already studying there — no cost, ever.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-surface-dark hover:bg-white/90 transition-colors"
              >
                Browse universities
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/students"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Talk to a student
              </Link>
            </div>
          </div>
        </div>

        {/* ── Share ─────────────────────────────────────────────────── */}
        <div className="mb-10 flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            Share
          </span>
          <div className="flex-1 h-px bg-border" />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-foreground hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-3.5 fill-[#25D366]" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-3.5 fill-foreground" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X / Twitter
          </a>
        </div>

        {/* ── Prev / Next ───────────────────────────────────────────── */}
        {(prev || next) && (
          <nav
            className="mb-14 grid gap-3 sm:grid-cols-2"
            aria-label="Post navigation"
          >
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:bg-muted/50 transition-all"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  <ChevronLeft className="size-3" />
                  Previous
                </span>
                <span className="text-[13px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col items-end gap-2 rounded-2xl border border-border bg-card p-5 text-right hover:border-primary/30 hover:bg-muted/50 transition-all"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  Next
                  <ChevronRight className="size-3" />
                </span>
                <span className="text-[13px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : <div />}
          </nav>
        )}

        {/* ── Related posts ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section aria-label="Related posts" className="mb-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground/40">
                Keep reading
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/25 hover:shadow-sm transition-all"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {r.coverUrl ? (
                      <Image
                        src={r.coverUrl}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/3 flex items-center justify-center">
                        <span className="font-display text-5xl font-bold text-foreground/[0.07] select-none">
                          {r.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    {r.category && (
                      <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                        {r.category}
                      </span>
                    )}
                    <p className="text-[13px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {r.title}
                    </p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground/50">
                      {Math.ceil(readingTime(r.content).minutes)} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                ...(faqs.length > 0 ? [{
                  "@type": "FAQPage",
                  "@id": `${absoluteUrl(`/blog/${post.slug}`)}#faq`,
                  mainEntity: faqs.map(({ question, answer }) => ({
                    "@type": "Question",
                    name: question,
                    acceptedAnswer: { "@type": "Answer", text: answer },
                  })),
                }] : []),
                {
                  "@type": "BlogPosting",
                  "@id": absoluteUrl(`/blog/${post.slug}`),
                  url: absoluteUrl(`/blog/${post.slug}`),
                  headline: post.title,
                  description: post.excerpt ?? undefined,
                  image: post.coverUrl ? { "@type": "ImageObject", url: post.coverUrl, width: 1200, height: 630 } : undefined,
                  datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
                  dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
                  inLanguage: "en-IN",
                  wordCount: post.content.split(/\s+/).length,
                  articleSection: post.category ?? "MBBS Abroad",
                  author: { "@type": "Organization", name: "Students Traffic", url: absoluteUrl("/") },
                  publisher: { "@type": "Organization", name: "Students Traffic", url: absoluteUrl("/") },
                  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
                  isPartOf: { "@type": "WebSite", "@id": absoluteUrl("/"), name: "Students Traffic", url: absoluteUrl("/") },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                    { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
                    { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
                  ],
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}
