# Bespoke Landing-Page → DB-Driven Guide Migration Checklist

Standing checklist for porting the remaining hand-coded SEO landing folders under `app/` into the
scalable, DB-driven `study_abroad_guides` pattern. Read alongside
`docs/university-pipeline-architecture.md` (data model) and `docs/project-standards.md` (voice).

## Why migrate

Each bespoke folder is a 100–981-line one-off (often `"use client"`) with content and figures
hardcoded in JSX. That does not scale as the site expands past MBBS-in-Russia/Vietnam to all
courses/countries. The scalable pattern already exists and is proven:

- **Guide content** is authored as data in `lib/data/study-abroad-guides.ts` (a
  `Record<slug, { metadata, page }>` typed against `StudyAbroadGuidePageProps`).
- **`scripts/migrate-study-abroad-guides-to-db.ts`** upserts each entry into the `study_abroad_guides`
  table (idempotent — skips slugs already present). `scripts/verify-guide-migration-diff.ts` checks
  every TS entry matches its DB row.
- **`app/[slug]/page.tsx`** resolves a published guide via `getStudyAbroadGuideBySlug`, renders
  `<StudyAbroadGuidePage>` + `<RelatedContentSection>`, and generates metadata from `guide.metadata`
  and structured data (WebPage + Breadcrumb + FAQ) inside the component.

`StudyAbroadGuidePage` supports these section shapes (see the component's exported types):
`paragraphs`, `bullets`, `cards`, and **`table`** (`{ headers, rows, note }`) — added 2026-07-09 to
carry fee/decision-matrix comparisons that bespoke pages rendered as hand-built `<table>` JSX.

## Two delivery variants (both proven 2026-07-09)

1. **Pure DB takeover (default, for editorial pages):** add the guide to
   `lib/data/study-abroad-guides.ts`, run the migrate script, then **delete the physical
   `app/<slug>/` folder**. `app/[slug]` serves it from the DB. Used for
   `is-mbbs-in-russia-worth-it` and `how-to-apply-for-mbbs-in-russia`.
2. **Thin server wrapper (for pages that surface live catalogue data):** keep a minimal
   `app/<slug>/page.tsx` (server component) that reads the narrative from
   `lib/data/study-abroad-guides.ts`, queries the DB (e.g. `getProgramsForCountry`) at request time,
   builds a `table` section from live figures, and renders `<StudyAbroadGuidePage>`. Keep the
   folder's `layout.tsx` for metadata. Used for `mbbs-in-russia-fees` (its per-university fee table is
   built from live `program_offerings`, not a hand-maintained array).
   **Important:** a wrapper page must NOT be naively "finished" by deleting the folder — doing so drops
   the live table and serves the narrative-only DB copy. Wrappers are the intended final state for
   data-backed pages.

## Exact steps to port one page

1. Read the bespoke `app/<slug>/page.tsx` (+ `layout.tsx` if present). Note its `metadata`
   (title/description/keywords/path), its structured-data `name`/`description`, and its FAQ Q&As.
2. Add an entry to `lib/data/study-abroad-guides.ts` keyed by the exact slug:
   - `metadata`: copy the `layout.tsx` `buildIndexableMetadata(...)` input **verbatim** (this preserves
     the indexed title/description/keywords exactly).
   - `page`: map the bespoke content into `StudyAbroadGuidePageProps` —
     hero → `title`/`kicker`/`summary`; the "quick answer"/"key takeaways" list → `keyTakeaways`;
     each content block → a `section` (`paragraphs`/`bullets`/`cards`/`table`); the FAQ list →
     `faqItems` **verbatim** (this preserves FAQ structured data); the bottom CTA →
     `leadTitle`/`leadDescription`/`primaryHref`/`primaryLabel`/`secondaryLabel`/`notes`. Set
     `countrySlug`/`courseSlug` for CTA attribution + related content.
   - Do **not** invent figures. If the bespoke page had a data table, prefer building it from the DB in
     a wrapper (variant 2) over copying the hand-typed array.
