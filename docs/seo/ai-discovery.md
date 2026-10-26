# Search, answer-engine and AI-agent discovery

Updated: 2026-10-26

How studentstraffic.com is crawled, read and cited by search engines, LLM answer engines
(ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) and AI agents. Structured data has its
own contract in [`structured-data-contract.md`](./structured-data-contract.md).

## Crawler policy (`app/robots.txt/route.ts`, built in `lib/robots-txt.ts`)

- Search engines, answer engines, assistant fetchers and training crawlers are all allowed on the
  public catalogue. Being quoted by assistants is a lead source, so the training crawlers
  (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, …) stay allowed.
- Every group repeats `PRIVATE_PATHS` (`/admin`, `/api/`, `/dashboard`, `/calls/`, `/login`,
  `/register`). A crawler obeys only the most specific group naming it (RFC 9309), so a named group
  with only `allow: "/"` would ignore the `*` disallows.
- `/search` and `/thank-you` stay crawlable so their `noindex` can be read.
- `/llms-full.txt` is disallowed for `*` only; the named AI agents may fetch it.
- Every group carries `Content-Signal: search=yes, ai-input=yes, ai-train=yes`
  ([Content Signals](https://contentsignals.org/)), placed right after the group's `User-Agent`
  lines. It states how content may be used once fetched: search indexing, AI answers (RAG,
  grounding) and training are all granted, matching the allow policy above.
- robots.txt is a route handler, not `app/robots.ts`: `MetadataRoute.Robots` has no field for
  Content-Signal. Apart from those lines the output is byte-identical to the old metadata route;
  `tests/robots-txt.test.ts` pins the full text.

## llms.txt and llms-full.txt

- `/llms.txt` follows the llms.txt convention: H1, blockquote summary, then `- [Title](url): note`
  sections. It covers live catalogue counts, the machine-readable surfaces, URL patterns, catalogue
  hubs, destinations with university counts, popular guides, editorial standards and counselling
  contacts. URL templates are written with `{slug}` placeholders, not percent-encoded.
- `/llms-full.txt` (rendered by `lib/llms-full-txt.ts`, tested in `tests/llms-full-txt.test.ts`)
  keeps the header, evergreen pages, countries, courses and blog posts, and lists **one line per
  published university**: name, city and country, type, main recognition or affiliation (first
  recognition badge), published programme count, page URL and markdown URL. It deliberately has no
  per-programme fees or programme lists, so it is not a bulk export of the dataset; the per-page
  markdown views (`/university/{slug}.md`, `/{programme}.md`) stay available, so an agent can still
  read any single page in full. It ends with the counselling contacts. Its `unstable_cache` keys
  (`llms-full-catalog-entities-v2`, `llms-full-programme-counts-v1`) must be bumped whenever the
  selected row shape changes, because the data cache outlives deploys. It refreshes daily
  (`revalidate: 86400`) rather than on publish.

## Markdown views for agents (Markdown for Agents)

| URL (`.md` suffix, or the HTML URL with `Accept: text/markdown`) | Served by | Content |
| --- | --- | --- |
| `/` → `/index.md` | `app/md/home/route.ts` | the `/llms.txt` site guide (`lib/llms-txt.ts`) |
| `/university/{slug}` | `app/md/university/[slug]/route.ts` | facts, recognition with verification links, programme table, admissions, student life, FAQs, sources, counselling |
| `/countries/{slug}` | `app/md/country/[slug]/route.ts` | overview, regulatory advisory, university table with courses and markdown links, counselling |
| `/{slug}` (programme, landing page or study-abroad guide) | `app/md/programme/[slug]/route.ts` | programme: facts, fees, year-wise cost, eligibility, admissions, teaching phases, advisory, sources. Landing page: highlights, eligibility, steps, FAQs. Guide: takeaways, sections, tables, FAQs |

- Routing lives in `lib/agent-discovery.ts` (`getMarkdownRewrites`, used by `next.config.ts`;
  tested in `tests/agent-discovery.test.ts`). A request is negotiated when its Accept header contains
  `text/markdown`; browsers never send it, so they get HTML. `q=0` for markdown is not honoured
  (rewrite `has` matching is a regex).
- `/`, `/university/*` and `/countries/*` negotiate in `beforeFiles`. The root `/{slug}` negotiates in
  `afterFiles`, after static routes such as `/about` or `/contact` have matched, so those stay HTML.
  The root handler resolves slugs in the same order as `app/[slug]/page.tsx` (landing page, guide,
  programme); an unknown slug returns a markdown 404.
- HTML only (no markdown view): blog, comparisons, budget guides, courses, finder, `/countries`
  index, India MBBS college pages, static pages and other nested routes.
- Responses send `Content-Type: text/markdown; charset=utf-8`, `Vary: Accept`, an
  `x-markdown-tokens` estimate (characters / 4) and `Link: <html-url>; rel="canonical"` so search
  engines index the HTML page. Markdown is served from a distinct internal path (`/md/...`), so the
  CDN never mixes it with the cached HTML. University and programme pages advertise the view with
  `<link rel="alternate" type="text/markdown">` (`markdownPath` in `buildIndexableMetadata`).
- Rendering is in `lib/agent-markdown.ts` (tested in `tests/agent-markdown.test.ts`). It renders
  only published fields and omits empty ones; a placeholder medium is omitted, not shown.

## Agent discovery

- **Home page Link header** (RFC 8288, `getHomeLinkHeaderRule` in `lib/agent-discovery.ts`, applied in
  `next.config.ts` `headers()`): `</llms.txt>; rel="describedby"`,
  `</.well-known/agent-skills/index.json>; rel="describedby"` and
  `</index.md>; rel="alternate"; type="text/markdown"`. Sent on the www HTML response only. The apex
  `studentstraffic.com` is a Vercel domain 307 to www that never reaches the app, so checkers must
  follow the redirect to see the header.
- **Agent Skills index** (Agent Skills Discovery RFC v0.2.0): `/.well-known/agent-skills/index.json`
  lists `studentstraffic-catalog`, served at `/.well-known/agent-skills/studentstraffic-catalog/SKILL.md`.
  Both routes read `lib/agent-skills.ts`, so the `sha256:` digest is computed from the bytes served;
  `tests/agent-skills.test.ts` recomputes it. Edit the skill when URL patterns, markdown views or fee
  labels (`lib/utils.ts`) change.
- **WebMCP** (`WEBMCP_BOOTSTRAP_SCRIPT` in `lib/webmcp.ts`, an inline `<head>` script in the root
  layout, tested in `tests/webmcp.test.ts`): while the page loads, not after hydration, so agents
  and checkers see the tools on page load. If `document.modelContext` (spec) or
  `navigator.modelContext` (Chrome preview) exists, it registers three read-only tools once per page
  (retrying at DOMContentLoaded if the context appears late): `search_catalog` (`/api/suggestions`,
  the search-box endpoint), `get_university_details` (markdown view) and `open_page` (university,
  country or root-level pages on this origin only). `window.__stWebMcp` holds the AbortController
  that unregisters them. No tool submits a form or sends personal data.
- **Home page Link header** also carries `</.well-known/api-catalog>; rel="api-catalog"` while the
  MCP server is enabled (`getHomeLinkHeader` drops it when `MCP_SERVER_ENABLED=false`).

## Public MCP server (read-only, rate-limited)

There is deliberately **no public REST/JSON data API and no OpenAPI spec**: the owner's rule is that
nothing is public without limits and controls, and a REST mirror would be a bulk-export surface.
`/api/` stays disallowed in robots.txt. The only machine surface beyond the pages is the MCP server.

| Piece | Path | Notes |
| --- | --- | --- |
| MCP server | `/mcp` (`app/mcp/route.ts`) | `mcp-handler` 2.3.0 + `@modelcontextprotocol/server` 2.3.1; Streamable HTTP, stateless (2026-07-28 era natively, 2025-era clients through the SDK's stateless fallback), no auth, `maxSubscriptions: 0`, body ≤ 64 KB. |
| Health | `/mcp/health` | `{status:"ok"}` (503 `disabled` when switched off); no data, no database. |
| Server card | `/.well-known/mcp/server-card.json` and `/mcp/server-card` | `buildServerCard()`: SEP-2127 fields (`$schema`, `name: com.studentstraffic/catalog`, `version`, `remotes`) plus `serverInfo`, `transport`, `capabilities` and `tools` for checkers. |
| API catalog (RFC 9727) | `/.well-known/api-catalog` | `application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"`, HEAD sends `Link: <…>; rel="api-catalog"`. One entry: anchor `/mcp`, `service-desc` server card, `service-doc` `/ai-access`, `status` `/mcp/health`. |
| Terms and setup | `/ai-access` | Free, read-only, rate-limited; attribution link required; no bulk scraping or redistribution; access may be revoked; usage is logged. In the sitemap and footer. |

Code: tools in `lib/public-catalog-api.ts` (pure, tested with fake readers in
`tests/public-catalog-api.test.ts`), MCP registration and usage logging in
`lib/public-catalog-mcp.ts`, server binding, rate limits and log context in
`lib/public-catalog-server.ts`, discovery documents in `lib/public-catalog-discovery.ts` and
`lib/public-catalog-routes.ts`. Reads go through the cached catalogue readers
(`getUniversityBySlug`, `getProgramsForUniversity`, `getProgramBySlug`, `getCountryBySlug`,
`getFinderOptions`, `listFinderPrograms`) and the search-box ranking (`searchCatalogSuggestions` in
`lib/search/suggestions.ts`, shared with `/api/suggestions`), so they hit the pages' cache entries.

- **Tools** (all `readOnlyHint: true`, per-question lookups only): `search_catalog` (max 5 matches),
  `get_university` (one markdown profile, capped at 60k characters), `get_programme` (one
  programme), `list_programmes` (first 25, then "open the page for the full list"),
  `find_programmes` (course **and** country required, both checked against `getFinderOptions()`;
  optional city / USD ceiling; max 10). Inputs are slugs (`^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤200) or a
  2–100 character query with at least two letters/digits; wildcards (`*`, `%`, `?`) and empty
  queries are rejected. No tool can enumerate the catalogue.
- **Output rules**: only published records, copied onto explicit shapes (no ids, research notes,
  leads or users); fees always from `getProgramFeeLines` with their label (audience, seat quota or
  "Approx. fees"); every result has the canonical page URL, the `/contact` counselling link and an
  attribution line pointing to `/ai-access`.
- **Rate limits**: per IP, 30 a minute and 500 a day (fixed windows, `MCP_RATE_LIMITS`), through
  `rateLimit()` in `lib/rate-limit.ts` keyed `mcp:{minute|day}:{ipHash}`. Storage is Upstash Redis
  when `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` are set; otherwise a per-instance
  in-memory counter that is **not durable** (resets per instance/cold start). The Upstash limiter
  fails open on Redis errors. Over the limit: HTTP 429, `Retry-After`, JSON-RPC error `-32029`.
- **Kill switch**: `MCP_SERVER_ENABLED` (default on when unset; `false`/`0`/`off`/`no` turns it off).
  Off: `/mcp` answers 503 with a JSON-RPC error, `/mcp/health` 503, server card and API catalog 404,
  and the home Link header and SKILL.md stop advertising the server. The discovery routes are
  prerendered, so on Vercel set the variable and redeploy.
- **Usage logging**: one JSON `console.log` line per tool call (`source: "mcp"`,
  `event: "mcp_tool_call"`, tool, ok/status, `latencyMs`, `resultChars`, `resultItems`, `argChars`,
  salted `ipHash`, user agent ≤200 chars) and one per rate-limited request (`mcp_rate_limited`).
  Arguments are never logged. The IP hash salt is `MCP_LOG_SALT`, falling back to `AUTH_SECRET`/`NEXTAUTH_SECRET`.
  No database table: the schema has no analytics/events table to reuse.
- Bump `PUBLIC_CATALOG_VERSION` when a tool or result shape changes; the server card and
  `serverInfo` both read it.
- Not published: `/.well-known/ai-catalog.json` (the SEP-2127 domain catalog); DNS-AID is managed
  in Cloudflare.

## Server HTML must carry the facts

Answer engines and most AI crawlers do not run JavaScript. Catalogue pages stream their content
(Cache Components resume), so it arrives in `<div hidden id="S:n">` blocks that a client script
swaps into place. The text is in the HTML, but some extractors drop `hidden` nodes, which is why the
markdown views exist. Rules that keep the HTML complete:

- `components/app/app-chrome.tsx`: the Suspense fallback must not render `children`. It did until
  2026-10-22, so every dynamic-param page streamed its body and JSON-LD twice (about 2.5 MB of
  HTML for a large university page).
- FAQ lists use `FaqDisclosureList` (native `<details>`). Radix Accordion renders closed answers
  only after they open, so they were absent from the HTML while `FAQPage` claimed them. Tabbed FAQs
  render every tab and hide inactive ones with `hidden`.

## Missing slugs (soft 404s)

Catalogue routes cannot return HTTP 404 for an unknown slug: the static shell is sent before the
page resolves, so the status is already 200 (see `node_modules/next/dist/docs/01-app/02-guides/streaming.md`,
"The HTTP contract"). In production `notFound()` made it worse: it surfaced only in the RSC payload,
so the server HTML had no not-found UI and no `noindex`, and the root layout's `index, follow` and
homepage canonical applied. Catalogue pages therefore:

- return `<MissingPage />` (`components/shared/missing-page.tsx`) instead of calling `notFound()`.
  It renders the not-found UI and `<meta name="robots" content="noindex, nofollow">` in the server
  HTML;
- return `buildNotFoundMetadata()` from `generateMetadata`, which sets noindex and clears the
  inherited homepage canonical.

A true 404 status would need a slug-existence check in `proxy.ts` on every page request. That is
deliberately not done: the proxy matcher excludes page routes so CDN hits never invoke a function,
and a stale slug list would 404 newly published pages.

## Page weight

Every page used to carry about 200 header links to `/universities?course=…` (noindexed finder
filters) because the desktop programme menu rendered its panels up front. `ProgrammeMenuPanel` now
mounts its links on first open, like the countries menu. `/budget` renders one card per course
with a link per budget ceiling instead of a card per guide (about 470).

`/llms-full.txt` splits its data cache into catalogue entities and per-university programme counts:
`unstable_cache` silently refuses entries over 2 MB, and the old single entry (with every programme
and fee) had reached 3 MB, so every request re-read the full catalogue from Neon.

## App links (search results open in the mobile app)

Links to university and country pages from Google, AI answers or chat open the installed app;
everything else stays on the web, because the app has no programme, guide or blog screen.

| Piece | Where |
| --- | --- |
| iOS Universal Links file | `/.well-known/apple-app-site-association` (`app/.well-known/…/route.ts`, data in `lib/app-links.ts`) |
| Android App Links file | `/.well-known/assetlinks.json` (same) |
| Claimed paths | `/university/*` (not `*.md`), `/countries`, `/countries/*` on `www.studentstraffic.com` |
| App entitlement and intent filter | `mobile/app.json`: `ios.associatedDomains`, `android.intentFilters` with `autoVerify` |
| Web path to app route | `mobile/app/+native-intent.tsx` → `mobile/src/navigation/webLinkPath.ts` (`/countries/x` → `/country/x`, section suffixes such as `-faq` dropped) |

- Team ID `9562R6BVH7` and package `com.studentstraffic.app`. The Android file lists the EAS keystore
  SHA-256, which covers EAS-signed builds (internal and preview APKs).
- **To do at the first Play release** (the app was unpublished on 2026-10-22, so no Play key exists
  yet): Play App Signing creates Google's signing key on the first bundle upload. Copy its SHA-256
  from Play Console → App integrity → App signing key certificate into the `ANDROID_APP_LINK_SHA256`
  env var (comma-separated) or `lib/app-links.ts`; until then Play installs open these links in the
  browser.
- The config is native: it takes effect in the next EAS build, not through an OTA update.
- Only `www` is associated. The apex domain redirects, and Apple does not follow redirects for the
  association file.

## Verification

```bash
curl -s localhost:3000/robots.txt
curl -s localhost:3000/llms.txt | head -40
curl -sI localhost:3000/university/jamia-millia-islamia.md
curl -s -H 'Accept: text/markdown' localhost:3000/university/jamia-millia-islamia | head
curl -sI -H 'Accept: text/markdown' localhost:3000/countries/georgia
curl -sI localhost:3000/ | grep -i '^link'
curl -s localhost:3000/.well-known/agent-skills/index.json
curl -sI localhost:3000/.well-known/api-catalog
curl -s localhost:3000/.well-known/mcp/server-card.json
curl -s localhost:3000/mcp -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

On a university page, check for one page-level JSON-LD graph, one `<h1>`, every FAQ answer in the
HTML outside `<script>`, and the `rel="alternate" type="text/markdown"` link.
