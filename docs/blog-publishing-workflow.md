# Blog Publishing Workflow

This document explains the recommended workflow for writing a blog post, generating a cover image, uploading the cover to Cloudinary, publishing the post into `blog_posts`, and verifying that it works in production.

The short version:

1. Research the topic and verify claims.
2. Write the article in Markdown inside a publish script in `scripts/`.
3. Generate a raster cover image.
4. Upload the cover to Cloudinary.
5. Upsert the blog post into the database with the Cloudinary `cover_url`.
6. Verify the slug, image URL, and rendered page.

---

## Why This Workflow Exists

Blog posts are stored in the shared database, not as local markdown files.

That means a published row can become visible across environments immediately. If a post points at a local `/public/...` image path before that file is deployed everywhere, the image can break in production.

Because of that, the safest default is:

- use **Cloudinary** for blog cover images
- store the **Cloudinary URL** in `blog_posts.cover_url`
- avoid publishing DB rows that depend on a local `public/` image path unless that file is already committed and deployed

---

## Source of Truth

Blog content is published from:

- table: `blog_posts`
- schema: [lib/db/schema.ts](/Users/bharat/Documents/studentstraffic/lib/db/schema.ts)
- page renderer: [app/blog/[slug]/page.tsx](/Users/bharat/Documents/studentstraffic/app/blog/[slug]/page.tsx)

Important fields:

- `slug`
- `title`
- `excerpt`
- `content`
- `cover_url`
- `category`
- `meta_title`
- `meta_description`
- `status`
- `reading_time_minutes`
- `published_at`

---

## Recommended Authoring Workflow

### 1. Verify the story first

Before writing, confirm:

- whether the claim is actually true
- the current date-sensitive status
- which parts are official, reported, inferred, or still unclear

For news-like posts, prefer:

- official websites and notices
- primary documents and PDFs
- major publications only as secondary support

The article should clearly separate:

- confirmed facts
- reported developments
- unknowns

That is especially important for exams, regulations, rankings, fees, and admissions.

### 2. Write the article inside a publish script

Use a script in `scripts/` as the publishing artifact.

Recommended naming:

- `scripts/seed-<slug>.mjs`

The script should define:

- slug
- title
- excerpt
- category
- meta title
- meta description
- markdown `content`

This is the pattern already used by existing scripts like:

- [scripts/seed-blogs-batch6-post4.mjs](/Users/bharat/Documents/studentstraffic/scripts/seed-blogs-batch6-post4.mjs)
- [scripts/seed-neet-ug-2026-cancelled.mjs](/Users/bharat/Documents/studentstraffic/scripts/seed-neet-ug-2026-cancelled.mjs)

### 3. Generate a cover image as a raster file

Use an AI-generated cover image when appropriate, but keep it:

- horizontal
- blog-safe
- realistic or editorial in style
- free of logos and brand marks
- free of misleading text overlays

Preferred format:

- PNG or JPG

Do not use SVG for generated editorial covers unless there is a very specific reason.

### 4. Upload the cover to Cloudinary

Cloudinary should be the default destination for blog covers.

Use a stable public ID like:

- `studentstraffic/blog/<slug>-cover`

The script should either:

- reuse an existing Cloudinary asset if the public ID already exists, or
- upload the local generated file and return `secure_url`

### 5. Upsert the row into `blog_posts`

The script should insert or update by `slug`.

Recommended behavior:

- set `status = 'published'`
- compute `reading_time_minutes`
- set `published_at`
- update metadata and cover URL on reruns

### 6. Verify after publish

After the script runs, confirm:

1. the DB row exists
2. `cover_url` points to Cloudinary
3. the page route returns `200`
4. the image URL returns `200`
5. the article reads correctly in the blog page

If production caching is involved, also revalidate or redeploy as needed.

---

## Minimal Script Shape

Use this as the baseline structure:

