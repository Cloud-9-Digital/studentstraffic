# University & Program Data Pipeline — Reference

> Historical `scripts/seed*` files were removed on 2026-07-11. Any older seed-script references in
> this historical reference are obsolete. Use [`docs/content-seeding-runbook.md`](./content-seeding-runbook.md)
> and the generic publisher/importer tools only. Never recreate a country-specific seeder.

> Public page composition and AI writing limits are defined in
> [`docs/university-page-architecture.md`](./university-page-architecture.md). This document
> covers data mechanics and publishing flow; it does not replace the page architecture contract.
>
> The canonical content research and seeding workflow is
> [`docs/content-seeding-runbook.md`](./content-seeding-runbook.md). Historical country-specific
> seed scripts are not templates and should not be used for new content.

Read this before touching university/program data (schema, seed scripts, or the
research-and-publish pipeline) instead of re-deriving it from source each time.
Keep it current — see "Keeping this doc current" at the bottom.

## Data model (`lib/db/schema.ts`)

- **`countries`** — one row per country (slug, name).
- **`courses`** — course catalog (e.g. `mbbs`, `bds`, `bsc-nursing`, `pharmacy`). Programs reference a course.
- **`universities`** — one row per published university. Key fields:
  `slug`, `name`, `city`, `type`, `establishedYear`, `officialWebsite`, `published`, `featured`,
  narrative fields (`campusLifestyle`, `cityProfile`, `practicalExposure`, `hostelOverview`,
  `dietarySupport`, `safetyOverview`, `studentSupport`), array fields (`whyChoose`,
  `thingsToConsider`, `bestFitFor`, `industryPartners`, `recognitionBadges`), `faq`,
  `researchSources` (citations), `lastVerifiedAt`.

  `media_attribution` also carries optional section media under `studentLife` with the keys
  `campusEnvironment`, `accommodation`, `dailyLiving` and `safetySupport`. Each record stores a
  Students Traffic Cloudinary URL plus original source, rights basis, checked date and alt text.
  This uses the existing JSONB field; no section-specific image columns are required. Student-living
  text is validated against the hard field limits in `docs/university-content-spec.md` before write.
- **`programOfferings`** — one row per program at a university, FK to `universities` + `courses`.
  Key fields: `slug`, `title`, `durationYears` (⚠️ **integer column** — see Known issues),
  `annualTuitionUsd`/`totalTuitionUsd`/`livingUsd` (normalized USD), `officialFeeCurrency` +
  `officialAnnualTuitionAmount`/`officialTotalTuitionAmount` (native-currency figures, bigint),
  `officialProgramUrl`, `medium` (language of instruction), `intakeMonths`, `professionalExamSupport`,
  `sourceUrls`, `published`.

  > **2026-07-09 column rename (drizzle `0054_rename_medical_columns`).** Four medically/India-flavored
  > columns were renamed to stream-neutral names so the schema can hold non-medical content honestly:
  > `universities.clinical_exposure → practical_exposure`,
  > `universities.teaching_hospitals → industry_partners`,
  > `universities.indian_food_support → dietary_support`,
  > `program_offerings.license_exam_support → professional_exam_support`. Pure renames, no data change.
  > The stream-aware university template (see `docs/non-medical-expansion-scope.md`) reads these under
  > medical labels ("Clinical exposure", "Teaching hospitals", "Licensing & exam support") for medical
  > streams and neutral labels ("Practical training", "Industry & placement partners") otherwise.
  > **DEPLOY:** apply `0054` in the same release that ships the renamed `schema.ts` + call sites — the
  > previously deployed code selects the old names, so migrating ahead of that code breaks live queries.
  > **ETL note:** the research-pipeline draft/facts JSON shapes (`UniversityResearchDraftContent`,
  > `UniversityResearchStructuredFacts` in `schema.ts`, and the zod schema in
  > `lib/research/university-guide-drafts.ts`) intentionally KEEP the old source key names
  > (`clinicalExposure`, `teachingHospitals`, `indianFoodSupport`, `licenseExamSupport`) so historical
  > `research-drafts/*.json` stay loadable; `publish-university-draft.ts` maps those source keys onto the
  > renamed destination columns.
- **`universityResearchQueue`** — candidate universities discovered or manually added. Each row has
  a generic `discoveryKey`; dedicated university pages remain the public source of truth. Status
  lifecycle: `new → researching → draft_ready → published | hold | rejected`. Has `priority`
  (high/medium/low).
