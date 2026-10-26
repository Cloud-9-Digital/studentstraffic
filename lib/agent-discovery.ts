/**
 * Routing for agent-facing views, kept free of imports so next.config.ts can
 * load it. Covered by tests/agent-discovery.test.ts.
 *
 * Markdown for Agents (content negotiation): a request whose Accept header
 * names `text/markdown` is rewritten to a markdown route handler under /md/.
 * Browsers never send `text/markdown`, so they keep getting HTML. The
 * markdown and HTML responses live at different internal paths, so the CDN
 * never serves one from the other's cache entry; the markdown response also
 * sends `Vary: Accept` for shared caches (lib/agent-markdown.ts).
 */

/** `has` value for next.config rewrites: Accept mentions text/markdown. */
export const MARKDOWN_ACCEPT_PATTERN = "(.*)text/markdown(.*)";

const acceptsMarkdown = [
  { type: "header" as const, key: "accept", value: MARKDOWN_ACCEPT_PATTERN },
];

type Rewrite = {
  source: string;
  destination: string;
  has?: typeof acceptsMarkdown;
};

/**
 * Same test the rewrites apply, for code and tests outside the router. Next
 * anchors `has` values as ^…$ when matching.
 */
export function requestsMarkdown(accept: string | null | undefined) {
  return new RegExp(`^${MARKDOWN_ACCEPT_PATTERN}$`).test(accept ?? "");
}

export function getMarkdownRewrites(): {
  beforeFiles: Rewrite[];
  afterFiles: Rewrite[];
} {
  return {
    // beforeFiles win over the /university/[slug], /countries/[slug] and
    // /[slug] page routes.
    beforeFiles: [
      { source: "/index.md", destination: "/md/home" },
      { source: "/", has: acceptsMarkdown, destination: "/md/home" },
      {
        source: "/university/:slug([^/.]+)\\.md",
        destination: "/md/university/:slug",
      },
      {
        source: "/university/:slug([^/.]+)",
        has: acceptsMarkdown,
        destination: "/md/university/:slug",
      },
      {
        source: "/countries/:slug([^/.]+)\\.md",
        destination: "/md/country/:slug",
      },
      {
        source: "/countries/:slug([^/.]+)",
        has: acceptsMarkdown,
        destination: "/md/country/:slug",
      },
      {
        source: "/:slug([^/.]+)\\.md",
        destination: "/md/programme/:slug",
      },
    ],
    // afterFiles run after static routes (/about, /contact, /countries …) have
    // been matched, so only slugs that would reach the /[slug] page
    // (programmes, landing pages, study-abroad guides) are negotiated.
    afterFiles: [
      {
        source: "/:slug([^/.]+)",
        has: acceptsMarkdown,
        destination: "/md/programme/:slug",
      },
    ],
  };
}

/**
 * RFC 8288 Link header for the home page HTML: where agents find the site
 * description (llms.txt), the agent skills index and the markdown view.
 * Relative targets resolve against https://www.studentstraffic.com; the apex
 * domain is a Vercel 307 to www that never reaches this app.
 */
export const HOME_LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</index.md>; rel="alternate"; type="text/markdown"',
].join(", ");

export function getHomeLinkHeaderRule() {
  return {
    source: "/",
    // The markdown view sends its own canonical Link.
    missing: acceptsMarkdown,
    headers: [{ key: "Link", value: HOME_LINK_HEADER }],
  };
}
