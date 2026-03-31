"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, ChevronDown, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ManageBlogState } from "@/app/_actions/manage-blog";

// Lazy-load the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CATEGORIES = [
  "MBBS Abroad",
  "University Guide",
  "Country Guide",
  "Admissions",
  "Student Life",
  "Fees & Scholarships",
  "NMC & Licensing",
  "Tips & Advice",
];

type Props = {
  action: (state: ManageBlogState, formData: FormData) => Promise<ManageBlogState>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    existingCoverUrl?: string;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: "draft" | "published";
  };
  submitLabel?: string;
  cancelHref?: string;
};

const initialState: ManageBlogState = {};

export function BlogEditor({
  action,
  defaultValues,
  submitLabel = "Save post",
  cancelHref = "/admin/blog",
}: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!defaultValues?.slug);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(defaultValues?.existingCoverUrl ?? null);
  const [coverName, setCoverName] = useState<string | null>(defaultValues?.existingCoverUrl ? "Current cover" : null);
  const [isExistingCover, setIsExistingCover] = useState(!!defaultValues?.existingCoverUrl);
  const [cleared, setCleared] = useState(false);

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited) setSlug(generateSlug(val));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverName(file.name);
    setIsExistingCover(false);
    setCleared(false);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearCover() {
    setCoverPreview(null);
    setCoverName(null);
    setIsExistingCover(false);
    setCleared(true);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  // Wrap formAction to inject content (from controlled MDEditor)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    fd.set("content", content);
    // Let useActionState handle via hidden input instead
  }

  if (state.success) {
    return (
      <div className="rounded-2xl border border-status-green-border bg-status-green p-8 text-center">
        <p className="font-semibold text-status-green-fg">Post saved successfully!</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/admin/blog" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            Back to posts
          </Link>
          {state.postId && (
            <Link href={`/admin/blog/${state.postId}`} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-surface-dark-2">
              Continue editing
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden content field — synced from MDEditor */}
      <input type="hidden" name="content" value={content} />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">

        {/* ── Main content ── */}
        <div className="space-y-5">

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. MBBS in Russia: Complete Guide for Indian Students 2026"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm text-muted-foreground">/blog/</span>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true); }}
                placeholder="mbbs-in-russia-guide"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Excerpt <span className="font-normal text-muted-foreground">(shown on listing page)</span></Label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={defaultValues?.excerpt}
              rows={2}
              placeholder="A brief 1–2 sentence summary of the post..."
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
            />
          </div>

          {/* Markdown editor */}
          <div className="space-y-1.5">
            <Label>Content</Label>
            <div data-color-mode="light" className="rounded-xl overflow-hidden border border-input">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val ?? "")}
                height={520}
                preview="live"
              />
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Publish */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Publish</h3>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  defaultValue={defaultValues?.status ?? "draft"}
                  className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  defaultValue={defaultValues?.category ?? ""}
                  className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">No category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {state.error && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="flex-1 bg-primary hover:bg-surface-dark-2">
                {isPending ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : submitLabel}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={cancelHref}>Cancel</Link>
              </Button>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Cover image</h3>
            <input
              ref={coverInputRef}
              type="file"
              name="coverFile"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverChange}
            />
            {coverPreview ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverPreview} alt="Cover" className="w-full rounded-xl object-cover aspect-video border border-border" />
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs text-muted-foreground">{coverName}</p>
                  <button type="button" onClick={clearCover} className="ml-2 shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted">
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-input bg-transparent px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-muted"
              >
                <Camera className="size-5 shrink-0 text-muted-foreground/60" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Upload cover</p>
                  <p className="text-xs">JPG, PNG or WebP · Max 5 MB</p>
                </div>
              </button>
            )}
            {cleared && <input type="hidden" name="clearCover" value="1" />}
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">SEO</h3>
            <div className="space-y-1.5">
              <Label htmlFor="metaTitle">Meta title <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="metaTitle" name="metaTitle" defaultValue={defaultValues?.metaTitle} placeholder="Defaults to post title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaDescription">Meta description <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={defaultValues?.metaDescription}
                rows={3}
                placeholder="150–160 characters for best results"
                className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