- **`universityResearchDrafts`** — one draft per queue entry: `sourceBundle` (raw source URLs/content),
  `structuredFacts`, `draftContent` (shaped to match the `universities`/`programOfferings` schema),
  `qualityScore`, `reviewNotes`, `verifiedAt`.

## Content-migration publication layer

All net-new catalogue content now follows a migration-style workflow:

```text
research + source bundle (offline) → complete local payload → content-migrations/NNNN-scope/
→ npm run content:validate → reviewed commit → npm run content:migrate -- --apply
```

`manifest.json` identifies the bundle and its `payload.json`. The runner hashes both files, rejects
any change to an already-applied migration, applies pending migrations in sequence, and records the
ID/checksum in `content_migrations`. It performs live duplicate/ledger checks only during that final
publish command. See [`content-migrations/README.md`](../content-migrations/README.md) for the
directory contract.

`scripts/publish-catalog-payload.ts` is now an internal write engine, not a direct CLI. Do not let a
research agent invoke it or any old one-off writer directly. Use the migration runner so that local
research sessions do not wake the database.

## Generalizing discovery to non-medical fields

> **Current operational note (2026-07-13):** the automatic discovery queue remains medical-source
> based, but it is not a publishing gate. For non-medical universities, the shared publishing ledger
> plus a complete primary-source payload is the approved discovery path. Do not hold a validated
> non-medical university merely because it was not seeded from a medical directory.

**Current implementation note (2026-07-10):** official regulatory sources has been retired completely. The official regulatory sources directory
table, official regulatory sources-specific queue/draft columns, importers, matchers, and public rendering have been
removed. The live schema uses `discoveryKey`; existing official regulatory sources-backed queue rows are deleted by
`drizzle/0056_remove_official-directory.sql`. The older historical notes below describe the former design only.

Today the discovery queue is medical-only: `universityResearchQueue` rows are seeded from **official regulatory sources**
(World Directory of Medical Schools) — see `official-directoryDirectoryEntries` and
`scripts/seed-university-research-queue.ts`. official regulatory sources is a single authoritative global registry of medical
schools, which is why the whole discover→research→publish pipeline could bootstrap from one import. The
column `universityResearchQueue.official-directorySchoolId` and the `official-directory_school_id` on drafts are the only
medicine-specific hooks in the queue; everything downstream (research, draft, publish) is already
field-generic now that the columns are renamed (above) and the template is stream-aware.

When non-medical discovery is actually built (out of scope here — do NOT build or seed it now), a
"non-medical discovery source" would replace official regulatory sources as the seed for the queue. There is no single
global registry equivalent to official regulatory sources for business/engineering/law/etc., so expect **per-field,
per-country accreditor lists** instead of one import, e.g.:
- Engineering: national accreditation bodies / ministry-approved institution lists (e.g. a country's
  higher-education ministry register), or a recognized ranking/registry for that field.
- Business: AACSB / EQUIS / AMBA accredited-school directories, or national B-school registries.
- Law / others: the relevant national regulator or university-grants-commission register for the
  destination country.

Concretely, generalizing would mean: (1) a `discoverySource` discriminator on the queue (`"official-directory"`
today; `"accreditor:<body>"` / `"registry:<name>"` for others) so `official-directorySchoolId` isn't assumed;
(2) a per-source seed importer analogous to `seed-university-research-queue.ts` that writes queue rows
with a generic external id; (3) the same research/publish scripts unchanged. The **recognition** copy
must stay data-driven (read from `recognitionBadges`/`recognitionLinks`) with the honest generic
fallback — never hardcode field-specific regulatory claims (UGC/AICTE/BCI etc.), because those differ
by field and country and several (e.g. BCI for foreign law degrees) are materially different from the
medical NMC pathway. See `docs/non-medical-expansion-scope.md`.

## Two ways to add universities

### 1. Automated research-and-publish pipeline (preferred for net-new universities)

```
scripts/seed-university-research-queue.ts   → populate universityResearchQueue (from official regulatory sources import)
scripts/run-university-research.ts          → research a queued candidate, write a draft
                                               (also writes a human-readable .md alongside the .json
                                               in research-drafts/<country>/ for audit trail)
scripts/publish-university-draft.ts         → validate + insert draft into universities/programOfferings
scripts/seed-nonofficial-directory-draft.ts              → for universities not in official regulatory sources (surrogate id `disc-<country>-<slug>`)
```

Drafts live as JSON in `research-drafts/<country-slug>/<university-slug>.json` before publish.

