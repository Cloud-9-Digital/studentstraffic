import { env } from "@/lib/env";

/**
 * Calls the running Next.js server's /api/revalidate route so cache tags set
 * via cacheTag() actually get invalidated after an out-of-band script writes
 * to the database. Calling revalidateTag() directly from a standalone script
 * would not work -- it has no connection to the actual running server process.
 */
type RevalidateOptions = {
  /**
   * Required, so no caller inherits the catalogue additions by accident.
   * - "catalog": adds the bounded discovery-index tags and index paths; must
   *   target slugs or paths, or the route expires every catalogue route pattern.
   * - "guide": maps slugs to guide:<slug> and /<slug>; adds no shared tags.
   * - "exact": sends only the given tags and paths.
   * - "blog": blog posts only.
   */
  scope: "blog" | "catalog" | "guide" | "exact";
  slugs?: string[];
  paths?: string[];
};

// These tags regenerate the entire catalogue against Neon (2026-09-09 outage).
// Scripts send entity-scoped tags instead; see
// docs/university-pipeline-architecture.md and tests/db-egress-guards.test.ts.
const SHARED_CATALOGUE_TAGS = new Set(["catalog", "universities", "countries", "courses"]);

export async function triggerRevalidate(
  tags: string[],
  options: RevalidateOptions,
) {
  const sharedTags = tags.filter((tag) => SHARED_CATALOGUE_TAGS.has(tag));
  if (sharedTags.length > 0) {
    throw new Error(
      `Refusing to expire shared cache tag(s) ${sharedTags.join(", ")}. Send entity-scoped tags and exact paths instead.`,
    );
  }
  if (options.scope === "catalog" && !options.slugs?.length && !options.paths?.length) {
    throw new Error(
      "scope \"catalog\" needs slugs or paths; without a target the route expires every catalogue route pattern.",
    );
  }

  if (!env.siteUrl || !env.revalidateSecret) {
    console.warn(
      "Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.",
    );
    return;
  }

  const endpoint = new URL("/api/revalidate", env.siteUrl);
  endpoint.searchParams.set("scope", options.scope);
  for (const tag of tags) endpoint.searchParams.append("tag", tag);
  for (const slug of options.slugs ?? []) endpoint.searchParams.append("slug", slug);
  for (const path of options.paths ?? []) endpoint.searchParams.append("path", path);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.revalidateSecret}` },
    });

    if (!response.ok) {
      console.warn(`Cache revalidation request failed: ${response.status} ${await response.text()}`);
      return;
    }

    console.log(
      `Revalidated ${tags.length} cache tag(s), ${options.slugs?.length ?? 0} slug(s), and ${options.paths?.length ?? 0} path(s).`,
    );
  } catch (error) {
    console.warn("Cache revalidation request errored:", error);
  }
}
