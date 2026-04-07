"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { uploadFileToCloudinary, isAllowedPhotoType } from "@/lib/cloudinary-upload";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";

export type ManageBlogState = {
  error?: string;
  success?: boolean;
  postId?: number;
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const postSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().optional(),
  category: z.string().trim().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function createBlogPostAction(
  _prevState: ManageBlogState,
  formData: FormData
): Promise<ManageBlogState> {
  await requireAdminSession();

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    category: formData.get("category") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    status: formData.get("status") || "draft",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const db = getDb();
  if (!db) return { error: "Database unavailable." };

  const slug = parsed.data.slug || generateSlug(parsed.data.title);

  let coverUrl: string | null = null;
  const coverFile = formData.get("coverFile");
  if (coverFile instanceof File && coverFile.size > 0) {
    if (!isAllowedPhotoType(coverFile.type)) {
      return { error: "Cover image must be a JPG, PNG, or WebP." };
    }
    const result = await uploadFileToCloudinary(coverFile, {
      folder: "studentstraffic/blog-covers",
      maxBytes: 5 * 1024 * 1024,
    });
    coverUrl = result.url;
  }

  const [inserted] = await db.insert(blogPosts).values({
    slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt ?? null,
    content: parsed.data.content ?? "",
    coverUrl,
    category: parsed.data.category ?? null,
    metaTitle: parsed.data.metaTitle ?? null,
    metaDescription: parsed.data.metaDescription ?? null,
    status: parsed.data.status,
    publishedAt: parsed.data.status === "published" ? new Date() : null,
  }).returning({ id: blogPosts.id });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidateTag("blog", "hours");

  return { success: true, postId: inserted.id };
}

export async function updateBlogPostAction(
  postId: number,
  _prevState: ManageBlogState,
  formData: FormData
): Promise<ManageBlogState> {
  await requireAdminSession();

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    category: formData.get("category") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    status: formData.get("status") || "draft",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const db = getDb();
  if (!db) return { error: "Database unavailable." };

  const [existing] = await db
    .select({
      slug: blogPosts.slug,
      publishedAt: blogPosts.publishedAt,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);

  if (!existing) return { error: "Post not found." };

  let coverUrl: string | undefined = undefined;
  const coverFile = formData.get("coverFile");
  const clearCover = formData.get("clearCover") === "1";

  if (clearCover) {
    coverUrl = null as unknown as undefined;
  } else if (coverFile instanceof File && coverFile.size > 0) {
    if (!isAllowedPhotoType(coverFile.type)) {
      return { error: "Cover image must be a JPG, PNG, or WebP." };
    }
    const result = await uploadFileToCloudinary(coverFile, {
      folder: "studentstraffic/blog-covers",
      maxBytes: 5 * 1024 * 1024,
    });
    coverUrl = result.url;
  }

  const wasPublished = existing.status === "published";
  const nowPublished = parsed.data.status === "published";
  const publishedAt = nowPublished && !wasPublished
    ? new Date()
    : wasPublished && !nowPublished
      ? null
      : existing.publishedAt;

  const nextSlug = parsed.data.slug || generateSlug(parsed.data.title);

  await db.update(blogPosts).set({
    title: parsed.data.title,
    slug: nextSlug,
    excerpt: parsed.data.excerpt ?? null,
    content: parsed.data.content ?? "",
    ...(coverUrl !== undefined ? { coverUrl } : {}),
    category: parsed.data.category ?? null,
    metaTitle: parsed.data.metaTitle ?? null,
    metaDescription: parsed.data.metaDescription ?? null,
    status: parsed.data.status,
    publishedAt,
    updatedAt: new Date(),
  }).where(eq(blogPosts.id, postId));

  revalidatePath("/blog");
  if (existing.slug !== nextSlug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
  revalidatePath(`/blog/${nextSlug}`);
  revalidateTag("blog", "hours");

  return { success: true, postId };
}

export async function deleteBlogPostAction(postId: number): Promise<void> {
  await requireAdminSession();

  const db = getDb();
  if (!db) return;

  await db.delete(blogPosts).where(eq(blogPosts.id, postId));

  revalidatePath("/blog");
  revalidateTag("blog", "hours");
}
