# Non-Medical University Expansion — Scoping Notes

Written 2026-07-08 when the user asked to add Vietnam's general universities/programs (Business, IT,
Engineering, Law, Hospitality, Agriculture, etc.).

> **Current operational status (2026-07-13):** this document is historical design context, not a
> publishing gate. The page template is stream-aware and the approved worldwide taxonomy is live.
> A non-medical university or programme may be published when it has primary-source evidence,
> exact taxonomy mapping, validated field limits, clear restrictions and a complete atomic payload.
> Do not hold a record merely because its stream is non-medical.

## Why this isn't just a data task

The `universities`/`program_offerings` schema itself is field-generic (text/jsonb columns with names
like `clinicalExposure` — these hold arbitrary text, no DB constraint ties them to medicine). The
`CourseStream` type (`lib/data/types.ts`) already includes `"engineering"`, `"vocational"`, `"other"`
alongside medical streams, and nothing in `app/` branches on stream — so schema-wise, this is
low-cost. **The actual blocker is the page template**, which has real medical-specific structure and
copy, not just labels.

## Component-by-component findings (`components/site/university/`)

**Deep/structural — needs real design work, not just relabeling:**
- `recognition-detail-section.tsx` — entire section is built around India's medical licensing chain:
  official regulatory verification → NMC approval → FMGE/NExT exam eligibility. Has hardcoded explanatory copy about
  this specific regulatory pathway. A business/engineering/law degree has a **completely different**
  recognition concept (UGC equivalence, AICTE approval for engineering, possibly NAAC/NBA
  accreditation, BCI for law — and BCI generally does NOT recognize foreign law degrees for Indian
  bar enrollment, which is a materially different fact pattern than medicine's NMC pathway). This
  needs domain research into what "recognition" actually means per non-medical field before any UI
  or data model work — not something to guess at without expertise on Indian equivalence rules.
- `admissions-section.tsx` — hardcoded copy assumes NEET score, Class 12 PCB, NMC Eligibility
  Certificate. None of this applies to Engineering (JEE/12th PCM), Business (12th + varies), Law, etc.

**Minor — quick generic-fallback fixes, not structural:**
- `academics-section.tsx` — **already fixed** 2026-07-08. Section labels ("Clinical exposure" →
  "Teaching hospitals") now conditionally read as "Practical training & industry exposure" /
  "Industry & placement partners" when `primaryProgram.course.stream` isn't a medical stream. Icons
  swap too (Hospital→Building2, FlaskConical→Briefcase). Safe, backward-compatible, no data changes
  needed.
- `faq-section.tsx`, `fees-detail-section.tsx`, `student-life-section.tsx` — each has a
  `course.shortName ?? "MBBS"` fallback. Harmless as long as `course.shortName` is always populated
  (which it will be), but worth removing the medical-specific fallback value when this work resumes.
- `tabbed-faq-section.tsx` — one line of static intro copy mentions "clinical training" alongside
  fees/visa/career — minor rewording needed.

**Clean, no changes needed:** `hero-section.tsx`, `counselling-section.tsx`, `content-sections.tsx`,
`sticky-nav.tsx`, `shared.tsx`.

## What's needed before data population can resume

1. **Domain research** on what "recognition" and "admissions requirements" actually mean for each
   target field in the Indian-student context (Engineering, Business/MBA, Law, Hospitality,
   Agriculture, Education, Architecture) — this is the load-bearing unknown, not the UI code itself.
2. Redesign `recognition-detail-section.tsx` and `admissions-section.tsx` to be stream-aware (or build
   parallel field-specific variants) once #1 is answered.
3. New `courses` table rows for the target fields (schema supports this with zero migration —
   `stream` is a free-text-backed union type). **Done 2026-07-09:** `CourseStream` in
   `lib/data/types.ts` now includes `business`, `law`, `hospitality`, `agriculture`, and `education`
   alongside the existing `engineering`/`vocational`/`other` streams (still zero-migration — a TS union
   over the existing `courses.stream` text column). Adding the actual `courses` rows and the
   universities/programs is the data step that is still not started.
4. Only then: run the discover+research → verify+publish pipeline for Vietnam's general universities,
   same 2-stage pattern as medical, but scoped to these new course categories.

## Status: paused, awaiting the user's call on how to proceed (2026-07-08)

## Update 2026-07-09 — business has decided to pivot, brand copy updated; technical blocker unchanged

The user has now confirmed this is not just a Vietnam Phase 3 pilot decision — the business intends
to actively move toward "all kinds of courses ... not limited to medical only," positioning Students
Traffic as "a one-stop destination for all streams, programs, universities and countries."

As of this change, the brand-level copy across the site (homepage hero + metadata, `lib/constants.ts`
site description, `app/about/page.tsx` metadata/hero/mission copy) has been reworded away from
MBBS/medical-only framing toward this broader "one-stop destination" positioning. This was a
**copy/positioning change only** — no new data was populated and no template code was touched.

**The technical blocker documented above is completely unchanged.** `recognition-detail-section.tsx`
and `admissions-section.tsx` are still hardcoded for India's medical regulatory pathway (official regulatory sources/NMC/
FMGE/NExT) and still cannot render non-medical recognition or admissions info (UGC/AICTE/BCI, etc.).
Real non-medical university/program data still cannot be populated until the domain research and
template redesign described in "What's needed before data population can resume" (above) is done.
Do not read the brand-copy pivot as progress on that work — the catalog today is still MBBS/BDS/
MD-MS/Nursing only, and no brand copy was written that overclaims specific non-medical program or
university counts.

