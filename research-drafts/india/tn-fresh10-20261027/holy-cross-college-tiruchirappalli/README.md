# Holy Cross College — research handoff

**Not published. Do not apply the schema review specimen.**

Named inventory: **88 rows** (75 degree/research; 13 short/add-on). Individually held PhD routes: 14.
Schema-shaped review fragments: **47**. Programme-level draft eligible: **0**; held: **88**. Publish-ready: **0**.

## Evidence and coverage
- `programme-inventory.csv` uses the standard inventory columns. `programme-records.json` preserves funding/shift, exact fee period, annual tuition where explicit, source URLs and per-row holds.
- `taxonomy-mappings.json` uses the current canonical registry. `taxonomy-proposals.json` contains unapproved proposals only.
- The local-only `sources/` work folder retains official downloads and retrieval receipts. Full raw pages/PDFs/media are excluded from Git delivery; `source-register.json` and `admissions-provenance.json` preserve public URLs and precise source locators. Current fee tables supersede historical references.
- `freshness.json` captures original68, ledger/migration and live 404 API checks. Parent subsequently owns this batch claim; no duplicate was found.
- `proposed-content.json` contains university narrative/FAQs. The DO-NOT-PUBLISH specimen makes schema testing reproducible without claiming evidence completeness.

## Validation
Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/holy-cross-college-tiruchirappalli/validate-offline.cjs`.
The offline script tests shape and inventory/hold invariants. The separate actual framework reader test below supersedes any earlier implication that shape alone proves evidence completeness.

## Remaining gates
- **pending** — International-audience eligibility remains unknown outside the limited foreign-equivalence wording for BASLP; every row carries a publication hold.
- **pending** — Current regulator sources for audiology, rehabilitation and special education; professional scope for Physician Assistant; exact ambiguous PG and shift criteria.
- **unavailable** — No usable current programme-specific tuition schedule. Official and secondary fee checks do not support annual tuition values.
- **uncertain** — MSc Visual/Media Communication titles, MSc Computer Science qualification variants, PGDBI/PGDPM shifts and older-only PGDMET/BCom CA Shift I need reconciliation.
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

## Admissions provenance correction — 2026-10-27
Actual `readContentMigrations` result: **0 pass / 47 fail** out of 47 review fragments; baseline was 0 pass / 47 fail. Full specimen passed: **False**.

Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/holy-cross-college-tiruchirappalli/validate-framework.cjs`. The script creates and removes an isolated disposable fixture inside this research directory; it does not reserve a real migration or access a database.

`admissions-provenance.json` links each exact offering to the captured official source and section/line locator. `framework-validation.before.json` preserves the real baseline; `framework-validation.json` records the actual post-repair reader, not a reimplementation.

31 UG/integrated fragments have a sourced UG application procedure. None of the 47 has a captured named document checklist; 16 PG fragments also lack a captured current PG procedure. Unsupported generic document claims have been removed, leaving explicit empty arrays and deliberate schema failures rather than fabricated evidence. Audience and existing programme-specific holds remain.

GitHub delivery is handled serially by the integrator. Missing publishing credentials are not treated as a research blocker. No production publishing, media upload or Vercel access is part of this correction.
