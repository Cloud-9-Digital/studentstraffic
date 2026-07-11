# University & Program Content Spec

Content minimums and structure for agents researching/writing university and program content
(the fields on `universities` and `program_offerings` in `lib/db/schema.ts`, and
`university.admissionsContent`). Read this alongside `docs/university-pipeline-architecture.md`
(mechanics) and `docs/project-standards.md` (voice/tone) before writing.

## Why this exists

Audited a reference page the user pointed to
(`/university/dit-deggendorf-bscn`, ~6,500-7,500 words, 40+ specific data points, 13+ FAQs) against
several recently-published universities in our own DB (2026-07-08). The gap was stark and
quantifiable, not just a feeling:

| | DIT Deggendorf (reference) | Typical recent publish |
|---|---|---|
| `recognitionBadges` | multiple, specific | **null — completely empty** |
| FAQ count | 13+ | 4-6 |
| Narrative field length | ~3,000+ words across Overview/Campus/Accommodation/Daily-living/Safety | ~400-1,700 characters (~70-280 words) per field, one undifferentiated paragraph each |
| Numeric specificity | EUR 582/semester, EUR 13.90/hour, 87% employment rate, 41% international | generic ranges, few hyper-specific figures |
| "Things to consider" | specific caveats (e.g. Indian Class 12 ≠ German Abitur, bridge-year required) | present but genericized |

None of this requires fabrication — DIT's numbers are all real, sourced facts. The gap is
**research depth and structural decomposition**, not invented detail. Everything below is about
digging up and organizing more real facts, never padding with generic filler or guessing.

## Minimum bar per field

### `recognitionBadges` / `recognitionLinks` — never leave empty, and never write non-recognitions

Every published university must have at least 2-3 real recognition/accreditation badges with
verification URLs. If genuinely none exist yet (very new institution), that's a signal the
university may not be ready to publish — flag it rather than publishing with an empty array, which
currently happens silently.

**A badge must name a specific, real, third-party body and the actual recognition/accreditation
status it confers** — not a descriptive fact about the university itself. Audited the full DB
2026-07-09 and found 193 non-recognition strings across 140 universities (marketing taglines,
redundant metadata, generic ownership descriptors) that had been written into this field, likely
from early templated batch scripts. Cleaned up, but the pattern must not recur:

- **Real (keep this pattern):** `"NMC FMGL 2021 Compliant"`, `"CASN Accredited"`, `"official regulatory sources Listed"`,
  `"AMEE (Association for Medical Education in Europe) — Member"`, `"IRCCS Research Hospital"`
  (a real Italian institutional designation), `"QAA (UK) — Five-Year Institutional Accreditation
  (reviewed June 2025)"`, `"DLI: O19395164223"` (a real Canadian government designation), `"EQF
  Level 6 — European Qualifications Framework"`. Each names a specific body/designation and is
  independently verifiable.
- **Not real (never write these):** `"Elite Hub"`/`"Siberian Leader"`/`"Global Elite"`-style
  invented positioning taglines; plain ownership/type facts like `"Public university"` or `"Private
  medical university"` (that's what the `type` field is for); redundant admin metadata like
  `"2025 tuition published by term"` or `"English admissions page available"`; unverifiable
  superlatives like `"Global Top-100 Hub"` or `"Largest Indian Base"` with no named ranking source;
  vague pedagogical marketing like `"Problem-Based Learning Model"` or `"Digital Health &
  Simulation"`. If it doesn't name a specific body/designation a student could independently verify,
  it doesn't belong here.
- **Watch for names that sound official but aren't verifiable** — e.g. an "ESQR Quality Choice
  Prize"-style award or a "Medical Council of Europe"-style body that doesn't actually exist under
  that name. If you can't find independent corroboration that a body is real and actually confers
  the claimed status, omit it rather than include it on the strength of how official it sounds.
- Facts about clinical/industry partnerships (e.g. a named teaching hospital or company partnership)
  belong in `clinicalExposure`/`teachingHospitals`, not `recognitionBadges`, even when true.

### `summary` — the hero field, needs outsized attention

`summary` renders as the hero paragraph — the large text directly under the page title, above the
fold, before any scrolling. It is the one field every visitor actually reads, unlike the other
narrative fields further down the page that depend on scroll depth. **Audited this specifically
2026-07-09 after a batch of "expanded" universities still averaged only ~970 characters (~150-160
words) here** — DIT Deggendorf's reference `summary` runs ~2,700+ characters (~450 words). A
content pass that decomposes facts evenly across all 7 narrative fields under-serves `summary`
specifically, since it competes with campusLifestyle/hostelOverview/etc. for the same research
facts instead of getting a disproportionate share.

**Target: 300-450 words (~2,000-2,800 characters) for `summary`.** It should function as a
standalone, complete mini-profile — founding year, size, ranking/reputation context if genuine,
program structure basics, cost headline, and at least one honest, specific, non-flattering data
point where one exists (e.g. Sechenov's summary in our own DB already does this well: it states its
2024 FMGE pass rate is *below* the national average, rather than only citing its prestigious global
ranking — that specificity and honesty is the right pattern, it just needs 2-3x more length around
it). When revising a university already in the DB, treat `summary` as the field to expand first and
most, not evenly with the others.

### Other narrative fields (`campusLifestyle`, `clinicalExposure`, `hostelOverview`,
`indianFoodSupport`, `safetyOverview`, `studentSupport`) — decompose, don't compress
Each field should read like DIT's dedicated sub-sections, not one generic paragraph:
- `campusLifestyle`: physical campus facts (founding year, student count, % international,
  specific facilities — library, labs, language center), not just "modern campus with good
  facilities."
