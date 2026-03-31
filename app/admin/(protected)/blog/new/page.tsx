import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createBlogPostAction } from "@/app/_actions/manage-blog";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdminSession } from "@/lib/auth";

export default async function NewBlogPostPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Blog
        </Link>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Content</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-primary">New post</h1>
      </div>
      <BlogEditor action={createBlogPostAction} submitLabel="Save post" />
    </div>
  );
}
