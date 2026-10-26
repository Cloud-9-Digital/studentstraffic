/**
 * WebMCP (https://webmachinelearning.github.io/webmcp/): read-only tools a
 * browser agent can call on this site. Covered by tests/webmcp.test.ts.
 *
 * The registration ships as a small inline script in the root layout's <head>
 * (WEBMCP_BOOTSTRAP_SCRIPT), so it runs while the page loads instead of after
 * React hydrates; agents and checkers look for tools on page load.
 *
 * No tool submits the lead form, sends personal data or writes anything.
 * Every request goes to this site's own origin.
 */

const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";
// University, country and root-level (programme, guide) pages only.
const PAGE_PATH_PATTERN = "^/(?:(?:university|countries)/)?[a-z0-9]+(?:-[a-z0-9]+)*$";
// Account and utility pages that share the root-level path shape.
const BLOCKED_ROOT_PATHS = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/calls",
  "/delete-account",
  "/thank-you",
  "/join",
];

/**
 * Plain ES2017 so it runs unbundled. `document.modelContext` is the spec;
 * Chrome's early preview used `navigator.modelContext`. Does nothing when
 * neither exists, and registers at most once per page.
 */
export const WEBMCP_BOOTSTRAP_SCRIPT = `(function () {
  var SLUG = new RegExp(${JSON.stringify(SLUG_PATTERN)});
  var PAGE = new RegExp(${JSON.stringify(PAGE_PATH_PATTERN)});
  var BLOCKED = ${JSON.stringify(BLOCKED_ROOT_PATHS)};
  function context() {
    var hosts = [document, navigator];
    for (var i = 0; i < hosts.length; i++) {
      var c = hosts[i] && hosts[i].modelContext;
      if (c && typeof c.registerTool === "function") return c;
    }
    return null;
  }
  function url(path) { return new URL(path, location.origin).toString(); }
  var tools = [
    {
      name: "search_catalog",
      title: "Search universities and courses",
      description: "Search Students Traffic for universities, Indian medical colleges, countries, courses and course guides by name or city. Returns matches with their page URLs.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", minLength: 2, maxLength: 120, description: "University, college, city, country or course name, e.g. 'MBBS in Georgia' or 'Chennai'." } },
        required: ["query"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      execute: async function (input, options) {
        var query = String((input && input.query) || "").trim().slice(0, 120);
        if (query.length < 2) return { results: [] };
        var response = await fetch(url("/api/suggestions?q=" + encodeURIComponent(query)), { signal: options && options.signal, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Search failed (" + response.status + ")");
        var items = await response.json();
        return { results: items.map(function (item) { return { type: item.type, name: item.label, detail: item.subtitle, url: url(item.href) }; }) };
      }
    },
    {
      name: "get_university_details",
      title: "Get university details",
      description: "Get a university's published profile as markdown: key facts, recognition, programmes with fees, admissions, student life, FAQs and sources. Use the slug from a /university/{slug} URL.",
      inputSchema: {
        type: "object",
        properties: { slug: { type: "string", pattern: SLUG.source, description: "University slug, e.g. 'jamia-millia-islamia'." } },
        required: ["slug"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      execute: async function (input, options) {
        var slug = String((input && input.slug) || "");
        if (!SLUG.test(slug)) throw new Error("Invalid university slug");
        var response = await fetch(url("/university/" + slug), { signal: options && options.signal, headers: { Accept: "text/markdown" } });
        if (!response.ok) throw new Error("University not found (" + response.status + ")");
        return response.text();
      }
    },
    {
      name: "open_page",
      title: "Open a page",
      description: "Open a university, programme, guide or country page on Students Traffic in this tab. Accepts a site path such as /university/{slug}, /countries/{slug} or /{programme-slug}.",
      inputSchema: {
        type: "object",
        properties: { path: { type: "string", pattern: PAGE.source, description: "Path on this site, e.g. '/university/jamia-millia-islamia'." } },
        required: ["path"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      execute: async function (input) {
        var path = String((input && input.path) || "");
        if (!PAGE.test(path) || BLOCKED.indexOf(path) !== -1) throw new Error("Only university, programme, guide and country pages on this site can be opened");
        var target = url(path);
        location.assign(target);
        return { opened: target };
      }
    }
  ];
  function register() {
    var c = context();
    if (!c || window.__stWebMcp) return;
    window.__stWebMcp = new AbortController();
    var signal = window.__stWebMcp.signal;
    tools.forEach(function (tool) {
      try {
        var result = c.registerTool(tool, { signal: signal });
        // The spec rejects the registration promise with the abort reason.
        if (result && typeof result.catch === "function") result.catch(function () {});
        if (result && typeof result.unregister === "function") signal.addEventListener("abort", function () { result.unregister(); }, { once: true });
      } catch (e) {
        // A browser that rejects one tool must not break the page.
      }
    });
  }
  register();
  if (!window.__stWebMcp) document.addEventListener("DOMContentLoaded", register, { once: true });
})();`;
