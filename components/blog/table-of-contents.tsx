import { ChevronDown } from "lucide-react";
import GithubSlugger from "github-slugger";

type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

// Mirrors rehype-slug's behavior closely enough for our own markdown source:
// walk headings in document order through the same slugger implementation
// rehype-slug uses internally, so anchors generated here match the ids
// MarkdownContent renders onto the actual <h2>/<h3> elements.
function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // markdown links -> text
      .replace(/[*_`~]/g, "") // emphasis / code / strikethrough markers
      .trim();
    if (!text) continue;

    const id = slugger.slug(text);

    // Track every heading level in the slugger so duplicate-text dedupe stays
    // in sync with rehype-slug (which slugs all heading levels, not just h2/h3),
    // but only surface h2/h3 in the visible table of contents.
    if (level === 2 || level === 3) {
      headings.push({ id, text, level: level as 2 | 3 });
    }
  }

  return headings;
}

const MIN_HEADINGS_FOR_TOC = 3;

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < MIN_HEADINGS_FOR_TOC) return null;

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <details className="group rounded-2xl border border-border bg-card p-5 md:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <ol className="mt-4 space-y-2 text-[13px] leading-snug">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={heading.level === 3 ? "ml-4" : undefined}
            >
              <a
                href={`#${heading.id}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
