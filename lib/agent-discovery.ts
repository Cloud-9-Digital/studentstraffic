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
 * Kill switch for the public MCP server (/mcp), its server card and its API
 * catalog entry. Enabled unless MCP_SERVER_ENABLED is "false" (or "0"/"off").
 * Kept here, import-free, because next.config.ts reads it for the home page
 * Link header. On Vercel an env change takes effect on the next deployment.
 */
export function isMcpServerEnabled(value = process.env.MCP_SERVER_ENABLED) {
  return !["false", "0", "off", "no"].includes((value ?? "").trim().toLowerCase());
}

/**
 * RFC 8288 Link header for the home page HTML: where agents find the site
 * description (llms.txt), the agent skills index, the markdown view and the
 * RFC 9727 API catalog (public REST API and MCP server).
 * Relative targets resolve against https://www.studentstraffic.com; the apex
 * domain is a Vercel 307 to www that never reaches this app.
 */
const HOME_LINKS = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</index.md>; rel="alternate"; type="text/markdown"',
];

/** The API catalog lists only the MCP server, so it is advertised only while that is on. */
const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"';

export function getHomeLinkHeader(mcpEnabled = isMcpServerEnabled()) {
  return [...HOME_LINKS, ...(mcpEnabled ? [API_CATALOG_LINK] : [])].join(", ");
}

export const HOME_LINK_HEADER = getHomeLinkHeader(true);

export function getHomeLinkHeaderRule(mcpEnabled = isMcpServerEnabled()) {
  return {
    source: "/",
    // The markdown view sends its own canonical Link.
    missing: acceptsMarkdown,
    headers: [{ key: "Link", value: getHomeLinkHeader(mcpEnabled) }],
  };
}
