# University & Program Data Pipeline — Reference

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
- **`universityResearchQueue`** — candidate universities sourced from WDOMS (World Directory of
  Medical Schools) or manually added. Status lifecycle: `new → researching → draft_ready →
  published | hold | rejected`. Has `priority` (high/medium/low).
- **`universityResearchDrafts`** — one draft per queue entry: `sourceBundle` (raw source URLs/content),
  `structuredFacts`, `draftContent` (shaped to match the `universities`/`programOfferings` schema),
  `qualityScore`, `reviewNotes`, `verifiedAt`.

## Generalizing discovery to non-medical fields (scoped, NOT built)

Today the discovery queue is medical-only: `universityResearchQueue` rows are seeded from **WDOMS**
(World Directory of Medical Schools) — see `wdomsDirectoryEntries` and
`scripts/seed-university-research-queue.ts`. WDOMS is a single authoritative global registry of medical
schools, which is why the whole discover→research→publish pipeline could bootstrap from one import. The
column `universityResearchQueue.wdomsSchoolId` and the `wdoms_school_id` on drafts are the only
medicine-specific hooks in the queue; everything downstream (research, draft, publish) is already
field-generic now that the columns are renamed (above) and the template is stream-aware.

When non-medical discovery is actually built (out of scope here — do NOT build or seed it now), a
"non-medical discovery source" would replace WDOMS as the seed for the queue. There is no single
global registry equivalent to WDOMS for business/engineering/law/etc., so expect **per-field,
per-country accreditor lists** instead of one import, e.g.:
- Engineering: national accreditation bodies / ministry-approved institution lists (e.g. a country's
  higher-education ministry register), or a recognized ranking/registry for that field.
- Business: AACSB / EQUIS / AMBA accredited-school directories, or national B-school registries.
- Law / others: the relevant national regulator or university-grants-commission register for the
  destination country.

Concretely, generalizing would mean: (1) a `discoverySource` discriminator on the queue (`"wdoms"`
today; `"accreditor:<body>"` / `"registry:<name>"` for others) so `wdomsSchoolId` isn't assumed;
(2) a per-source seed importer analogous to `seed-university-research-queue.ts` that writes queue rows
with a generic external id; (3) the same research/publish scripts unchanged. The **recognition** copy
must stay data-driven (read from `recognitionBadges`/`recognitionLinks`) with the honest generic
fallback — never hardcode field-specific regulatory claims (UGC/AICTE/BCI etc.), because those differ
by field and country and several (e.g. BCI for foreign law degrees) are materially different from the
medical NMC pathway. See `docs/non-medical-expansion-scope.md`.

## Two ways to add universities

### 1. Automated research-and-publish pipeline (preferred for net-new universities)

```
scripts/seed-university-research-queue.ts   → populate universityResearchQueue (from WDOMS import)
scripts/run-university-research.ts          → research a queued candidate, write a draft
                                               (also writes a human-readable .md alongside the .json
                                               in research-drafts/<country>/ for audit trail)
scripts/publish-university-draft.ts         → validate + insert draft into universities/programOfferings
scripts/seed-nonwdoms-draft.ts              → for universities not in WDOMS (surrogate id `disc-<country>-<slug>`)
```

Drafts live as JSON in `research-drafts/<country-slug>/<university-slug>.json` before publish.

Editorial safeguards already enforced by this pipeline (see [[project_university_content_sourcing]]
memory and `docs/project-standards.md`):
- Multi-source verification required — never trust one official site alone.
- Facts must be omitted, not fabricated, if unverifiable ("exhaustive-then-omit").
- Programs must map to an actual course in the catalog and be genuinely open to
  international/Indian students (citizenship/PR-gated or vocational-only programs get **held**, not published).
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

### 2. Manual batch seed scripts (used historically per-country, e.g. Russia/Georgia/Uzbekistan/Kyrgyzstan)

Pattern: `scripts/seed-<country>-batch<N>.mjs` — a plain array of university objects (same shape as
`draftContent`/`universities` columns above) with a nested `programs[]` array, inserted directly via
a SQL `Pool`. Use `scripts/seed-russian-universities-batch1.mjs` as the template. Prefer the pipeline
above for new work; these remain mainly as historical reference and for one-off manual corrections.

## Known issues / gotchas

- **A `research-drafts/<country>/<slug>.json` file existing does NOT mean it's in the DB.**
  `publish-university-draft.ts` reads only from the `universityResearchQueue` /
  `universityResearchDrafts` tables via `--queue-id`, never from the JSON file directly. Non-WDOMS
  drafts (and some WDOMS drafts that were held before ever being ingested) frequently have no queue
  row at all. **Always check for an existing queue row first**; if none exists, run
  `scripts/seed-nonwdoms-draft.ts --file <path>` to create the queue+draft pair from the JSON (prints
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
