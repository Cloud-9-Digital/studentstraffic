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
  `officialProgramUrl`, `medium` (short display label: language names only joined with " / ",
  e.g. `English` or `English / Russian`; payload zod enforces max 40 chars, rejects `. ; : ( )`
  or newlines, and rejects placeholder values `Not confirmed`, `TBC`, `To be confirmed`, `Unknown`
  and `N/A` case-insensitively — omit the programme until the language is verified), `mediumNote` (optional, nullable `medium_note`, drizzle `0073`: 10-300 chars of
  source-backed delivery nuance such as phase transitions or local-language clinical requirements;
  selected only by university/programme detail queries, never search documents, cards or facets),
  `instructionLanguages`
  (controlled language-facet codes, at least one required), `intakeMonths` (source display values), `intakeCodes`
  (controlled calendar-facet codes), `professionalExamSupport`, `sourceUrls`, `published`.

  **2026-07-20 facet normalization (drizzle `0068`).** `/universities` must filter only on
  `instruction_languages` and `intake_codes`, never on free-text `medium` or `intake_months`.
  `lib/catalogue-facets.ts` is the single allowed vocabulary and label/order source. The descriptive
  fields remain because programme pages must retain the verified delivery nuance and exact admissions
  timing. Legacy rows are backfilled only for exact unambiguous values; ambiguous rows remain absent
  from those facets until a source-backed content migration corrects them.

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

Mixed Codex/Claude runs reserve sequence numbers with `npm run content:reserve`; the reservation is
protected by a filesystem lock. University ownership is changed only through the `queue:*` commands,
which lock and atomically replace the shared CSV. Research agents never publish and never update a
row to `published` themselves.

Migration recording is crash-recoverable. Catalogue writes and the `db_applied` migration record
commit in one database transaction. Scoped search/cache refresh runs after commit and advances the
record to `applied`. A later invocation resumes refresh for any `db_applied` entry before applying
new work, so a process interruption cannot leave an unrecorded publication or force a payload replay.

Offline validation also enforces the publisher's course focus-keyword rule for `metaTitle` and
`metaDescription`, so an SEO metadata failure is caught before the runner opens a database
connection.

`scripts/publish-catalog-payload.ts` is now an internal write engine, not a direct CLI. Do not let a
research agent invoke it or any old one-off writer directly. Use the migration runner so that local
research sessions do not wake the database.

### Framework payload contract (2026-07-20)

The migration payload is now the enforcement point for the catalogue content framework:

- every programme supplies a `fee` object with explicit `confirmed`, `indicative` or `on_request`
  status rather than a zero-value fee sentinel;
- every material claim is carried in a private root `evidence` record with entity target, public
  field, claim text, source grade, checked date and review-by date;
- `npm run content:validate` rejects Grade C evidence, prohibited filler, missing
  eligibility/admissions/intake evidence and fee/evidence mismatches before opening a database
  connection;
- expired review-by dates (2026-09-15 change) are warnings offline and for applied bundles. At
  database-connected check/apply time they are errors only for pending bundles, except a pending
  bundle fully superseded by a later pending bundle. Logic: `classifyReviewByExpiry` in
  `scripts/lib/content-migrations.ts`;
- supersede rule (2026-09-15): a later bundle may republish a university from an earlier bundle.
  The university's single ledger row points `migration_id`/`payload_file` at the newest local bundle
  containing its slug (`readLatestMigrationIdByUniversitySlug`). Earlier bundles for that slug pass
  `assertMigrationLedgerEligibility` as historical. A row left on the earlier bundle is an explicit
  error. The superseding bundle publishes through the normal upsert path, with entity-scoped cache
  tags only. Full rule: `content-migrations/README.md`;
- database migration `0069_catalog_content_framework.sql` adds fee-state fields and the private
  `catalog_content_evidence` table. Run `npm run db:migrate` before applying a framework payload.

