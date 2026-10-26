# Tamil Nadu next-wave institutions: worker brief (25 October 2026)

Companion to `research/tamil-nadu-universities-brief.md`. That brief covers the 68 UGC-listed
universities (now 66 published, 2 held). This brief covers the **next wave**: prominent autonomous
colleges, government colleges and deemed institutions in Tamil Nadu that are not on the UGC
university list but carry significant student search demand.

Every worker packages exactly one institution end to end and stops at ledger status `validated`.
The controlled integrator applies the bundle.

## Read first

- `docs/content-seeding-runbook.md` — ledger §1a, inventory §1b, offline bundle §1c, taxonomy §2,
  sources §3, facets §3a, payload §4, media rules, validation.
- `docs/university-content-spec.md`, `docs/university-page-architecture.md`,
  `docs/content-framework.md`, `docs/project-standards.md`, `docs/programme-taxonomy.md`.
- `content-migrations/README.md`; `scripts/lib/catalog-payload-schema.ts`.
- Reference bundles for shape and depth: `0310-india-sri-ramachandra-expansion` (medical, dual-route
  fees), `0337-india-svce-postgraduate-portfolio-rescue` (autonomous engineering college),
  `0339-india-sairam-postgraduate-academic-rescue`, `0118-india-kalasalingam-academy-of-research-and-education`.

## Identity

- One page per institution. Colleges affiliated to Anna University (or another parent) keep their own
  page and their own name; the degree-awarding parent is stated in research/recognition, not merged.
- Do not merge sister institutions, hostels, or affiliated colleges that merely share a brand.
- Check the shared ledger and every `content-migrations/*/payload.json` for aliases before claiming.
- Canonical `university.city` is the plain city/town (e.g. `Vellore`, `Madurai`, `Coimbatore`).
  Neighbourhood, district, state and postal detail belongs in `cityProfile`.

## Programmes

- Inventory every current 2026-27 programme from the official site, prospectus, admission notices and
  fee pages first: `research/india-programme-inventory/<slug>.csv` + `.md`.
- Package every programme open to a catalogue audience. For domestic-only routes use
  `availability: "restricted"` (or `"local-only"` when no non-Indian route exists) and state the
  restriction precisely. Do not omit a verified programme merely because it is domestic-only.
- Regulator gates — hold a programme when the regulator's own current list does not show it:
  NMC (MBBS/MD/MS), DCI (BDS/MDS), INC (nursing), PCI (pharmacy), BCI (law), COA (B.Arch),
  NCTE (B.Ed), AICTE (engineering/MBA/MCA where applicable), NCAHP where relevant.
- Specialisations chosen after admission inside one umbrella degree are `major_within` inventory rows,
  not separate offerings.
- Ph.D. and research programmes stay out of the package; record them in the inventory only.

## Fees and audience

- Prefer confirmed official INR tuition for the exact programme and applicant category with academic
  year and billing basis. Mark third-party or combined/first-year figures `indicative` or use
  `reportedFeeQuote`; never annualise a semester or full-course amount.
- Government and government-aided colleges often publish very low tuition plus separate hostel and
  special fees. Record each component with its basis; a confirmed native zero tuition is publishable
  only with explicit evidence and compulsory-charge notes.
- Autonomous colleges under Anna University admit through TNEA (UG) and TANCA/CEETA-PG (PG). Record
  the actual counselling route for each programme, with the current year's calendar where published.
- Teaching language: publish only when a source establishes it. Otherwise `medium: ""` and empty
  `instructionLanguages` with `status: "omit"` evidence. Same for intake months.

## Recognition

- Badges must name a real third-party body and status: NAAC grade/CGPA/cycle/validity, NBA programme
  accreditation and validity, NIRF rank and year, AICTE approval, UGC 2(f)/12(B) for the college,
  NMC/DCI/INC/PCI approval, Anna University affiliation where it is a genuine regulatory fact.
- Verify on the regulator's own published list, never the institution's own claim page alone.
- Plain type or ownership facts are not badges.

## Content

- Lean, answer-first, facts only. `summary` 35-70 words.
- Student-living fields have hard ceilings (campus 700, accommodation 800, daily living 550, safety
  450, support 450 characters). Every sentence carries a real facility, cost, restriction or action.
- `whyChoose` / `thingsToConsider` / `bestFitFor`: exactly 3 concrete items each; caveats must be real
  (counselling cut-offs, hostel capacity, commute, regulator gaps).
- FAQ: 8-12 search-phrased questions with specific answers.
- Every material claim carries a private evidence record (entity, publicField, claimText, sourceLabel,
  sourceUrl, sourceGrade, checkedAt, reviewBy, status). Primary sources only; aggregators are a
  discovery checklist.

## Media

- Official logo plus a real campus cover, recorded in
  `research/media-enrichment/india-tn-<slug>-20261025.json` with source URL, rights basis, checked
  date and cover alt text. Each URL must return HTTP 200 with an `image/*` content type; the logo must
  be legible on a white tile. Do not upload.

## Process

- Claim: `npm run queue:claim -- --slug <slug> --name "<official name>" --country india --owner <owner> --batch tn-batch29-20261025 --priority high`, then `queue:update --status researching`.
- Reserve: `npm run content:reserve -- --name india-<slug> --description "..."`. Never choose a number.
- Validate: `npm run content:validate -- --id <id>`. Stop at `validated` with `--migration`, `--payload`
  and `--programmes`.
- Stay offline: no database connection, no Cloudinary upload, no commits, no pushes.
- Do not spawn nested agents. No full-project typecheck, test suite, lint or build.
- Owner and batch ids are given in each task. Other workers run concurrently in this checkout; touch
  only your own institution's files, plus additive canonical-course edits as allowed by the shared
  taxonomy rule.

## Final report

1. Confirmed identity and any merged campuses.
2. Migration ID and payload path, or why held.
3. Programmes packaged vs inventoried, split by audience, with held programmes and reasons.
4. Scoped validation result.
5. Ledger status.
6. Media status.
7. Any new canonical courses.
8. Remaining evidence gaps and anything the user should decide before publishing.
