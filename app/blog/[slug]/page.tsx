import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import readingTime from "reading-time";

import { MarkdownContent } from "@/components/site/markdown-content";
import { absoluteUrl, getOgImageUrl } from "@/lib/metadata";
import { buildLinkRules, linkifyMarkdown } from "@/lib/blog-autolinks";
import { ReadingProgress } from "@/components/blog/reading-progress";
import {
  contentAuthorName,
  contentAuthorSlug,
} from "@/lib/content-governance";
import { getAuthor, isValidAuthorSlug } from "@/lib/authors";
import {
  getPublishedBlogPostMetadata,
} from "@/lib/data/catalog";
import type { BlogPostSearchMetadata } from "@/lib/data/types";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

const PLACEHOLDER_BLOG_SLUG = "__blog-fallback__";

type RelatedPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  category: string | null;
  publishedAt: Date | string | null;
  readingTimeMinutes: number | null;
};

async function getPublishedPosts() {
  return getPublishedBlogPostMetadata();
}

async function getPost(slug: string) {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

async function getRelatedPosts(
  slug: string,
  category: string | null | undefined,
): Promise<RelatedPost[]> {
  const posts = await getPublishedPosts();
  const sameCategory = category
    ? posts.filter((post) => post.slug !== slug && post.category === category)
    : [];

  const candidates =
    sameCategory.length >= 2
      ? sameCategory
      : [
          ...sameCategory,
          ...posts.filter(
            (post) =>
              post.slug !== slug &&
              !sameCategory.some(
                (sameCategoryPost) => sameCategoryPost.slug === post.slug,
              ),
          ),
        ];

  return candidates.slice(0, 3).map(mapRelatedPost);
}

async function getPrevNext(
  slug: string,
  publishedAt: string | Date | null | undefined,
) {
  if (!publishedAt) {
    return { prev: null, next: null };
  }

  const posts = await getPublishedPosts();
  const publishedAtMs = new Date(publishedAt).getTime();

  const currentIndex = posts.findIndex((post) => post.slug === slug);
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // posts is sorted by publishedAt descending, so the immediately preceding
  // (older) post sits at the next index, and the immediately following
  // (newer) post sits at the previous index.
  const previousPost = posts
    .slice(currentIndex + 1)
    .find((post) => getPublishedAtMs(post) < publishedAtMs);
  const nextPost = [...posts.slice(0, currentIndex)]
    .reverse()
    .find((post) => getPublishedAtMs(post) > publishedAtMs);

  return {
    prev: previousPost ? { title: previousPost.title, slug: previousPost.slug } : null,
    next: nextPost ? { title: nextPost.title, slug: nextPost.slug } : null,
  };
}

function getPublishedAtMs(post: BlogPostSearchMetadata) {
  return post.publishedAt ? new Date(post.publishedAt).getTime() : 0;
}

function mapRelatedPost(post: BlogPostSearchMetadata): RelatedPost {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? null,
    coverUrl: post.coverUrl ?? null,
    category: post.category ?? null,
    publishedAt: post.publishedAt ?? null,
    readingTimeMinutes: post.readingTimeMinutes ?? null,
  };
}

export async function generateStaticParams() {
  return ensureNonEmptyStaticParams([], { slug: PLACEHOLDER_BLOG_SLUG });
}

function resolvePostAuthor(authorSlug: string | null | undefined) {
  if (authorSlug && isValidAuthorSlug(authorSlug)) {
    const a = getAuthor(authorSlug);
    return { name: a.name, path: `/author/${a.slug}` };
  }
  return { name: contentAuthorName, path: `/author/${contentAuthorSlug}` };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === PLACEHOLDER_BLOG_SLUG) return {};
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const author = resolvePostAuthor(post.authorSlug);

  const canonicalUrl = absoluteUrl(`/blog/${slug}`);
  const ogImage = post.coverUrl ?? getOgImageUrl("/");
  const coverImages = [{ url: ogImage, width: 1200, height: 630, alt: title }];

  return {
    title: `${title} | Students Traffic`,
    description,
    authors: [{ name: author.name, url: absoluteUrl(author.path) }],
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
      authors: [author.name],
      images: coverImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
  if (slug === PLACEHOLDER_BLOG_SLUG) {
    notFound();
  }
  const post = await getPost(slug);

  if (!post) notFound();

  const content = post.content ?? "";
  const rt = readingTime(content);
  const faqs = extractFaqs(content);
  const author = resolvePostAuthor(post.authorSlug);
  const [related, { prev, next }, linkRules] = await Promise.all([
    getRelatedPosts(post.slug, post.category),
    getPrevNext(post.slug, post.publishedAt),
    buildLinkRules(post.slug),
  ]);
  const linkedContent = linkifyMarkdown(content, linkRules);
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

        {/* Mobile: cover image above text */}
        {post.coverUrl && (
          <div className="md:hidden px-5 sm:px-6 pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverUrl} alt={post.title} className="w-full h-auto block rounded-2xl" />
          </div>
        )}

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          {/* Two-column layout */}
          <div className="grid items-center gap-8 py-10 md:grid-cols-[1fr_auto] md:gap-12 md:py-14 lg:gap-16 lg:py-16">

            {/* Left — text */}
            <div className="min-w-0">
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
                <span>·</span>
                <Link href={author.path} className="hover:text-white/70 transition-colors">
                  By {author.name}
                </Link>
              </div>
            </div>

            {/* Right — cover image (desktop only) */}
            {post.coverUrl && (
              <div className="hidden md:block shrink-0 self-start w-[380px] lg:w-[440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="w-full h-auto rounded-2xl block"
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
              Admission support
            </p>
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              Want help choosing the right MBBS option?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              Request a counselling call and our team will help you understand which colleges may fit your NEET score and budget.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-surface-dark hover:bg-white/90 transition-colors"
              >
                Browse colleges
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
              {related.map((r: RelatedPost) => (
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      {r.readingTimeMinutes ?? 5} min read
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
                  "@type": "NewsArticle",
                  "@id": absoluteUrl(`/blog/${post.slug}`),
                  url: absoluteUrl(`/blog/${post.slug}`),
                  headline: post.title,
                  description: post.excerpt ?? undefined,
                  image: post.coverUrl ? { "@type": "ImageObject", url: post.coverUrl, width: 1200, height: 630 } : undefined,
                  datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
                  dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
                  inLanguage: "en-IN",
                  wordCount: content.split(/\s+/).length,
                  articleSection: post.category ?? "MBBS Abroad",
                  author: {
                    "@type": "Person",
                    name: author.name,
                    url: absoluteUrl(author.path),
                  },
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