3. `npm run typecheck`.
4. Run `npx tsx scripts/migrate-study-abroad-guides-to-db.ts` (idempotent) and confirm the new slug is
   inserted. Run `npx tsx scripts/verify-guide-migration-diff.ts` to confirm it matches.
5. Delivery: **variant 1** → delete `app/<slug>/`. **variant 2** → replace `page.tsx` with the wrapper,
   keep `layout.tsx`.
6. `npm run build` to confirm no route collision / no broken structured data.
7. Preserve the sitemap: `app/sitemap.ts` lists these URLs manually — leave those entries untouched
   (the URL is unchanged; only the renderer changed). Do not remove a slug's sitemap entry.

## Done (2026-07-09, reference implementations)

| Slug | Variant | Notes |
|---|---|---|
| `is-mbbs-in-russia-worth-it` | 1 – DB takeover | ~476L bespoke → guide (cost-benefit + decision-matrix `table` sections, worth-it/not-worth-it `cards`). Folder deleted. |
| `how-to-apply-for-mbbs-in-russia` | 1 – DB takeover | ~751L bespoke → guide (timeline/visa/mistakes `cards`, documents `table`). Folder deleted. |
| `mbbs-in-russia-fees` | 2 – wrapper | ~981L bespoke (hardcoded ₹ fee array) → guide narrative + **live** university-wise fee `table` from `program_offerings`. `layout.tsx` kept for metadata. |

## Remaining bespoke pages — priority queue

**Already on a shared component (low priority — not raw bespoke JSX):**
- `mbbs-in-russia-admission`, `mbbs-in-vietnam-admission`, `mbbs-in-georgia-admission` — use
  `CountryMbbsLandingPage` (config-driven via `lib/data/mbbs-country-lp`). Leave as-is unless
  consolidating LP configs into guides.
- `mbbs-in-vietnam-fees` — uses `CountryFeesPage`. Could become a variant-2 wrapper like
  `mbbs-in-russia-fees` if a unified fees-guide look is wanted.

**High-value bespoke `"use client"` decision/explainer pages (best variant-1 candidates — map cleanly
onto the worth-it/how-to-apply guide shape):**
- `is-neet-required-for-mbbs-in-russia` (491L)
- `is-neet-required-for-mbbs-in-vietnam` (491L)
- `is-mbbs-in-vietnam-valid-in-india` (528L)
- `is-mbbs-in-vietnam-good-for-indian-students` (538L)
- `disadvantages-of-studying-mbbs-in-russia` (522L)
- `disadvantages-of-studying-mbbs-in-vietnam` (436L)
- `salary-after-mbbs-in-russia` (616L)
- `education-loan-for-mbbs-in-russia` (753L)

**Bespoke server pages with metadata (mixed — some list live universities, prefer variant 2):**
- `best-mbbs-colleges-in-russia-for-indian-students` (100L) — lists universities → variant 2.
- `best-mbbs-universities-in-vietnam-for-indian-students` (102L) — lists universities → variant 2.
- `medical-colleges-in-vietnam` (103L) — lists universities → variant 2.
- `free-mbbs-in-abroad-for-indian-students` (489L) — editorial → variant 1.
- `work-abroad-for-indian-students` (780L) — editorial → variant 1.
- `scholarships-for-indian-students-to-study-abroad` (846L) — editorial; note `StudyAbroadGuidePage`
  has a `guideVariant: "scholarship"` cross-link block designed for this → variant 1.
- `mbbs-in-russia-vs-vietnam-for-indian-students` (182L) — comparison page; check whether the existing
  `lib/discovery-pages` comparison-page system is the better target before porting to a guide.

## Non-medical readiness

The guide model is already stream-generic: `study_abroad_guides.stream` is a `CourseStream` column and
`app/[slug]` branches nowhere on medicine. When non-medical course/country guides are authored later,
they use this exact pattern — no template work needed. Do not author non-medical guides until the
data-population phase (see `docs/non-medical-expansion-scope.md`).
