import { env } from "@/lib/env";

/**
 * Calls the running Next.js server's /api/revalidate route so cache tags set
 * via cacheTag() actually get invalidated after an out-of-band script writes
 * to the database. Calling revalidateTag() directly from a standalone script
 * would not work -- it has no connection to the actual running server process.
 */
export async function triggerRevalidate(tags: string[]) {
  if (!env.siteUrl || !env.revalidateSecret) {
    console.warn(
      "Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.",
    );
    return;
  }

  const endpoint = new URL("/api/revalidate", env.siteUrl);
  for (const tag of tags) endpoint.searchParams.append("tag", tag);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.revalidateSecret}` },
    });

    if (!response.ok) {
      console.warn(`Cache revalidation request failed: ${response.status} ${await response.text()}`);
      return;
    }

    console.log(`Revalidated cache tags: ${tags.join(", ")}`);
  } catch (error) {
    console.warn("Cache revalidation request errored:", error);
  }
}