Editorial safeguards already enforced by this pipeline (see [[project_university_content_sourcing]]
memory and `docs/project-standards.md`):
- Multi-source verification required — never trust one official site alone.
- Facts must be omitted, not fabricated, if unverifiable ("exhaustive-then-omit").
- Programmes must map to an actual course in the catalogue. Citizenship, residency, nationality,
  location and visa restrictions do not by themselves prevent publication for the global audience;
  they must be verified, stored and shown clearly. Hold only when the restriction or programme
  identity cannot be verified.
- Every hold/publish decision + sources gets logged in a run report under `docs/run-reports/`.

### 1b. Adding programs to an already-published university (no new university needed)

Use `scripts/add-program-offerings.mjs --file <programs.json>` — a generic, reusable inserter.
Takes a plain JSON array of program entries (see the script's header comment for the exact shape)
and upserts `program_offerings` rows for existing published universities. **Do not write a bespoke
one-off `.mjs`/`.ts` script per university for this** (the codebase used to do this — see
`scripts/enrich-geomedi-university.mjs` for the old pattern — it's one-off, non-reusable, and wastes
agent effort re-deriving the same INSERT/UPDATE logic every time). Research agents should only need
to produce the JSON; this script handles validation (course slug exists, >=2 sources, required
fields) and insertion.

### 1c. Catalogue-payload pipeline for new universities (`scripts/publish-catalog-payload.ts`)

A third, newer path (used for the 2026-07-12 "scalable programme publishing" pilot batch) publishes
a brand-new university and its programmes in one atomic transaction from a single hand-authored
JSON file (see `research/catalog-payloads/*.json` for examples; `western-university.json` is a
worked reference). Run as `tsx scripts/publish-catalog-payload.ts --file <payload.json>`.

**Important restriction, discovered 2026-07-12 while researching University of Malta:**
`courseSchema.stream` in this script is `z.enum(["engineering", "business"])` — it does not accept
`medicine`, `dental`, `nursing`, `pharmacy` or any other stream. Every course referenced by a
programme in the payload must also appear in that payload's own `courses` array (the script builds
its course-id map only from `payload.courses`, never from the live DB), and that array is validated
against the same enum. **Consequence: this script cannot publish a new university's first medicine,
dental, nursing or pharmacy programme, even against an already-`active=true` canonical course row
such as `mbbs`, `bds` or `bsc-nursing`.** This is broader than the `medical-pg`/`pharmacy`
`active=false` restriction described in `docs/university-expansion-plan.md` — it also blocks the
three `active=true` medical/dental/nursing slugs for any university that doesn't already exist in
the DB.

The workaround is the existing two-stage pattern: publish the university's engineering/business
programmes first via `publish-catalog-payload.ts` (which creates the university row), then run a
second pass via `scripts/add-program-offerings.mjs` (§1b above), which has no stream restriction and
only requires the target university to already be `published = true` and the target course to be
`active = true`. See `research/catalog-payloads/university-of-malta-stage2-medical-dental-nursing.json`
and `docs/research-scopes/university-of-malta.md` for a worked example of a held stage-2 batch.

Fix candidates for a future change (not applied here — out of scope for a single-university research
pass): widen `courseSchema.stream` to match `program-taxonomy.ts`'s full stream union, or have the
script look up already-active courses from the DB instead of requiring every referenced course to be
re-declared in the payload.

### 2. Manual batch seed scripts (used historically per-country, e.g. Russia/Georgia/Uzbekistan/Kyrgyzstan)

Pattern: `scripts/seed-<country>-batch<N>.mjs` — a plain array of university objects (same shape as
`draftContent`/`universities` columns above) with a nested `programs[]` array, inserted directly via
a SQL `Pool`. Use `scripts/seed-russian-universities-batch1.mjs` as the template. Prefer the pipeline
above for new work; these remain mainly as historical reference and for one-off manual corrections.

## Known issues / gotchas

- **A `research-drafts/<country>/<slug>.json` file existing does NOT mean it's in the DB.**
  `publish-university-draft.ts` reads only from the `universityResearchQueue` /
  `universityResearchDrafts` tables via `--queue-id`, never from the JSON file directly. Non-official regulatory sources
  drafts (and some official regulatory sources drafts that were held before ever being ingested) frequently have no queue
  row at all. **Always check for an existing queue row first**; if none exists, run
  `scripts/seed-nonofficial-directory-draft.ts --file <path>` to create the queue+draft pair from the JSON (prints
  the resulting `--queue-id`), then publish with that id. Skipping this step makes
  `publish-university-draft.ts` fail with "no matching draft found." (Discovered 2026-07-07: 5 of 6
  quick-fix drafts from the overnight run hit this exact wall.)
