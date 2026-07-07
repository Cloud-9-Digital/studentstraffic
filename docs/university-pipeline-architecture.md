# University & Program Data Pipeline — Reference

Read this before touching university/program data (schema, seed scripts, or the
research-and-publish pipeline) instead of re-deriving it from source each time.
Keep it current — see "Keeping this doc current" at the bottom.

## Data model (`lib/db/schema.ts`)

- **`countries`** — one row per country (slug, name).
- **`courses`** — course catalog (e.g. `mbbs`, `bds`, `bsc-nursing`, `pharmacy`). Programs reference a course.
- **`universities`** — one row per published university. Key fields:
  `slug`, `name`, `city`, `type`, `establishedYear`, `officialWebsite`, `published`, `featured`,
  narrative fields (`campusLifestyle`, `cityProfile`, `clinicalExposure`, `hostelOverview`,
  `indianFoodSupport`, `safetyOverview`, `studentSupport`), array fields (`whyChoose`,
  `thingsToConsider`, `bestFitFor`, `teachingHospitals`, `recognitionBadges`), `faq`,
  `researchSources` (citations), `lastVerifiedAt`.
- **`programOfferings`** — one row per program at a university, FK to `universities` + `courses`.
  Key fields: `slug`, `title`, `durationYears` (⚠️ **integer column** — see Known issues),
  `annualTuitionUsd`/`totalTuitionUsd`/`livingUsd` (normalized USD), `officialFeeCurrency` +
  `officialAnnualTuitionAmount`/`officialTotalTuitionAmount` (native-currency figures, bigint),
  `officialProgramUrl`, `medium` (language of instruction), `intakeMonths`, `sourceUrls`, `published`.
- **`universityResearchQueue`** — candidate universities sourced from WDOMS (World Directory of
  Medical Schools) or manually added. Status lifecycle: `new → researching → draft_ready →
  published | hold | rejected`. Has `priority` (high/medium/low).
- **`universityResearchDrafts`** — one draft per queue entry: `sourceBundle` (raw source URLs/content),
  `structuredFacts`, `draftContent` (shaped to match the `universities`/`programOfferings` schema),
  `qualityScore`, `reviewNotes`, `verifiedAt`.

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
