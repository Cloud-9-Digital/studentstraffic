# Lady Doak College — research handoff

**Not published. Do not apply the schema review specimen.**

Named inventory: **75 rows** (49 degree/research; 26 short/add-on). Individually held PhD routes: 8.
Schema-shaped review fragments: **26**. Programme-level draft eligible: **26**; held: **49**. Publish-ready: **0**.

## Evidence and coverage
- `programme-inventory.csv` uses the standard inventory columns. `programme-records.json` preserves funding/shift, exact fee period, annual tuition where explicit, source URLs and per-row holds.
- `taxonomy-mappings.json` uses the current canonical registry. `taxonomy-proposals.json` contains unapproved proposals only.
- The local-only `sources/` work folder retains official downloads and retrieval receipts. Full raw pages/PDFs/media are excluded from Git delivery; `source-register.json` and `admissions-provenance.json` preserve public URLs and precise source locators. Current fee tables supersede historical references.
- `freshness.json` captures original68, ledger/migration and live 404 API checks. Parent subsequently owns this batch claim; no duplicate was found.
- `proposed-content.json` contains university narrative/FAQs. The DO-NOT-PUBLISH specimen makes schema testing reproducible without claiming evidence completeness.

## Validation
Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/lady-doak-college-madurai/validate-offline.cjs`.
The offline script tests shape and inventory/hold invariants. The separate actual framework reader test below supersedes any earlier implication that shape alone proves evidence completeness.

## Remaining gates
- **pending** — 15 PG, 8 PhD and supplementary awards need exact current eligibility/duration/authorization as recorded individually.
- **uncertain** — Current handbook gives four online certificates; official counselling source names three. Fourth title is not enumerated and is not fabricated.
- **uncertain** — Handbook counts 3 diploma/9 certificate courses whereas current programme directory names 5 diploma/14 certificate routes. Union retained; current admission activity of directory-only short courses needs confirmation.
- **pending** — Serial editorial review, field evidence review and current original68/ledger/API freshness recheck before reservation.
- **pending** — Media rights, logo/cover final suitability, authorized Cloudinary upload and public asset verification.

## Fee handling
- No first-semester or combined first-year amount is annualised or relabelled as tuition. No USD conversion or cohort-total extrapolation is made.
- Native quotes retain the 2026–27 period, institutional category and original source. Application/exam charges are not used as tuition.
- Lady Doak: only a labelled annual tuition column supports `annualTuitionInr`; aided UG combined totals do not establish NIL annual tuition.
- Missing language/intake values are not inferred from the website language or historical calendars.

## Scope discipline
Only the three assigned research-draft directories were written. No shared queue, taxonomy registry, numbered migration, commit, production database or media upload was changed. Existing credential and Vercel access denials were not bypassed.

## Inventory counting
- Repeated integrated-programme listing under UG and PG is deduplicated as one full award; lateral entry is a separately held admission route.
- General student clubs, workshops, exam-preparation modules, curriculum components and unenumerated value-added-course totals are not invented as standalone admitting qualifications. Named supplementary courses are included where sufficiently identifiable.
- Current handbook reports 54 value-added courses without a complete named independent-admission catalogue; counselling activities Discovering the Real Self and Conflict Resolution and Mediation Skills are curricular activities, not represented as separate degrees or independently admitting awards.

## Admissions provenance correction — 2026-10-27
Actual `readContentMigrations` result: **26 pass / 0 fail** out of 26 review fragments; baseline was 0 pass / 26 fail. Full specimen passed: **True**.

Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/lady-doak-college-madurai/validate-framework.cjs`. The script creates and removes an isolated disposable fixture inside this research directory; it does not reserve a real migration or access a database.

`admissions-provenance.json` links each exact offering to the captured official source and section/line locator. `framework-validation.before.json` preserves the real baseline; `framework-validation.json` records the actual post-repair reader, not a reimplementation.

All 26 UG routes now contain the source-backed UG application/counselling procedure, exact named verification documents, conditional certificate scope and verified admissions evidence. The 12 aided UG annual tuition values remain on request because the official fee tables support combined charges rather than isolated annual tuition.

GitHub delivery is handled serially by the integrator. Missing publishing credentials are not treated as a research blocker. No production publishing, media upload or Vercel access is part of this correction.
