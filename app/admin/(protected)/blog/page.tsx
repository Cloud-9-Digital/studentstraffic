import Link from "next/link";
import { desc } from "drizzle-orm";
import { ChevronRight, FileText, Globe, Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

async function BlogList() {
  await connection();

  const db = getDb();
  const rows = db
    ? await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          category: blogPosts.category,
          status: blogPosts.status,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .orderBy(desc(blogPosts.updatedAt))
    : [];

  const published = rows.filter((r) => r.status === "published").length;
  const drafts = rows.filter((r) => r.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Content</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">{published} published · {drafts} draft</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-surface-dark-2"
        >
          <Plus className="size-4" /> New post
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
          <FileText className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first blog post to start driving organic traffic.</p>
          <Link href="/admin/blog/new" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-surface-dark-2">
            <Plus className="size-4" /> Write first post
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {rows.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  post.status === "published" ? "bg-status-green text-status-green-fg" : "bg-muted text-muted-foreground"
                }`}>
                  {post.status === "published" ? <Globe className="size-4" /> : <FileText className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{post.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {post.category && (
                      <span className="text-[11px] font-medium text-accent">{post.category}</span>
                    )}
                    <span className="text-[11px] text-muted-foreground font-mono">/blog/{post.slug}</span>
                    <span className="text-[11px] text-muted-foreground/60">
                      {post.status === "published" && post.publishedAt
                        ? `Published ${fmtDate.format(post.publishedAt)}`
                        : `Updated ${fmtDate.format(post.updatedAt)}`}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View
                    </a>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Edit <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AdminBlogPage() {
  await requireAdminSession();
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <BlogList />
    </Suspense>
  );
}
