# Bishop Heber College — research handoff

**Not published. Do not apply the schema review specimen.**

Named inventory: **121 rows** (82 degree/research; 39 short/add-on). Individually held PhD routes: 17.
Schema-shaped review fragments: **36**. Programme-level draft eligible: **0**; held: **121**. Publish-ready: **0**.

## Evidence and coverage
- `programme-inventory.csv` uses the standard inventory columns. `programme-records.json` preserves funding/shift, exact fee period, annual tuition where explicit, source URLs and per-row holds.
- `taxonomy-mappings.json` uses the current canonical registry. `taxonomy-proposals.json` contains unapproved proposals only.
- The local-only `sources/` work folder retains official downloads and retrieval receipts. Full raw pages/PDFs/media are excluded from Git delivery; `source-register.json` and `admissions-provenance.json` preserve public URLs and precise source locators. Current fee tables supersede historical references.
- `freshness.json` captures original68, ledger/migration and live 404 API checks. Parent subsequently owns this batch claim; no duplicate was found.
- `proposed-content.json` contains university narrative/FAQs. The DO-NOT-PUBLISH specimen makes schema testing reproducible without claiming evidence completeness.

## Validation
Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/bishop-heber-college-tiruchirappalli/validate-offline.cjs`.
The offline script tests shape and inventory/hold invariants. The separate actual framework reader test below supersedes any earlier implication that shape alone proves evidence completeness.

## Remaining gates
- **pending** — Programme-specific UG subject criteria; general current 10+2 eligibility is not enough to clear the 36 review fragments.
- **pending** — All 26 PG entries need exact current entry requirements and independently confirmed duration; library award labels conflict.
- **uncertain** — Self-financed Botany/Zoology appear in directory but not current portal/fee table; proposed BBA Tourism and Hotel Management remains subject to approval.
- **blocked_http_403** — Direct official-site PDF/media downloads returned HTTP 403; readable official web retrieval retained. This is a website response, not permission approval.
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
Actual `readContentMigrations` result: **0 pass / 36 fail** out of 36 review fragments; baseline was 0 pass / 36 fail. Full specimen passed: **False**.

Run from repository root: `node --import tsx research-drafts/india/tn-fresh10-20261027/bishop-heber-college-tiruchirappalli/validate-framework.cjs`. The script creates and removes an isolated disposable fixture inside this research directory; it does not reserve a real migration or access a database.

`admissions-provenance.json` links each exact offering to the captured official source and section/line locator. `framework-validation.before.json` preserves the real baseline; `framework-validation.json` records the actual post-repair reader, not a reimplementation.

All 36 review fragments now have verified portal process and named-document evidence. Their general UG eligibility is still indicative, not promoted to programme-specific verified qualification evidence; all 36 correctly fail the real reader on that unresolved gate.

GitHub delivery is handled serially by the integrator. Missing publishing credentials are not treated as a research blocker. No production publishing, media upload or Vercel access is part of this correction.
