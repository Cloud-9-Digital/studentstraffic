/**
 * WebMCP (https://webmachinelearning.github.io/webmcp/): read-only tools a
 * browser agent can call on this site. Registered by
 * components/site/webmcp-tools.tsx; covered by tests/webmcp.test.ts.
 *
 * No tool submits the lead form, sends personal data or writes anything.
 * Every request goes to this site's own origin.
 */

type ToolExecute = (
  input: Record<string, unknown>,
  options?: { signal?: AbortSignal },
) => Promise<unknown>;

export type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: ToolExecute;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
};

export type ModelContextLike = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => unknown;
};

/**
 * The spec exposes `document.modelContext`; Chrome's early preview used
 * `navigator.modelContext`. Returns null when neither exists.
 */
export function getModelContext(
  doc: unknown = typeof document === "undefined" ? undefined : document,
  nav: unknown = typeof navigator === "undefined" ? undefined : navigator,
): ModelContextLike | null {
  for (const host of [doc, nav]) {
    const context = (host as { modelContext?: ModelContextLike } | undefined)
      ?.modelContext;
    if (context && typeof context.registerTool === "function") return context;
  }
  return null;
}

const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";
const slugRegExp = new RegExp(SLUG_PATTERN);
// University, country and root-level (programme, guide) pages only.
const PAGE_PATH_PATTERN = "^/(?:(?:university|countries)/)?[a-z0-9]+(?:-[a-z0-9]+)*$";
const pagePathRegExp = new RegExp(PAGE_PATH_PATTERN);
// Account and utility pages that share the root-level path shape.
const BLOCKED_ROOT_PATHS = new Set([
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/calls",
  "/delete-account",
  "/thank-you",
  "/join",
]);

export function isOpenablePagePath(path: string) {
  return pagePathRegExp.test(path) && !BLOCKED_ROOT_PATHS.has(path);
}

export type SiteToolDeps = {
  origin: string;
  fetch: typeof fetch;
  navigate: (url: string) => void;
};

type Suggestion = { type: string; label: string; subtitle: string; href: string };

export function createSiteTools(deps: SiteToolDeps): WebMcpTool[] {
  const toUrl = (path: string) => new URL(path, deps.origin).toString();

  return [
    {
      name: "search_catalog",
      title: "Search universities and courses",
      description:
        "Search Students Traffic for universities, Indian medical colleges, countries, courses and course guides by name or city. Returns matches with their page URLs.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            description: "University, college, city, country or course name, e.g. 'MBBS in Georgia' or 'Chennai'.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      async execute(input, options) {
        const query = String(input.query ?? "").trim().slice(0, 120);
        if (query.length < 2) return { results: [] };
        // Same endpoint as the site search box.
        const response = await deps.fetch(
          toUrl(`/api/suggestions?q=${encodeURIComponent(query)}`),
          { signal: options?.signal, headers: { Accept: "application/json" } },
        );
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const suggestions = (await response.json()) as Suggestion[];
        return {
          results: suggestions.map((item) => ({
            type: item.type,
            name: item.label,
            detail: item.subtitle,
            url: toUrl(item.href),
          })),
        };
      },
    },
    {
      name: "get_university_details",
      title: "Get university details",
      description:
        "Get a university's published profile as markdown: key facts, recognition, programmes with fees, admissions, student life, FAQs and sources. Use the slug from a /university/{slug} URL.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            pattern: SLUG_PATTERN,
            description: "University slug, e.g. 'jamia-millia-islamia'.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      async execute(input, options) {
        const slug = String(input.slug ?? "");
        if (!slugRegExp.test(slug)) throw new Error("Invalid university slug");
        const response = await deps.fetch(toUrl(`/university/${slug}`), {
          signal: options?.signal,
          headers: { Accept: "text/markdown" },
        });
        if (!response.ok) throw new Error(`University not found (${response.status})`);
        return response.text();
      },
    },
    {
      name: "open_page",
      title: "Open a page",
      description:
        "Open a university, programme, guide or country page on Students Traffic in this tab. Accepts a site path such as /university/{slug}, /countries/{slug} or /{programme-slug}.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            pattern: PAGE_PATH_PATTERN,
            description: "Path on this site, e.g. '/university/jamia-millia-islamia'.",
          },
        },
        required: ["path"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        const path = String(input.path ?? "");
        if (!isOpenablePagePath(path)) throw new Error("Only university, programme, guide and country pages on this site can be opened");
        const url = toUrl(path);
        deps.navigate(url);
        return { opened: url };
      },
    },
  ];
}

/**
 * Registers the site tools. Aborting `signal` unregisters them (spec); the
 * preview API's `unregister()` handle is honoured too. Never throws.
 */
export function registerSiteTools(
  context: ModelContextLike,
  deps: SiteToolDeps,
  signal: AbortSignal,
) {
  for (const tool of createSiteTools(deps)) {
    try {
      const result = context.registerTool(tool, { signal });
      if (result && typeof (result as Promise<unknown>).catch === "function") {
        // The spec rejects the registration promise with the abort reason.
        (result as Promise<unknown>).catch(() => {});
      }
      const handle = result as { unregister?: () => void } | undefined;
      if (handle && typeof handle.unregister === "function") {
        signal.addEventListener("abort", () => handle.unregister?.(), { once: true });
      }
    } catch {
      // A browser that rejects one tool should not break the page.
    }
  }
}