Evidence is never mapped into public page props, search documents or source links. Existing legacy
catalogue records retain their prior fields until they are explicitly refreshed; their fee state must
be classified during that refresh rather than inferred by an agent at display time.

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

## Retired direct-publishing paths (historical reference only)

The sections below explain legacy artifacts that still exist in the repository. Do not run these
commands to publish content. Convert reusable verified facts into a numbered content migration,
validate offline and use the controlled migration runner.

### 1. Historical database-backed research queue

```text
DO NOT RUN FROM A RESEARCH AGENT
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

### 1b. Historical existing-university programme importer

`scripts/add-program-offerings.mjs --file <programs.json>` was a generic, reusable inserter.
Takes a plain JSON array of program entries (see the script's header comment for the exact shape)
and upserts `program_offerings` rows for existing published universities. **Do not write a bespoke
one-off `.mjs`/`.ts` script per university for this** (the codebase used to do this — see
`scripts/enrich-geomedi-university.mjs` for the old pattern — it's one-off, non-reusable, and wastes
agent effort re-deriving the same INSERT/UPDATE logic every time). Research agents must not invoke
it. Package programme additions through `content:reserve`, associate the validated ledger rows with
that migration and let `content:migrate -- --apply` perform the write.

**Teaching-language guard on the legacy writers (2026-09-15).** `add-program-offerings.mjs` and
`publish-university-draft.ts` both print a deprecation warning recommending `content:reserve` /
`content:migrate`, and both validate every offering before any database write — one failing
offering rejects the whole run. The rules come from `scripts/lib/programme-medium.ts`, the same
module the content-migration payload schema uses:
- `medium` is required and must pass `programmeMediumSchema` (2-40 chars, no `. ; : ( )` or newlines,
  no placeholders such as `Not confirmed` / `TBC` / `Unknown` / `N/A`). There is no `"English"`
  fallback any more.
- `instructionLanguages` is required, non-empty, and every code must be in
  `teachingLanguageCodes` (`lib/catalogue-facets.ts`).
- `mediumNote` is optional (10-300 chars when present).
- Content-migration bundles use the same strict rule, except the 18 frozen, already-applied bundles in
  `LEGACY_FREE_TEXT_MEDIUM_MIGRATION_IDS` (`scripts/lib/content-migrations.ts`), which parse with the old
  free-text `medium` (`z.string().min(2)`, stored verbatim) because they are checksum-locked; every new
  bundle must use a language label in `medium` plus `mediumNote` for detail.

Both writers persist `instruction_languages`; `medium_note` is written only when supplied (an
UPDATE keeps an existing note otherwise). Run the importer with `npx tsx
scripts/add-program-offerings.mjs --file <programs.json>`: the shared guard is TypeScript with the
`@/` alias, so plain `node` fails at import time before connecting. Before this guard, the importer
created 73 live rows with empty `instruction_languages` and placeholder `medium` values; those rows
still need a corrective content migration.

### 1c. Retired direct catalogue-payload CLI

A former path (used for the 2026-07-12 "scalable programme publishing" pilot batch) published
a brand-new university and its programmes in one atomic transaction from a single hand-authored
JSON file. The direct CLI is disabled. The module is now an internal write engine called only by
the numbered content-migration runner.

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

That historical workaround is retired. Current payloads use the full executable taxonomy and are
published only as numbered content migrations. Old stage-two JSON is a research lead, not executable
publication input.

Fix candidates for a future change (not applied here — out of scope for a single-university research
pass): widen `courseSchema.stream` to match `program-taxonomy.ts`'s full stream union, or have the
script look up already-active courses from the DB instead of requiring every referenced course to be
re-declared in the payload.

### 2. Retired manual batch seed scripts

Historical `scripts/seed-<country>-batch<N>.mjs` files inserted arrays directly with a SQL pool.
They are not templates and must never be recreated. Corrections also use a new numbered migration.

## Rendering and cache-invalidation model (2026-09-13)

The four catalogue detail routes (`app/university/[slug]`, `app/countries/[slug]`,
`app/courses/[slug]` and the root `app/[slug]` programme/guide route) render per request. Each
page and its `generateMetadata` begins with `await connection()`, which is the request boundary
that Cache Components needs before a dynamic slug is resolved.

- **Why the boundary is mandatory.** `generateStaticParams` enumerates only a subset of catalogue
  slugs at build time. Without a request boundary every other slug is served the build-time
  fallback shell, which renders "not found" with HTTP 200 (a soft 404) instead of the real page.
  Removing `await connection()` from these routes is a production outage, not an optimisation.
- **All reads stay cached.** The boundary only defers rendering to request time; every database
  read behind it remains inside `"use cache"` / `"use cache: remote"` functions using the `catalog`
  `cacheLife` profile (`next.config.ts`): one-year `revalidate`, no `expire` (infinite). There is
  no timer-based refresh at all: an entry changes only when a publish expires its own tag. A cached
  page that nobody publishes to is never re-queried.
- **Not-found lookups are cached for minutes only.** `getCountryBySlug`, the cached university
  reader and `getProgramBySlug` call `cacheLife(CATALOG_MISS_CACHE_LIFE)` (`lib/data/catalog.ts`,
  1 min stale / 5 min revalidate / 15 min expire) on their miss path. Hits keep the long-lived
  profile; a slug published without a matching invalidation, or an empty read during a database
  incident, heals on its own.
- **Publishes send entity-scoped tags only.** `scripts/publish-catalog-payload.ts` and
  `app/api/revalidate/route.ts` may only emit `university:<slug>`, `university-programs:<slug>`,
  `country:<slug>`, `country-programs:<slug>`, `course-programs:<slug>`, `city-programs:<slug>` and
  `program:<slug>`, plus the three index paths (`/universities`, `/courses`, `/countries`), the
  bounded discovery-index tags (`finder`, `program-offerings`, `comparison-guides`,
  `budget-guides`) and `sitemap`. Per-slug readers must not carry any of those shared tags
  (`getProgramBySlug` deliberately omits `program-offerings`), so a publish re-queries exactly the
  entities it touched plus a handful of bounded index reads. Never send
  the shared `universities`, `catalog` or `countries` tags, and never expire dynamic route patterns
  such as `/[slug]` or `/countries/[slug]`: those regenerate the entire catalogue against Neon at
  once. This supersedes the earlier note that the root route shell had to be expired for new
  slugs; the request boundary makes that unnecessary. `tests/db-egress-guards.test.ts` enforces
  all of the above.
- **Every revalidating script names its scope.** `scripts/lib/trigger-revalidate.ts` has no
  default scope and refuses the shared `catalog`, `universities`, `countries` and `courses`
  tags at runtime. Scopes on `/api/revalidate`: `catalog` adds the bounded discovery tags and
  index paths above and must carry slugs or paths (with no target the route still expires every
  catalogue route pattern, so scripts never send it bare); `guide` maps each slug to
  `guide:<slug>` plus `/<slug>`; `exact` sends only the given tags and paths; `blog` is for
  blog posts; a missing scope means `blog`. Current senders:

  | Script | Scope | Tags and paths |
  | --- | --- | --- |
  | `publish-catalog-payload.ts` | catalog | entity tags, programme slugs, university and country paths |
  | `publish-university-draft.ts` | catalog | entity tags (the shared `universities` tag was removed), programme slugs, university path |
  | `unpublish-university.ts` | catalog | `university:`, `university-programs:`, `country:`, `country-programs:`, `course-programs:`, `city-programs:`, programme slugs, university and country paths (previously `catalog`, `universities`, `program-offerings` with no target) |
  | `add-program-offerings.mjs`, `update-program-fees.mjs` | catalog | entity tags, programme slugs, university paths |
  | `migrate-study-abroad-guides-to-db.ts` | guide | `guide:<slug>` for inserted guides, or `study-abroad-guides` past 10, plus `/<slug>` paths (previously `catalog`, `study-abroad-guides` on the implicit catalog scope) |
  | `import-india-mbbs-colleges.ts`, `import-india-medical-programs.ts` | exact | global refresh of the India dataset: `india-medical-colleges`, `india-medical-programs`, `india-mbbs-finder`, `sitemap` (previously the implicit catalog scope, which also expired every catalogue route pattern) |
  | `revalidate-blog-cache.mjs` (via `lib/revalidate-blog-cache.mjs`) | blog | blog slug |

  Guide readers: `getStudyAbroadGuideBySlug` carries `guide:<slug>`, so a guide sync
  re-queries only the changed guides. Related-content lists keep their cached guide set until
  `study-abroad-guides` expires. `tests/db-egress-guards.test.ts` scans every file under
  `scripts/`: dataset-wide tags (the four shared tags, `study-abroad-guides` and the India
  dataset tags) may be sent only by files on its `GLOBAL_REFRESH_ALLOW_LIST`, and each of those
  files needs a `// Global refresh:` comment explaining why. No script is allow-listed for the
  four shared catalogue tags.