- Country/city narrative content must stay consistent with `docs/project-standards.md` (voice, no
  editorial/newsroom tone, commercial bridge woven in).

## Resolved issues

- ~~`program_offerings.duration_years` was `integer`, rejecting fractional-year programs~~ — fixed
  2026-07-07 via `drizzle/0051_program_offering_duration_years_numeric.sql` (now `numeric(4,1)`).
  Fractional durations (e.g. a 5.5-year MD) publish fine now.

## Where to look for current state (don't re-research, just read)

- `docs/run-reports/*.md` — per-run summaries of what was processed/published/held and why, with
  sources. Check the latest one before starting new research to avoid redoing held/failed work.
- `research-drafts/<country>/` — existing drafts, including held ones with fixable issues noted in
  their run report. Fixing a held draft is usually cheaper than researching a new university.
- `universityResearchQueue` status column — what's already queued vs. not yet discovered.

## Keeping this doc current

Update this file whenever you: change the schema for these tables, change the pipeline scripts'
flow or file locations, fix the `duration_years` type issue, or establish a new editorial rule that
changes what gets published vs. held. Treat stale info here as worse than no info — fix it in the
same change that makes it stale.

## Program offering integrity (2026-07-11)

Migration `0058_program_offering_integrity` historically reduced offerings to one row per
`(university_id, course_id)`. That rule was suitable for the original small medical catalogue but is
superseded by migration `0063` below. Programme slug is now the write identity; university/course is
a non-unique lookup relationship.

Migration `0059_remove_orphaned_unpublished_universities` also removed four unpublished staging
universities that were not attached to the research queue; published universities remain untouched.

`scripts/add-program-offerings.mjs` revalidates the catalog, university, and program-offering cache
tags after a successful direct database batch, so newly added programs become visible without waiting
for the long catalog cache profile to expire.

Validated catalogue publishers use slug-scoped revalidation. After the transaction commits, they
send only the programme slugs written by that batch to `/api/revalidate?scope=catalog`. The endpoint
expires `program:<slug>`, the exact `/<slug>` page and the root dynamic route shell. The shell expiry
is required because Cache Components can otherwise retain the build-time not-found fallback for a
new root slug. It must not invalidate catalogue-wide data tags. The first request regenerates the
affected page and Vercel caches the completed HTML; unrelated catalogue data caches remain hot, so
programme detail queries do not run on every visit.

When the same transaction creates or enriches a university, the publisher also expires the affected
`/university/<slug>` path, `university:<slug>` and `university-programs:<slug>` entries. The shared
`universities` snapshot is refreshed once so a newly created university can be discovered; this does
not make university pages query the database on every request.

Standalone publishers must import `scripts/lib/load-script-env.mjs` before modules that read
`lib/env.ts`. The bootstrap uses `@next/env` so `.env.local` overrides `.env`, while values explicitly
provided by the shell or CI remain authoritative. Do not replace it with body-level `dotenv.config()`:
ES module dependencies are evaluated before that body runs, which can make `lib/env.ts` capture stale
values and silently skip production revalidation.

Migration `0061_remove_duplicate_legacy_content_columns` removed the unused duplicate medical-only
database columns left behind by the stream-neutral schema migration. Research JSON/source keys may
still use the historical names because the publisher maps them into the neutral database columns.

## Canonical programme foundation (2026-07-12)

Migration `0063_programme_taxonomy_foundation` adds `level`, `discipline`, `aliases`, `active` and
`display_order` to `courses`. The executable approved taxonomy is
`lib/data/program-taxonomy.ts`; public offering titles continue to store the university's exact
official title.

The former unique `(university_id, course_id)` constraint was incorrect for a multi-programme
catalogue because one university may offer several distinct programmes mapped to the same canonical
category. It is now a non-unique lookup index. `program_offerings.slug` remains globally unique
because public programme routes resolve by slug without a university segment.

New publishing requires an explicit approved canonical slug and an active course row. Title-based
course inference has been removed. The legacy `medical-pg` and mixed `pharmacy` course rows are
inactive for new writes but remain readable for existing pages until their offerings are researched
and remapped. Run `npm run audit:programme-taxonomy` for the non-mutating review report.

Both programme import paths now use one database transaction per payload. A validation or database
failure rolls the complete batch back; cache and search refresh run only after the database commit.

## Cost-safe publication refresh (2026-07-14)