## Correction — 2026-07-09 (later same day): the template blocker above was already resolved

The paragraph directly above ("technical blocker... completely unchanged") was inaccurate at the time
it was written — commit `aba4124` ("Restructure university pages: dedicated program pages,
stream-aware content", 2026-07-07) had already made both `recognition-detail-section.tsx` and
`admissions-section.tsx` branch on `primaryProgram.course.stream`, landing **before** this doc's
2026-07-08 write-up but not reflected in it. Re-audited both files end-to-end during the scalability
refactor pass (2026-07-09):

- `recognition-detail-section.tsx` — intro copy, the verify-status banner, and the "what this means
  for you" closing section all branch on `isMedicalStream` (derived from
  `["medicine","nursing","dental","pharmacy","physiotherapy"]`). Non-medical rendering uses honest,
  generic accreditation language (no invented UGC/AICTE/BCI claims) and reads `recognitionBadges`/
  `recognitionLinks` from the DB either way. The official regulatory sources block only renders when a `official-directoryEntry` is
  actually present, which is naturally medical-only data — no hardcoding needed there.
- `admissions-section.tsx` — `admissionsIntro`, `defaultSteps`, eligibility intro/items/documents, and
  the eligibility FAQ all branch the same way. The "Licensing Pathway" sub-section (FMGE/NExT/official regulatory sources
  career-pathway copy) is now gated behind `isMedicalStream &&` — it does not render at all for
  non-medical streams, rather than rendering a false pathway.
- `academics-section.tsx` was already confirmed fixed in the paragraphs above.

**Remaining minor items from the original findings, fixed 2026-07-09:** the `course.shortName ?? "MBBS"`
(and one `?? "BN"`) fallbacks in `faq-section.tsx`, `fees-detail-section.tsx`,
`recognition-detail-section.tsx`, `section-shell.tsx`, `student-life-section.tsx`, and
`tabbed-faq-section.tsx` now fall back to the neutral `"this program"` instead of an MBBS-specific
default (this fallback only ever shows when a university has no published program at all, regardless
of stream). `tabbed-faq-section.tsx`'s static intro line was reworded from "clinical training" to
"practical training".

**Net effect:** the university page template is now stream-aware end-to-end and does not require
further template work to unblock non-medical rendering. `hero-section.tsx`, `counselling-section.tsx`,
`content-sections.tsx`, `sticky-nav.tsx`, `shared.tsx`, `hostel-detail-section.tsx`,
`programs-section.tsx`, `program-nav.tsx`, and `program-section-shell.tsx` were re-checked and contain
no medical-specific hardcoding. What is still genuinely open (per "What's needed before data
population can resume" above, still valid): #1 domain research on what recognition/admissions
actually mean per non-medical field, and #4 running the discover/research/publish pipeline for
non-medical universities. #2 and #3 (partially — see `lib/data/types.ts` `CourseStream` union) are
now done.