Incident note (2026-09-09): commit `78df9c9` (2026-08-11) had removed `await connection()` from
the university, country and course routes. On 2026-09-09 a publish run invalidated the shared
`universities`/`catalog` tags and the dynamic route patterns, evicting the cached pages. Because
the routes no longer had a request boundary, every non-enumerated slug fell back to the build-time
shell: roughly 700 university pages, 4,400 programme pages and the new country pages (for example
`/countries/india`) rendered "not found" with a 200 status until the boundary was restored and
publish invalidation was scoped to entity tags.

## Known issues / gotchas

- **A `research-drafts/<country>/<slug>.json` file existing does NOT mean it is current or in the DB.**
  These files belong to the retired database-backed draft workflow. Treat them as discovery leads,
  claim the university through the shared CSV queue and repackage only currently verified facts in
  a numbered content migration. Do not seed the historical queue or invoke
  `publish-university-draft.ts` from a research session.
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
`publish-university-draft.ts` and `publish-catalog-payload.ts` refresh only the affected
universities' rows in the Postgres `search_documents` table via
`refreshSearchDocumentsForUniversities` (`lib/search/university-search-documents.ts`): four
slug-bounded reads, one batched upsert of each university's `university` document and its published
`program` documents, then one delete of that university's rows that are no longer published.
Country and course documents aggregate many universities and are not rebuilt per publish. The admin
search screen's "Rebuild Postgres index" retains the full rebuild as an explicit recovery/maintenance
operation; it is not part of the per-university hot path.

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
Every Codex or Claude agent must use `queue:claim`, `queue:update` and `queue:release`; manual CSV
editing is prohibited. The queue rejects duplicate canonical slugs and normalized names while its
lock prevents concurrent writers from losing updates. The migration runner validates the complete
ledger and payload association before connecting to Neon. Database slug constraints remain the final
identity boundary, and only one controlled integrator applies pending migrations.

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

## Medium normalization (2026-09-09)

`instruction_languages` remains the controlled teaching-language facet. `medium` is its short display label (e.g. `English` or `English / French`), or `Not confirmed` when delivery cannot be established. `medium_details` preserves the original evidence and caveats; it is not a stats-card value. Admission-test requirements, translated application instructions and foreign-language electives do not establish teaching language. Never default missing medium to English.

Both publishers use `lib/program-medium.ts`. Migration `0073_normalize_program_medium` adds the notes column and a write trigger enforcing canonical labels from language codes. Run `npx tsx scripts/normalize-program-medium.ts` to preview legacy changes and add `--apply` to back up and normalize the configured database, including search-document labels. Verify the printed database target before applying. No course, fee, admission, or publication fields are changed.
