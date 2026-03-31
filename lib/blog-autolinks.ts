/**
 * Smart internal linking for blog posts.
 *
 * Builds a set of keyword → href rules from live DB data (countries,
 * universities, blog posts) plus a small set of static terms, then
 * injects markdown links into raw content — first occurrence per term,
 * skipping code blocks and existing links.
 */

import { desc, eq, ne } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { getCountries, getUniversities } from "@/lib/data/catalog";
import { getCountryHref, getUniversityHref } from "@/lib/routes";

export type LinkRule = {
  /** Exact text to match (case-insensitive, whole-word) */
  text: string;
  href: string;
  /** Lower priority rules are skipped if a higher-priority rule already used the same span */
  priority: number;
};

// ─── Static keyword rules ────────────────────────────────────────────────────
// These are important terms that have a canonical internal destination.

const STATIC_RULES: LinkRule[] = [
  { text: "FMGE",               href: "/blog/fmge-nmc-screening-test-2026-complete-preparation-guide", priority: 10 },
  { text: "NMC Screening Test", href: "/blog/fmge-nmc-screening-test-2026-complete-preparation-guide", priority: 10 },
  { text: "MBBS in Russia",     href: "/blog/mbbs-in-russia-2026-complete-guide",    priority: 10 },
  { text: "MBBS in Georgia",    href: "/blog/mbbs-in-georgia-2026-complete-guide",   priority: 10 },
  { text: "MBBS in Kyrgyzstan", href: "/blog/mbbs-in-kyrgyzstan-2026-complete-guide", priority: 10 },
  { text: "MBBS in Uzbekistan", href: "/blog/mbbs-in-uzbekistan-2026-complete-guide", priority: 10 },
  { text: "MBBS in Vietnam",    href: "/blog/mbbs-in-vietnam-2026-complete-guide",   priority: 10 },
];

// ─── Rule builder ─────────────────────────────────────────────────────────────

export const buildLinkRules = unstable_cache(
  async (currentSlug: string): Promise<LinkRule[]> => {
  const db = getDb();

  const [countries, universities, posts] = await Promise.all([
    getCountries(),
    getUniversities(),
    db
      ? db
          .select({ slug: blogPosts.slug, title: blogPosts.title })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"))
          // exclude current post — never self-link
          .then((rows) => rows.filter((r) => r.slug !== currentSlug))
      : Promise.resolve([]),
  ]);

  const rules: LinkRule[] = [...STATIC_RULES];

  // Country names → country guide pages (priority 8)
  for (const country of countries) {
    rules.push({ text: country.name, href: getCountryHref(country.slug), priority: 8 });
  }

  // University names → university pages (priority 6)
  // Sort by name length desc so longer names match before shorter prefixes
  const sortedUnis = [...universities].sort((a, b) => b.name.length - a.name.length);
  for (const uni of sortedUnis) {
    rules.push({ text: uni.name, href: getUniversityHref(uni.slug), priority: 6 });
  }

  // Deduplicate: if a static rule already covers a term, skip DB rule for same text
  const seen = new Set(STATIC_RULES.map((r) => r.text.toLowerCase()));
  return rules.filter((r) => {
    const key = r.text.toLowerCase();
    if (seen.has(key) && r.priority < 10) return false;
    seen.add(key);
    return true;
  });
},
  (currentSlug) => [`blog-autolinks-${currentSlug}`],
  { tags: ["blog", "catalog"], revalidate: 3600 }
);

// ─── Linkifier ────────────────────────────────────────────────────────────────

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Injects markdown links into `content` based on `rules`.
 *
 * Rules applied in priority desc, then length desc order.
 * Each term is linked at most once per article.
 * Protected zones (fenced code, inline code, existing links, headings) are skipped.
 */
export function linkifyMarkdown(content: string, rules: LinkRule[]): string {
  if (!rules.length) return content;

  // Sort: highest priority first, then longest text first (avoids partial matches)
  const sorted = [...rules].sort((a, b) =>
    b.priority !== a.priority ? b.priority - a.priority : b.text.length - a.text.length
  );

  // Regex that matches zones we must NOT touch
  const PROTECTED_RE =
    /(```[\s\S]*?```|`[^`\n]+`|\[([^\]]*)\]\([^)]*\)|^#{1,6}\s.+$)/gm;

  // Split content into protected and unprotected segments
  type Segment = { text: string; protected: boolean };
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PROTECTED_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: content.slice(lastIndex, match.index), protected: false });
    }
    segments.push({ text: match[0], protected: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex), protected: false });
  }

  // Track which terms have already been linked (global across entire article)
  const linked = new Set<string>();

  const processed = segments.map((seg) => {
    if (seg.protected) return seg.text;

    let text = seg.text;
    for (const rule of sorted) {
      const key = rule.text.toLowerCase();
      if (linked.has(key)) continue;

      // Whole-word, case-insensitive
      const re = new RegExp(`(?<![\\[*_\`])(${escapeRegex(rule.text)})(?![\\]*_\`(])`, "i");
      const found = re.exec(text);
      if (found) {
        // Use the exact casing found in the text, not the rule text
        const matched = found[1];
        text =
          text.slice(0, found.index) +
          `[${matched}](${rule.href})` +
          text.slice(found.index + matched.length);
        linked.add(key);
      }
    }
    return text;
  });

  return processed.join("");
}