```js
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env manually
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent
    .split("\\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [
        line.slice(0, index).trim(),
        line.slice(index + 1).trim().replace(/^['"]|['"]$/g, ""),
      ];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const LOCAL_IMAGE = "/absolute/path/to/local-cover.png";
const CLOUDINARY_ID = "studentstraffic/blog/example-post-cover";

const post = {
  slug: "example-post",
  title: "Example Post",
  excerpt: "Short summary",
  category: "Latest Updates",
  metaTitle: "Example Post | Students Traffic",
  metaDescription: "Meta description",
  content: `## Heading

Article body here.`,
};

async function uploadImage(localPath, publicId) {
  try {
    const existing = await cloudinary.api.resource(publicId);
    return existing.secure_url;
  } catch {}

  const uploaded = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });
  return uploaded.secure_url;
}

async function run() {
  if (!existsSync(LOCAL_IMAGE)) {
    throw new Error(`Missing cover image: ${LOCAL_IMAGE}`);
  }

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const coverUrl = await uploadImage(LOCAL_IMAGE, CLOUDINARY_ID);
    const publishedAt = new Date();

    await client.query(
      `INSERT INTO blog_posts (
        slug, title, excerpt, content, cover_url, category,
        meta_title, meta_description, status, reading_time_minutes,
        published_at, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        cover_url = EXCLUDED.cover_url,
        category = EXCLUDED.category,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        status = 'published',
        reading_time_minutes = EXCLUDED.reading_time_minutes,
        published_at = EXCLUDED.published_at,
        updated_at = EXCLUDED.updated_at`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        coverUrl,
        post.category,
        post.metaTitle,
        post.metaDescription,
        Math.ceil(readingTime(post.content).minutes),
        publishedAt,
      ]
    );
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

---

## Writing Standards

Each blog post should aim for:

- a clear user question or intent
- a headline that says exactly what the post solves
- an intro that states the current situation fast
- scannable sections with descriptive `##` and `###` headings
- practical internal links to relevant site pages
- a dated framing if the topic is volatile

For time-sensitive posts, include exact dates like:

- `3 May 2026`
- `12 May 2026`

Avoid vague relative wording like:

- today
- yesterday
- recently

unless it is paired with a date.

---

## Cover Image Standards

Blog covers should usually be:

- `16:9`
- high-resolution
- editorial, not overly promotional
- visually relevant to the topic
- neutral enough to age well

Avoid:

- unreadable text inside the image
- too many small UI details
- copyrighted logos
- cluttered collage layouts
- brand-inconsistent stock-photo look

Good prompt shape:

- what the article is about
- what objects or scene should appear
- what tone it should have
- what to exclude
- output orientation

Example:

```text
Editorial blog cover image for a news explainer about NEET UG 2026 being cancelled in India.
A tense but clean, trustworthy newspaper-style composition: an Indian exam desk with OMR sheet,
admit card, pen, and a bold red cancellation treatment across the scene; realistic lighting,
high detail, professional magazine cover feel, horizontal 16:9, no logos, no watermarks.
```

---

## Verification Checklist

After publishing, run checks like:

```sh
node scripts/seed-example-post.mjs
```

```sh
node <<'NODE'
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query("select slug, cover_url, status from blog_posts where slug = 'example-post'");
  console.log(JSON.stringify(rows, null, 2));
})();
NODE
```

```sh
curl -I https://res.cloudinary.com/<cloud-name>/image/upload/<path>.png
```

```sh
curl -I http://localhost:3000/blog/example-post
```

Confirm:

- the post is `published`
- the `cover_url` is remote
- the image returns `200`
- the blog route returns `200`

---

## Common Failure Modes

### 1. Local `public/` image path published to DB before deployment

Symptom:

- image works locally
- image breaks in production

Cause:

- the DB row is live but production does not yet have that file in its deployed artifact

Fix:

- move the image to Cloudinary
- update `cover_url`

### 2. `next/image` rejects remote host

Symptom:

- image URL exists but rendering fails

Cause:

- hostname is not allowed in `next.config.ts`

Fix:

- add the remote host under `images.remotePatterns`

### 3. Re-running a script creates drift

Symptom:

- inconsistent metadata or duplicate behaviors across reruns

Fix:

- always use `ON CONFLICT (slug) DO UPDATE`
- keep the public ID stable in Cloudinary

### 4. Stale cache after publish

Symptom:

- DB row is correct but page still shows old content

Fix:

- revalidate blog cache
- redeploy if necessary

Script available:

- [scripts/revalidate-blog-cache.mjs](/Users/bharat/Documents/studentstraffic/scripts/revalidate-blog-cache.mjs)

---

## Current Recommended Pattern

For new blog posts, follow this order:

1. Draft and verify the article.
2. Generate a raster cover image.
3. Upload the cover to Cloudinary first.
4. Upsert the blog row with the Cloudinary URL.
5. Verify locally and in production.

If there is a conflict between speed and safety, prefer the Cloudinary-first path. It is the least fragile workflow for a DB-backed blog.

---

## Future SEO backlog (needs migration)

These items were identified during the blog SEO/performance pass but require a `blog_posts` schema change (new columns and/or a taxonomy table), so they were intentionally **not** implemented. Each needs a `db:generate` + `db:push` migration, planned and run deliberately (not as a drive-by change), before the corresponding code lands.

### 1. Structured `faq` jsonb field

FAQs are currently extracted from `content` at render time with a brittle regex (`**Q: ...**` pattern matching in `app/blog/[slug]/page.tsx`). This breaks silently if an author's Markdown formatting drifts even slightly, and it can't express rich answers (lists, links) cleanly inside the `acceptedAnswer.text` string.

Proposed shape: add a `faq: jsonb` column to `blog_posts` holding `Array<{ question: string; answer: string }>`, authored explicitly in the publish script instead of being inferred from prose. Update `app/blog/[slug]/page.tsx` to read `post.faq` directly for the `FAQPage` JSON-LD, falling back to the regex extractor only for old posts that haven't been backfilled.

### 2. Tags/topics many-to-many taxonomy + topic-hub pages

`category` is a single free-text column, which only supports one broad bucket per post (e.g. "MBBS Abroad", "Latest Updates"). There's no way to tag a post with multiple cross-cutting topics (e.g. "Georgia" + "NEET" + "Fees") or to build topic-hub landing pages that aggregate posts across categories for topical clustering (an SEO technique Google rewards for demonstrating topical authority).

Proposed shape: a `blog_tags` table plus a `blog_post_tags` join table, with topic-hub pages at a new route (e.g. `/blog/topic/[slug]`) that list every post carrying a given tag. This is a larger schema + routing change and should be scoped as its own project, not bundled into a content pass.

### 3. Structured `sources`/citations field

YMYL content (medical admissions, fees, regulation) benefits from visible sourcing, and LLM answer engines increasingly prefer citable, source-attributed content when selecting passages to quote. Today sources are only ever informally mentioned inline in prose, if at all.

Proposed shape: add a `sources: jsonb` column holding `Array<{ label: string; url: string }>`, rendered as a "Sources" block at the end of the article (below Related posts) and optionally included in the `NewsArticle`/`BlogPosting` JSON-LD as `citation`.

### 4. "Reviewed by" / expert-reviewer signal

For medical/YMYL content, an explicit "Reviewed by [name], [credential]" line (distinct from the author byline) is a well-documented Google E-E-A-T signal, especially for exam, regulation, and admissions accuracy content.

Proposed shape: add a `reviewer_slug: text` column to `blog_posts` referencing an entry in `lib/authors.ts` (or a new lightweight reviewers table if reviewers shouldn't also be listed as post authors), rendered near the byline and added to the article JSON-LD as an additional `Person` in a `reviewedBy`-style extension (schema.org doesn't have a first-class "reviewedBy" property for Article, so this would likely surface as a visible on-page credit rather than a JSON-LD field, pending confirmation of the intended schema pattern). Only wire this up once real reviewers with genuine medical/admissions credentials are identified — never populate with a placeholder name.
