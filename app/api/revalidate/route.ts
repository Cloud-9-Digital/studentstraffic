import { timingSafeEqual } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

type RevalidateRequest = {
  scope?: string;
  slug?: string | string[];
  tag?: string | string[];
  path?: string | string[];
  secret?: string;
};

const blogStaticPaths = [
  "/blog",
  "/blog/feed.xml",
  "/llms-full.txt",
  "/sitemap.xml",
];

const blogDynamicPagePaths = [
  "/blog/[slug]",
  "/blog/category/[slug]",
] as const;

const catalogDynamicPagePaths = [
  "/university/[slug]",
  "/[slug]",
  "/courses/[slug]",
  "/countries/[slug]",
] as const;

function parseStringList(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function secretsMatch(input: string | null, expected: string | undefined) {
  if (!input || !expected) {
    return false;
  }

  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim() || null;
}

async function parseBody(request: NextRequest): Promise<RevalidateRequest> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {};
  }

  try {
    return (await request.json()) as RevalidateRequest;
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  if (!env.revalidateSecret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET is not configured." },
      { status: 503 }
    );
  }

  const body = await parseBody(request);
  const providedSecret = body.secret ?? getBearerToken(request);

  if (!secretsMatch(providedSecret ?? null, env.revalidateSecret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const scope =
    (typeof body.scope === "string" ? body.scope : null) ??
    request.nextUrl.searchParams.get("scope") ??
    "blog";

  const slugs = [
    ...parseStringList(body.slug),
    ...request.nextUrl.searchParams.getAll("slug").map((slug) => slug.trim()).filter(Boolean),
  ];
  const tags = new Set<string>([
    ...parseStringList(body.tag),
    ...request.nextUrl.searchParams.getAll("tag").map((tag) => tag.trim()).filter(Boolean),
  ]);
  const staticPaths = new Set<string>([
    ...parseStringList(body.path),
    ...request.nextUrl.searchParams.getAll("path").map((path) => path.trim()).filter(Boolean),
  ]);
  const dynamicPagePaths = new Set<string>();

  if (scope === "blog") {
    tags.add("blog");

    for (const path of blogStaticPaths) {
      staticPaths.add(path);
    }

    // A slug-specific publish should not invalidate every cached blog detail
    // page. Only a broad blog revalidation needs the dynamic route pattern.
    if (slugs.length === 0) {
      for (const path of blogDynamicPagePaths) {
        dynamicPagePaths.add(path);
      }
    }

    for (const slug of slugs) {
      staticPaths.add(`/blog/${slug}`);
      tags.add(`blog:${slug}`);
    }
  }

  if (scope === "catalog") {
    // revalidateTag() alone busts the "use cache" data entries (getUniversityBySlug etc.)
    // but does not regenerate the prerendered route shell — generateMetadata's output
    // (e.g. the <title> tag) stays stale until the dynamic route pattern itself is
    // revalidated. Without this, a newly published university/program renders correct
    // body content (dynamic per-request via connection()) but keeps a stale/"Not Found"
    // <title> from the last prerendered shell. See catalogDynamicPagePaths below.
    if (slugs.length === 0) {
      for (const path of catalogDynamicPagePaths) {
        dynamicPagePaths.add(path);
      }
    }

    // A programme publish only expires that programme's data and rendered
    // route. The next request regenerates it and stores it in the normal
    // long-lived catalogue cache without flushing unrelated programme pages.
    for (const slug of slugs) {
      tags.add(`program:${slug}`);
      staticPaths.add(`/${slug}`);
    }
  }

  if (tags.size === 0 && staticPaths.size === 0 && dynamicPagePaths.size === 0) {
    return NextResponse.json(
      { ok: false, error: "Nothing to revalidate." },
      { status: 400 }
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of staticPaths) {
    revalidatePath(path);
  }

  for (const path of dynamicPagePaths) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({
    ok: true,
    scope,
    tags: [...tags],
    staticPaths: [...staticPaths],
    dynamicPagePaths: [...dynamicPagePaths],
    slugs,
    revalidatedAt: new Date().toISOString(),
  });
}