Catalogue publication must not rebuild or download the complete catalogue after each university.
`publish-university-draft.ts` and `publish-catalog-payload.ts` now upsert only the affected
university, its published programmes, and the directly related country/course documents into
Typesense. The admin search screen and `scripts/sync-typesense-search.ts` retain the full rebuild as
an explicit recovery/maintenance operation; it is not part of the per-university hot path.

`add-program-offerings.mjs` resolves all referenced university, course and existing programme slugs
with three batched lookups before writing the transaction, rather than repeating those reads for
every programme. Its post-commit refresh is slug-scoped: affected programme and university paths are
expired, while unrelated catalogue data remains cached. The importer also resolves the affected
country and city in that same batched university lookup. All three validated publishers send
`country-programs:<slug>`, `course-programs:<slug>` and `city-programs:<slug>` tags for only the
locations and canonical courses written by the transaction. The catalogue revalidation endpoint
continues to refresh the `/universities`, `/compare`, and `/budget` route shells and their narrow
finder/comparison summary caches so newly published options appear immediately.

Rich programme readers (`listFinderPrograms`, country/course previews and directories, university
programme lists, and city programme lists) must not depend on the broad `finder`, `universities`, or
`program-offerings` refresh tags. Four concurrent publishers can commit every few minutes; attaching
rich readers to those broad tags defeats the long-lived cache and repeatedly transfers complete
programme/university narrative records. Rich readers instead use the affected country, course,
university, or city tag above. Compact finder cards, aggregate counts, index options and sitemaps may
still use broad refresh tags because their projections are bounded or narrow. Blog index/related-post
metadata similarly excludes the full article `content`; only the slug-specific blog detail reader
downloads a body.

These are internal data-access changes only. Public URLs, comparison eligibility (at least two
published programmes per country/budget side), fee ranges, counts, university detail content and
lead flows must remain functionally equivalent. Any future publisher must follow the same
incremental-search and scoped-revalidation pattern.

The same rule applies to public catalogue pages. Country and course guides must calculate their
counts, fee ranges, fields and destination lists from projected summary queries, then fetch only the
small number of full programme rows actually rendered or emitted as structured data. University
related-content carousels use a bounded finder-card query rather than loading every programme in the
country. High-cardinality `/compare` and `/courses` directories render the first 24 unchanged cards
and progressively fetch cached 24-item batches, preventing multi-megabyte HTML responses without
removing any option from the user journey.

## Sitemap promotion policy (2026-07-14)

Sitemaps always promote every published university and programme base URL. Section URLs remain live
and navigable, but are included in sitemaps only when the database contains enough corresponding
source data to justify a separate search result. Sitemap filtering alone must not add `noindex`,
change a self-canonical URL, redirect a tab, or remove a route.

Programme section promotion uses these conservative signals:

- admissions: curated university admissions content, or a specific intake backed by at least two sources;
- eligibility: curated admissions content or explicit audience restrictions/eligibility;
- recognition: at least one recognition badge and one official verification link;
- fees: published annual tuition, a verification date, and either a year-wise breakdown, substantial
  fee notes, or an official-currency annual/total amount.

University section promotion uses these signals:

- programs: at least one published programme;
- student life: substantial combined campus, city and student-support narrative;
- hostel: substantial combined accommodation, dietary and safety narrative;
- FAQ: at least four maintained questions.

The executable policy is `lib/sitemap-indexability.ts`; the sitemap queries project only boolean
quality signals rather than downloading full university/programme records. Publishing or enrichment
can therefore promote a section naturally after the normal `sitemap` cache tag is revalidated.

## Cross-agent publishing coordination

`research/university-publishing-ledger.csv` is the shared coordination ledger for university work.
Every research or publishing agent must claim its university there before research and update the
same row through `researching`, `validated`, `published`, `held` or `abandoned`. Before the database
transaction, re-read the ledger and query the live university slug/name to catch concurrent work.
The ledger prevents accidental duplication operationally; the database slug constraints remain the
final integrity boundary.

The existing-university programme importer also persists structured `audienceEligibility` and
`professionalExamSupport` values when supplied. Programme-only batches must therefore carry precise
visa, nationality, residency or prior-qualification restrictions instead of treating every
international applicant as eligible.

## University media delivery (2026-07-12)

`universities.logo_url` and `universities.cover_image_url` accept Students Traffic Cloudinary URLs
only. The validated catalogue publisher rejects non-Cloudinary public media. Original source and
rights information belong in `universities.media_attribution`; they must not be used as public image
delivery URLs. Upload media before publication and verify the Cloudinary response. Never use an
external hotlink or substitute a pixelated favicon for a proper university logo.
