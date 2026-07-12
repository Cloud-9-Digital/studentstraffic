import { env } from "@/lib/env";

/**
 * Calls the running Next.js server's /api/revalidate route so cache tags set
 * via cacheTag() actually get invalidated after an out-of-band script writes
 * to the database. Calling revalidateTag() directly from a standalone script
 * would not work -- it has no connection to the actual running server process.
 */
type RevalidateOptions = {
  scope?: "blog" | "catalog";
  slugs?: string[];
  paths?: string[];
};

export async function triggerRevalidate(
  tags: string[],
  options: RevalidateOptions = {},
) {
  if (!env.siteUrl || !env.revalidateSecret) {
    console.warn(
      "Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.",
    );
    return;
  }

  const endpoint = new URL("/api/revalidate", env.siteUrl);
  endpoint.searchParams.set("scope", options.scope ?? "catalog");
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
