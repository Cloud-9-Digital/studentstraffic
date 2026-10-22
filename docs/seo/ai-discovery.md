# Search, answer-engine and AI-agent discovery

Updated: 2026-10-22

How studentstraffic.com is crawled, read and cited by search engines, LLM answer engines
(ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) and AI agents. Structured data has its
own contract in [`structured-data-contract.md`](./structured-data-contract.md).

## Crawler policy (`app/robots.ts`)

- Search engines, answer engines, assistant fetchers and training crawlers are all allowed on the
  public catalogue. Being quoted by assistants is a lead source, so the training crawlers
  (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, …) stay allowed.
- Every group repeats `PRIVATE_PATHS` (`/admin`, `/api/`, `/dashboard`, `/calls/`, `/login`,
  `/register`). A crawler obeys only the most specific group naming it (RFC 9309), so a named group
  with only `allow: "/"` would ignore the `*` disallows.
- `/search` and `/thank-you` stay crawlable so their `noindex` can be read.
- `/llms-full.txt` is disallowed for `*` only; the named AI agents may fetch it.

## llms.txt and llms-full.txt

- `/llms.txt` follows the llms.txt convention: H1, blockquote summary, then `- [Title](url): note`
  sections. It covers live catalogue counts, the machine-readable surfaces, URL patterns, catalogue
  hubs, destinations with university counts, popular guides, editorial standards and counselling
  contacts. URL templates are written with `{slug}` placeholders, not percent-encoded.
- `/llms-full.txt` lists every published country, course, university and programme. Each programme
  line links its page and uses the page's fee precedence (indicative range, USD, then official
  currency). Its `unstable_cache` key must be bumped whenever the selected row shape changes,
  because the data cache outlives deploys. It refreshes daily (`revalidate: 86400`) rather than on
  publish: the shared tags are refused by publishers, and a per-publish refresh of this full read
  would defeat the egress rules in `docs/university-pipeline-architecture.md`.

## Markdown views for agents

| URL | Served by | Content |
| --- | --- | --- |
| `/university/{slug}.md` | `app/md/university/[slug]/route.ts` | facts, recognition with verification links, programme table, admissions, student life, FAQs, sources, counselling |
| `/university/{slug}` with `Accept: text/markdown` | same | same |
| `/{programme-slug}.md` | `app/md/programme/[slug]/route.ts` | facts, fees, year-wise cost, eligibility, admissions, teaching phases, regulatory advisory, sources, counselling |

- Rewrites live in `next.config.ts` (`beforeFiles`). Section slugs (`-faq`, `-fees`, …) resolve to the
  whole record. Guides on the root route have no markdown view and return 404; content negotiation
  is therefore limited to `/university/{slug}`, where every valid slug has a view.
- Responses send `Link: <html-url>; rel="canonical"` so search engines index the HTML page, plus
  `Vary: Accept`. HTML pages advertise the view with
  `<link rel="alternate" type="text/markdown">` (`markdownPath` in `buildIndexableMetadata`).
- Rendering is in `lib/agent-markdown.ts` (tested in `tests/agent-markdown.test.ts`). It renders
  only published fields and omits empty ones; a placeholder medium is omitted, not shown.

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

`/llms-full.txt` splits its data cache into catalogue entities and programme tuples:
`unstable_cache` silently refuses entries over 2 MB, and the single entry had reached 3 MB, so every
request re-read the full catalogue from Neon.

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
```

On a university page, check for one page-level JSON-LD graph, one `<h1>`, every FAQ answer in the
HTML outside `<script>`, and the `rel="alternate" type="text/markdown"` link.
