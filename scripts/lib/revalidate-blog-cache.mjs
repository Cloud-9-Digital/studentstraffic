const DEFAULT_VERIFY_ATTEMPTS = 5;
const DEFAULT_VERIFY_DELAY_MS = 1_500;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function revalidatePublishedBlog({
  slug,
  siteUrl,
  revalidateSecret,
  fetchImpl = fetch,
  verifyAttempts = DEFAULT_VERIFY_ATTEMPTS,
  verifyDelayMs = DEFAULT_VERIFY_DELAY_MS,
}) {
  if (!slug) throw new Error("A published blog slug is required.");
  if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL is required.");
  if (!revalidateSecret) throw new Error("REVALIDATE_SECRET is required.");

  const endpoint = new URL("/api/revalidate?scope=blog", siteUrl);
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${revalidateSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Blog cache revalidation failed for ${slug}: ${response.status} ${responseText}`,
    );
  }

  const publishedUrl = new URL(`/blog/${encodeURIComponent(slug)}`, siteUrl);
  let lastStatus = 0;

  for (let attempt = 1; attempt <= verifyAttempts; attempt += 1) {
    const verification = await fetchImpl(publishedUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    lastStatus = verification.status;
    const html = await verification.text();
    const renderedNotFound = html.includes("NEXT_HTTP_ERROR_FALLBACK;404");

    if (verification.ok && !renderedNotFound) {
      return {
        slug,
        publishedUrl: publishedUrl.toString(),
        revalidation: responseText,
        verificationStatus: verification.status,
      };
    }

    if (attempt < verifyAttempts) await wait(verifyDelayMs);
  }

  throw new Error(
    `Blog ${slug} was published but ${publishedUrl} still rendered the not-found page (HTTP ${lastStatus}) after cache revalidation.`,
  );
}
