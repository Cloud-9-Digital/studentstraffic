# Non-Medical University Expansion — Scoping Notes

Written 2026-07-08 when the user asked to add Vietnam's general universities/programs (Business, IT,
Engineering, Law, Hospitality, Agriculture, etc.), matching a competitor's broader "Study in Vietnam"
coverage. Paused before data population once it became clear the university page template assumes a
medical program throughout — this file captures what was found so the next session doesn't have to
rediscover it. This is **Phase 3** of `docs/university-expansion-plan.md` — not started, this is just
scoping.

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
  WDOMS listing → NMC approval → FMGE/NExT exam eligibility. Has hardcoded explanatory copy about
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
   `stream` is a free-text-backed union type already covering `engineering`/`other`; would want to
   extend `CourseStream` in `lib/data/types.ts` with `business`, `law`, `hospitality`, `agriculture`,
   `education` for semantic clarity, still zero-migration since it's a TS union over a text column).
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
and `admissions-section.tsx` are still hardcoded for India's medical regulatory pathway (WDOMS/NMC/
FMGE/NExT) and still cannot render non-medical recognition or admissions info (UGC/AICTE/BCI, etc.).
Real non-medical university/program data still cannot be populated until the domain research and
template redesign described in "What's needed before data population can resume" (above) is done.
Do not read the brand-copy pivot as progress on that work — the catalog today is still MBBS/BDS/
MD-MS/Nursing only, and no brand copy was written that overclaims specific non-medical program or
university counts.
