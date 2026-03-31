import Link from "next/link";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { CalendarDays, Clock } from "lucide-react";
import readingTime from "reading-time";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Blog — MBBS Abroad Guides & Tips | Students Traffic",
  description: "Expert guides on MBBS abroad, university comparisons, admission tips, fees, and student life — helping Indian students make informed decisions.",
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
  day: "numeric", month: "long", year: "numeric",
});

export default async function BlogPage() {
  const posts = await getPosts();

  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface-dark py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/50">Resources</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            MBBS Abroad Guides
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/70">
            Honest, research-backed guides to help Indian students navigate MBBS abroad — universities, fees, admission, and life on campus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <div className="space-y-12">
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className="grid overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md md:grid-cols-2">
                  {featured.coverUrl ? (
                    <div className="relative aspect-video md:aspect-auto">
                      <Image src={featured.coverUrl} alt={featured.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-primary/8 md:aspect-auto" />
                  )}
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    {featured.category && (
                      <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {featured.category}
                      </span>
                    )}
                    <h2 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors md:text-2xl">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground/70">
                      {featured.publishedAt && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {fmtDate.format(featured.publishedAt)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {Math.ceil(readingTime(featured.content).minutes)} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
                    {post.coverUrl ? (
                      <div className="relative aspect-video overflow-hidden">
                        <Image src={post.coverUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-primary/8" />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      {post.category && (
                        <span className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-accent">{post.category}</span>
                      )}
                      <h2 className="font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-auto pt-4 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {fmtDate.format(post.publishedAt)}
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
        )}
      </div>
    </main>
  );
}