- `hostelOverview` / `indianFoodSupport`: **specific cost ranges by housing type** (dormitory vs.
  private apartment vs. shared flat, each with a EUR/USD number), specific named grocery/restaurant
  options or the honest absence of them and nearest city that has them, specific transport costs.
- `safetyOverview`: specific claims (crime-rate framing, named support services — international
  office, buddy programs, emergency contacts), not just "safe country."
- `studentSupport`: specific programs by name (e.g. "Welcome Team," "weBuddy programme"), specific
  post-arrival logistics (registration office, insurance enrollment, banking).
- `clinicalExposure` (or its non-medical equivalent, see `docs/non-medical-expansion-scope.md`):
  specific practical-training structure — teaching hospitals/partner companies **by name**, not a
  generic description of "hands-on training."

Target: each field should be able to stand alone as a genuinely informative paragraph a student
could act on, not a placeholder that just confirms the topic exists.

### `whyChoose` / `thingsToConsider` / `bestFitFor` — specific, not generic
"Things to consider" in particular must include real, specific caveats surfaced by research — e.g.
an academic-year-length mismatch (12-year Class 12 vs. 13-year Abitur), a mandatory local-language
interview, a narrow single-intake window, a work-rights restriction. Generic caveats ("costs can be
high," "language may be a barrier") are a sign research wasn't specific enough — go back to sources
and find the *actual* mechanism, not a hedge.

### `faq` — target 10-13 questions, not 4-6
Cover these categories at minimum (skip only if genuinely inapplicable to the field/country):
1. Public or private institution?
2. Language/medium — including any transition (e.g. English-then-local-language structures)
3. Direct admission eligibility straight after qualifying exam, or bridge requirements
4. Total cost breakdown (tuition + fees + living, not just headline tuition)
5. How to apply — exact portal/route, not "apply through the university"
6. Language/English-test requirements
7. Program-specific admission mechanics (training contracts, interviews, entrance exams)
8. Any stipend/earn-while-studying provisions, if applicable
9. Intake timing and application window
10. Any special certificate/pre-approval requirement (e.g. APS-style certificates)
11. Recognition/accreditation status and what it means for the student's home country
12. Accommodation options and cost
13. A comparison-flavored question (why this vs. a similar alternative), if a genuine comparison
    point exists

Each answer should be a real paragraph with specific facts, matching the depth in the Humanitas
FAQ sample already in our DB (2-4 sentences, specific facts, honest "confirm current status"
caveats where things can change) — that part of our current content is already at the right bar;
extend it to more questions, don't dilute existing ones.

### `program_offerings` fields — same principle
`feeNotes`, `licenseExamSupport`, `teachingPhases`, `yearlyCostBreakdown` should carry the same
density of specific, sourced numbers (per-year cost breakdown, not just an annual total; named exam
support like "FMGE prep sessions" not generic "exam support available").

## What this does NOT mean
- Do not pad content to hit a word count with restated or generic sentences — every added sentence
  must carry a new, real, sourced fact.
- Do not fabricate numbers to look more specific — omit per the existing exhaustive-then-omit rule
  (`docs/project-standards.md`, `[[project_university_content_sourcing]]` memory) if a real figure
  can't be found after genuine research effort.
- This is a *floor*, not a template to fill mechanically — if a university genuinely has less to say
  about a topic (e.g. no notable stipend program exists), say so honestly rather than inventing
  content to hit a count.

## How to apply
- New universities/programs (research pipeline): research agents should treat this spec as the
  target depth, not the old shorter defaults.
- Filling gaps in already-published universities: worth a follow-up pass to backfill
  `recognitionBadges` (currently empty on several live universities) and expand FAQs — this is
  cheaper than re-researching from scratch since the university's core facts are already verified.
- Keep this file updated when the reference bar changes or new field-specific guidance is learned.
