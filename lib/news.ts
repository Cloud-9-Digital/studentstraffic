import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/lib/env";

export type NewsArticle = {
  title: string;
  url: string;
  source: string;
  sourceDomain: string | null;
  imageUrl: string | null;
  publishedAt: Date;
};

// Queries are intentionally narrow to avoid school/board/CBSE content.
// Use -term exclusions for both GNews API and Google News RSS.
const QUERIES = [
  "NMC India medical university approved overseas license -cbse -school -board",
  "medical university accreditation WDOMS WHO recognition overseas -cbse -school",
  "FMGE NExT USMLE PLAB medical licensing exam India -school -board -class",
  "overseas medical college India students policy -cbse -school -board -class",
  "study abroad university visa India -cbse -school -board -class10 -class12",
  "nursing engineering MBA university abroad India -school -board -cbse",
];

// ── Promotional filter ────────────────────────────────────────────────────

const PROMO_TITLE_PATTERNS = [
  // Listicles — allow one optional word between number and noun ("7 key reasons", "5 top ways")
  /\btop\s+\d+\b/i,
  /\bbest\s+\d+\b/i,
  /\b\d+\s+(\w+\s+)?(reasons?|tips?|ways?|things?|facts?|mistakes?|benefits?|colleges?|universities)\b/i,
  // Admission sales / announcements
  /\badmissions?\s+(open|now|2025|2026)\b/i,
  /\bannounces?\s+(admissions?|enrollment|intake|batch)\b/i,
  /\b(applications?|enrollment|registration|intake)\s+(now\s+)?(open|live|started|begin)\b/i,
  /\bnow\s+(accepting|open)\b/i,
  /\bdirect\s+admission\b/i,
  /\bapply\s+now\b/i,
  /\bseats?\s+(available|filling|left|open|limited)\b/i,
  /\blast\s+(few\s+)?seats?\b/i,
  /\bhurry\b/i,
  // Promotional pricing
  /\blow[- ]cost\s+mbbs\b/i,
  /\bcheap(est)?\s+mbbs\b/i,
  /\baffordable\s+mbbs\b/i,
  // SEO / opinion / guide content
  /\bcomplete\s+guide\b/i,
  /\beverything\s+(you\s+need|about|to\s+know)\b/i,
  /\bhow\s+to\s+(get|secure|apply\s+for|obtain)\s+admission\b/i,
  /\bfull\s+scholarship\b/i,
  /\bguide\s+(for|to)\s+(indian\s+students|mbbs|nursing|engineering)\b/i,
  /\bstep[- ]by[- ]step\b/i,
  /\ball\s+you\s+need\s+to\s+know\b/i,
  /\bultimate\s+guide\b/i,
  /\bwhy\s+indian\s+students\s+(are|should|must|prefer)\b/i,
  // School / board content
  /\bcbse\b/i,
  /\bboard\s+exam(s|ination)?\b/i,
  /\bclass\s+1[02]\b/i,
  /\b(10th|12th)\s+(result|exam|board)\b/i,
];

// Known promotional/consultancy domains — add any new ones here
const PROMO_DOMAINS = new Set([
  // PhysicsWallah — EdTech blog content, not journalism
  "pw.live",
  "physicswallah.live",
  "physicswallah.com",
  // Education portals — promotional college listings, not journalism
  "shiksha.com",
  "collegedunia.com",
  "careers360.com",
  "getmyuni.com",
  "collegesearch.in",
  // MBBS consultancy sites
  "mbbsexperts.com",
  "mbbsadmission.net",
  "mbbsblog.com",
  "studymbbs.com",
  "mbbsindiaabroad.com",
  "overseas-education.in",
  "mbbscouncil.org",
  "admissionmbbs.com",
  "mbbsstudyabroad.com",
  "foreignadmissions.com",
  "studyabroadexperts.in",
  "mbbsinabroad.com",
  "getadmissionabroad.com",
  // PR wire / press release aggregators — not journalism
  "bignewsnetwork.com",
  "indiacalling.in",
  "indiatoday.in",
  "newswire.com",
  "prnewswire.com",
  "businesswire.com",
  "globenewswire.com",
  "einpresswire.com",
  "aninews.in",
]);

