import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import { updateBlogPostAction, deleteBlogPostAction } from "@/app/_actions/manage-blog";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) notFound();

  const db = getDb();
  if (!db) notFound();

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);

  if (!post) notFound();

  const boundUpdateAction = updateBlogPostAction.bind(null, postId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Blog
          </Link>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Content</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-primary">Edit post</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Status:{" "}
            <span className={`font-medium ${post.status === "published" ? "text-status-green-fg" : "text-muted-foreground"}`}>
              {post.status}
            </span>
          </p>
        </div>
        {post.status === "published" && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View live →
          </a>
        )}
      </div>

      <BlogEditor
        action={boundUpdateAction}
        submitLabel="Save changes"
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? undefined,
          content: post.content,
          existingCoverUrl: post.coverUrl ?? undefined,
          category: post.category ?? undefined,
          metaTitle: post.metaTitle ?? undefined,
          metaDescription: post.metaDescription ?? undefined,
          status: post.status,
        }}
      />

      {/* Delete zone */}
      <div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-5">
        <h3 className="mb-1 text-sm font-semibold text-destructive">Delete post</h3>
        <p className="mb-4 text-xs text-muted-foreground">This is permanent and cannot be undone.</p>
        <form
          action={async () => {
            "use server";
            await deleteBlogPostAction(postId);
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/15"
          >
            <Trash2 className="size-3.5" /> Delete post
          </button>
        </form>
      </div>
    </div>
  );
}
