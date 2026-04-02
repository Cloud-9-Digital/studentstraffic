import "dotenv/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const revalidateSecret = process.env.REVALIDATE_SECRET;

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required.");
}

if (!revalidateSecret) {
  throw new Error("REVALIDATE_SECRET is required.");
}

const slugs = process.argv.slice(2).filter(Boolean);
const endpoint = new URL("/api/revalidate?scope=blog", siteUrl);

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${revalidateSecret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(slugs.length > 0 ? { slug: slugs } : {}),
});

const text = await response.text();

if (!response.ok) {
  throw new Error(`Revalidation failed: ${response.status} ${text}`);
}

console.log(text);
