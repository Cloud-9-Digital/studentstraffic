import dotenv from "dotenv";
import { revalidatePublishedBlog } from "./lib/revalidate-blog-cache.mjs";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const revalidateSecret = process.env.REVALIDATE_SECRET;

if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required.");
}

if (!revalidateSecret) {
  throw new Error("REVALIDATE_SECRET is required.");
}

const slugs = [...new Set(process.argv.slice(2).map((slug) => slug.trim()).filter(Boolean))];

if (slugs.length === 0) {
  throw new Error(
    "At least one blog slug is required. Usage: npm run cache:revalidate:blog -- <slug>",
  );
}

for (const slug of slugs) {
  const result = await revalidatePublishedBlog({
    slug,
    siteUrl,
    revalidateSecret,
  });
  console.log(JSON.stringify(result));
}
