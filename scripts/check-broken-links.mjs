// Crawls the live site starting from sitemap.xml, following every internal
// <a href> it finds, and reports any URL that doesn't return 200.
// Usage: node scripts/check-broken-links.mjs [baseUrl]

const BASE = process.argv[2] || "https://www.studentstraffic.com";
const CONCURRENCY = 8;

function normalize(href, from) {
  try {
    const url = new URL(href, from);
    if (url.origin !== new URL(BASE).origin) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

async function getSitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls.filter((u) => !u.endsWith(".xml"));
}

function extractLinks(html, pageUrl) {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  return hrefs
    .map((h) => normalize(h, pageUrl))
    .filter(Boolean)
    .filter((u) => !u.match(/\.(png|jpg|jpeg|svg|webp|ico|pdf|css|js|xml|json)(\?|$)/i));
}

async function main() {
  const seed = await getSitemapUrls();
  console.log(`Seeding crawl with ${seed.length} sitemap URLs`);

  const visited = new Map(); // url -> status
  const referrers = new Map(); // url -> Set of pages linking to it
  const queue = [...seed];
  seed.forEach((u) => referrers.set(u, new Set(["sitemap.xml"])));

  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      if (!url || visited.has(url)) continue;
      visited.set(url, "pending");

      try {
        const res = await fetch(url, { redirect: "follow" });
        visited.set(url, res.status);

        if (res.status === 200 && res.headers.get("content-type")?.includes("text/html")) {
          const html = await res.text();
          for (const link of extractLinks(html, url)) {
            if (!referrers.has(link)) referrers.set(link, new Set());
            referrers.get(link).add(url);
            if (!visited.has(link) && !queue.includes(link)) {
              queue.push(link);
            }
          }
        }
      } catch (err) {
        visited.set(url, `error: ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const broken = [...visited.entries()].filter(
    ([, status]) => status !== 200
  );

  console.log(`\nCrawled ${visited.size} URLs total.\n`);

  if (broken.length === 0) {
    console.log("No broken links found.");
    return;
  }

  console.log(`Found ${broken.length} broken URL(s):\n`);
  for (const [url, status] of broken) {
    const from = [...(referrers.get(url) ?? [])].slice(0, 3).join(", ");
    console.log(`[${status}] ${url}`);
    console.log(`    linked from: ${from}`);
  }
}

main();
