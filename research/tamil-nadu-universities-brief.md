# Tamil Nadu universities: research brief for batch workers

Scope list: `research/tamil-nadu-universities-scope.csv` (68 UGC-listed universities, 2026-10-22).
Each worker packages exactly one university from that list, end to end, and stops at ledger
status `validated`. Publishing is a separate, user-approved step.

## Read first

`docs/content-seeding-runbook.md` (ledger §1a, inventory §1b, offline migration §1c, taxonomy §2,
sources §3, facets §3a, payload §4, media rules, validation), `docs/university-content-spec.md`,
`docs/university-page-architecture.md`, `docs/content-framework.md`, `docs/project-standards.md`,
`docs/programme-taxonomy.md`, `content-migrations/README.md`, `scripts/lib/catalog-payload-schema.ts`.

Reference bundles:
- `content-migrations/0118-india-kalasalingam-academy-of-research-and-education`: the approved lean,
  answer-first university page (deemed university, INR and USD fees).
- `content-migrations/0117-india-joy-university`: mixes international programmes (`global`, USD) with
  domestic-only programmes (`restricted`, INR).
- `content-migrations/0115-india-sardar-raja-college-of-engineering`: TNEA route, restricted
  availability wording, and the 2026-27 Anna University calendar and TNEA 2026 dates with their sources.

## Identity and merging

- One page per university. Merge every campus, off-campus, constituent college, faculty and school
  listed in the scope row's `merged_spreadsheet_rows` into the parent. Each campus's programmes become
  programme offerings with the campus in the official title or notes. No separate pages for schools.
- Do not include affiliated colleges (colleges that only take the university's degree).
- Use the scope CSV's `proposed_slug` unless the official name proves it wrong; if you change it,
  say why in the report.
- Check the ledger for aliases and old names before claiming.

## Programmes: all current ones

- Package every current programme on the official programme pages and admission notices for
  2026-27: UG, PG, integrated and diploma. Ph.D. areas stay out of the package. Record them in the
  inventory only, as the earlier batches did.
- Audience is programme data, not a publication gate (runbook "Non-negotiable content standard"):
  - Programmes with a published international/NRI/foreign route: `availability: "global"`, with
    that route's fee and currency.
  - Programmes with only a domestic route: `availability: "restricted"`, or `"local-only"` when no
    non-Indian route exists at all. State the restriction precisely. Use the official INR fee where
    published, otherwise `on_request` with the reason.
- Regulator gates. Hold a programme when its regulator's own current list does not show it:
  - BCI (law), INC (nursing), PCI (pharmacy), NMC (MBBS/MD/MS), DCI (BDS/MDS), COA (B.Arch),
    NCTE (B.Ed), AICTE (engineering/MBA/MCA at affiliated institutions where applicable).
  - Record the exact gap in the inventory notes.
- Specialisations chosen after admission are `major_within` rows, not offerings.
- Very large universities: if the full current inventory is above about 150 offerings, package
  every UG and PG programme of the main campus and the merged campuses. If that is still not
  feasible in one bundle, split by faculty into consecutive bundles reserved with
  `content:reserve` and report it.

## Taxonomy (shared between concurrent workers)

- Exact canonical matches only. Map Anna University-style "AI and Data Science" to
  `be-btech-data-science`, as 0114–0117 and 0119 do.
- Before adding a canonical course, check `lib/data/program-taxonomy.ts`, `docs/programme-taxonomy.md`
  and every pending `content-migrations/*/payload.json` for the slug. If another bundle already
  ships it, copy that course record byte-identical. If you add a new one, add it to
  `lib/data/program-taxonomy.ts` immediately, so the other workers see it. Keep the summary generic and
  university-neutral, then lint that file and run `tests/program-taxonomy.test.ts` only.

## Lean, answer-first content standard

- Facts only, with no marketing adjectives. Meet the schema minimums with real facts and never pad.
- The first sentence of every narrative field and every FAQ answer directly answers the question
  and names the university in full plus its common short form (e.g. "SASTRA", "SIMATS").
- Every number carries its unit, currency and academic year.
- `summary`: 35-70 words covering what it is (UGC category, the Act or deemed-status year), where,
  what it teaches, and that it awards its own degrees.
- `whyChoose`, `thingsToConsider` and `bestFitFor`: exactly 3 concrete items each. Caveats must be
  real (entrance tests, location, regulator gaps, fee basis).
- FAQ: 6-10 questions phrased the way people search ("Is X UGC approved?", "What is the B.Tech fee at
  X?", "Does X admit international students?", "What is the NAAC grade of X?", "Which entrance exam
  does X use?").
- Recognition badges must come from the regulator's own list only: UGC category and year, NAAC grade,
  CGPA, cycle and validity, NBA programmes with validity, NIRF rank and year. Add matching
  `recognitionLinks`.

## Sources

Use primary sources only: the official site, prospectus, fee notices, admission notifications, UGC,
NAAC, NBA, NIRF data files, AICTE, regulators and Study in India. Aggregators (Shiksha, Collegedunia,
Careers360) are a missed-programme checklist only. Never guess fees, intakes or recognition.

## Media

Find an official logo and a real campus cover that are legible on white. Record them in
`research/media-enrichment/india-tn-universities-<slug>.json` in the same format as
`research/media-enrichment/india-batch-4-upload-manifest.json`, with the rights basis and checked
date. Do not upload. Reject composites, AI-looking photos and close-ups of identifiable students,
and record the reason for any hold.

## Process and hard rules

- Ledger: `npm run queue:claim` and `npm run queue:update` with the owner and batch given in your task.
  Never hand-edit the CSV.
- Migration number: reserve it with `npm run content:reserve -- --name india-<slug> --description "..."`.
  Never choose it yourself.
- Inventory: `research/india-programme-inventory/<slug>.csv` and `.md` first. Keep durable drafts
  in `research-drafts/india/`.
- Validate with `npm run content:validate -- --id <your id>`. Stop at `validated`.
- Stay offline: no database connection, no Cloudinary upload, no commits, no pushes.
- Never put the user's email or any personal data in request headers or anywhere else.
- No full-project typecheck, test suite, lint or build: they freeze the user's machine.
- Other workers run concurrently in this checkout. Touch only your own slug's files, plus additive
  edits to `lib/data/program-taxonomy.ts` as above.

## Final report (concise)

1. Confirmed identity and merged campuses.
2. Migration ID and payload path.
3. Programmes packaged vs inventoried, split global and restricted, with held programmes and reasons.
4. Scoped validation result.
5. Ledger status.
6. Media status.
7. Any new canonical courses.
8. Remaining evidence gaps, plus anything the user should decide before publishing.