function isPromotional(article: NewsArticle): boolean {
  if (article.sourceDomain && PROMO_DOMAINS.has(article.sourceDomain)) return true;
  return PROMO_TITLE_PATTERNS.some((p) => p.test(article.title));
}

// ── GNews API (returns images) ────────────────────────────────────────────

interface GNewsItem {
  title: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

async function fetchGNews(query: string, apiKey: string): Promise<NewsArticle[]> {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: GNewsItem[] };
    return (data.articles ?? []).map((a) => {
      let sourceDomain: string | null = null;
      try { sourceDomain = new URL(a.source.url).hostname.replace(/^www\./, ""); } catch {}
      return {
        title: a.title,
        url: a.url,
        source: a.source.name,
        sourceDomain,
        imageUrl: a.image ?? null,
        publishedAt: new Date(a.publishedAt),
      };
    });
  } catch {
    return [];
  }
}

// ── Google News RSS fallback (no images) ─────────────────────────────────

function extractTagText(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "s"));
  if (cdata) return cdata[1];
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "s"));
  return plain ? plain[1].trim() : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&#\d+;/g, "").trim();
}

function parseRssItems(xml: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null) {
    const item = match[1];

    const rawTitle = extractTagText(item, "title");
    if (!rawTitle) continue;

    const lastDash = rawTitle.lastIndexOf(" - ");
    const title = lastDash > 0 ? rawTitle.substring(0, lastDash).trim() : rawTitle.trim();
    const fallbackSource = lastDash > 0 ? rawTitle.substring(lastDash + 3).trim() : "";

    const link = extractTagText(item, "link");
    if (!link || !link.startsWith("http")) continue;

    const sourceMatch = item.match(/<source\s+url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    const sourceUrlRaw = sourceMatch?.[1] ?? null;
    const source = sourceMatch ? stripHtml(sourceMatch[2]) : fallbackSource;

    let sourceDomain: string | null = null;
    try { if (sourceUrlRaw) sourceDomain = new URL(sourceUrlRaw).hostname.replace(/^www\./, ""); } catch {}

    const pubDateStr = extractTagText(item, "pubDate");
    const publishedAt = pubDateStr ? new Date(pubDateStr) : new Date(0);

    if (title && source) {
      articles.push({ title, url: link, source, sourceDomain, imageUrl: null, publishedAt });
    }
  }

  return articles;
}

async function fetchRss(query: string): Promise<NewsArticle[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StudentsTrafficBot/1.0)" },
    });
    if (!res.ok) return [];
    return parseRssItems(await res.text());
  } catch {
    return [];
  }
}

// ── Public API ────────────────────────────────────────────────────────────

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
}

function dedupeAndSort(articles: NewsArticle[]): NewsArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  return articles
    .filter((a) => {
      if (isNaN(a.publishedAt.getTime())) return false;
      if (isPromotional(a)) return false;
      if (seenUrls.has(a.url)) return false;
      const nt = normalizeTitle(a.title);
      if (seenTitles.has(nt)) return false;
      seenUrls.add(a.url);
      seenTitles.add(nt);
      return true;
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 60);
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  "use cache";
  cacheLife({ stale: 0, revalidate: 7200, expire: 86400 });
  cacheTag("news");

  const apiKey = env.gNewsApiKey;

  if (apiKey) {
    const results = await Promise.all(QUERIES.map((q) => fetchGNews(q, apiKey)));
    return dedupeAndSort(results.flat());
  }

  const results = await Promise.all(QUERIES.map(fetchRss));
  return dedupeAndSort(results.flat());
}
