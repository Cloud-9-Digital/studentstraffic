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

const catalogDynamicPagePaths = [
  "/university/[slug]",
  "/[slug]",
  "/courses/[slug]",
  "/countries/[slug]",
] as const;

const catalogStaticPaths = [
  "/universities",
  "/courses",
  "/countries",
  "/compare",
  "/budget",
  "/api/comparisons",
  "/api/courses-directory",
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

    // Always expire the blog detail route shell. With Cache Components, an
    // exact path/tag invalidation can leave the shared dynamic shell serving a
    // previously cached not-found result for a newly published database slug.
    // Post data remains slug-tagged, so this does not flush every article's
    // data cache. Category shells only need broad blog revalidation.
    dynamicPagePaths.add("/blog/[slug]");

    if (slugs.length === 0) {
      dynamicPagePaths.add("/blog/category/[slug]");
    }

    for (const slug of slugs) {
      staticPaths.add(`/blog/${slug}`);
      tags.add(`blog:${slug}`);
    }
  }

  if (scope === "catalog") {
    tags.add("finder");
    tags.add("program-offerings");
    tags.add("comparison-guides");
    tags.add("budget-guides");

    for (const path of catalogStaticPaths) {
      staticPaths.add(path);
    }

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

    const countrySlugs = new Set<string>();

    for (const tag of tags) {
      const match = tag.match(/^country:([^:]+)$/);
      if (match) {
        countrySlugs.add(match[1]);
      }
    }

    for (const path of [...staticPaths]) {
      const match = path.match(/^\/countries\/([^/]+)$/);
      if (match) {
        countrySlugs.add(match[1]);
      }
    }

    // Country pages use the shared cached country snapshot. A country-specific
    // publish must expire that snapshot as well as its own route; otherwise a
    // newly inserted country can keep rendering the prior cached null value.
    if (countrySlugs.size > 0) {
      tags.add("catalog");
      tags.add("countries");
      dynamicPagePaths.add("/countries/[slug]");

      for (const countrySlug of countrySlugs) {
        tags.add(`country:${countrySlug}`);
        staticPaths.add(`/countries/${countrySlug}`);
      }
    }

    if (slugs.length > 0) {
      // With Cache Components, the root dynamic route can retain the
      // build-time fallback shell even after an exact path is expired. Expire
      // that rendered shell as well. Programme data remains slug-scoped, so
      // unrelated pages reuse their existing data caches when regenerated.
      dynamicPagePaths.add("/[slug]");
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
