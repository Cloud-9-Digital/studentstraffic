// Bounded BFS crawl from real entry points (home, catalog, country/course
// index pages) to check how much of the catalog is actually discoverable by
// following real <a href> links, vs. only reachable via sitemap submission.
// Prints progress as it goes. Usage: node scripts/find-orphan-pages.mjs [maxPages]

const BASE = "https://www.studentstraffic.com";
const MAX_PAGES = parseInt(process.argv[2] || "1500", 10);
const CONCURRENCY = 10;

function normalize(href, from) {
  try {
    const url = new URL(href, from);
    if (url.origin !== BASE) return null;
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function extractLinks(html, pageUrl) {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  return hrefs
    .map((h) => normalize(h, pageUrl))
    .filter(Boolean)
    .filter((u) => !u.match(/\.(png|jpg|jpeg|svg|webp|ico|pdf|css|js|xml|json)(\?|$)/i));
}

async function main() {
  const seeds = [
    "/",
    "/universities",
    "/countries",
    "/courses",
    "/compare",
    "/budget",
    "/blog",
    "/mbbs-abroad",
  ];

  const visited = new Set();
  const discoveredUniversities = new Set();
  const discoveredPrograms = new Set();
  const queue = [...seeds.map((s) => BASE + s)];
  let processed = 0;

  async function worker() {
    while (queue.length && visited.size < MAX_PAGES) {
      const url = queue.shift();
      if (!url || visited.has(url)) continue;
      visited.add(url);
      processed++;

      if (processed % 50 === 0) {
        console.log(
          `progress: visited=${visited.size} queued=${queue.length} universities_found=${discoveredUniversities.size} program_pages_found=${discoveredPrograms.size}`
        );
      }

      try {
        const res = await fetch(url);
        if (res.status !== 200) continue;
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) continue;
        const html = await res.text();

        for (const link of extractLinks(html, url)) {
          const path = new URL(link).pathname;
          if (path.startsWith("/university/")) {
            discoveredUniversities.add(path.replace("/university/", ""));
          }
          if (!visited.has(link) && !queue.includes(link) && queue.length + visited.size < MAX_PAGES) {
            queue.push(link);
          }
        }
      } catch (err) {
        console.log(`error fetching ${url}: ${err.message}`);
      }
    }
  }

  console.log(`Starting bounded crawl, cap=${MAX_PAGES} pages, seeds=${seeds.length}`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nDone. Visited ${visited.size} pages.`);
  console.log(`Discovered ${discoveredUniversities.size} distinct university slugs via real links.`);

  console.log(`\nDISCOVERED_UNIVERSITY_SLUGS_JSON_START`);
  console.log(JSON.stringify([...discoveredUniversities]));
  console.log(`DISCOVERED_UNIVERSITY_SLUGS_JSON_END`);
}

main();
