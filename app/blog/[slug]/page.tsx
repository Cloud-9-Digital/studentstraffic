import Link from "next/link";
import Image from "next/image";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import readingTime from "reading-time";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { MarkdownContent } from "@/components/site/markdown-content";

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

  return {
    title: `${title} | Students Traffic`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      ...(post.coverUrl ? { images: [{ url: post.coverUrl }] } : {}),
    },
  };
}

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "long", year: "numeric",
});

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || post.status !== "published") notFound();

  const rt = readingTime(post.content);

  return (
    <main className="min-h-screen bg-background">
      {/* Cover */}
      {post.coverUrl && (
        <div className="relative h-64 w-full md:h-80 lg:h-96">
          <Image src={post.coverUrl} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        {/* Back */}
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="size-4" /> All posts
        </Link>

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-wider text-accent">
              {post.category}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground/70">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {fmtDate.format(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {Math.ceil(rt.minutes)} min read
            </span>
          </div>
        </header>

        {/* Article body */}
        <article>
          <MarkdownContent content={post.content} />
        </article>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <h3 className="font-display text-lg font-bold text-primary">Ready to apply for MBBS abroad?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Talk to a student who's already there — for free.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/universities" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-surface-dark-2 transition-colors">
              Browse universities
            </Link>
            <Link href="/students" className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Talk to a student
            </Link>
          </div>
        </div>

        {/* Schema.org article markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt ?? undefined,
              image: post.coverUrl ?? undefined,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt?.toISOString(),
              author: {
                "@type": "Organization",
                name: "Students Traffic",
              },
              publisher: {
                "@type": "Organization",
                name: "Students Traffic",
              },
            }),
          }}
        />
      </div>
    </main>
  );
}
