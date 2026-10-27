# Thiagarajar College of Engineering — completion-pass research packet

**Research delivery complete; not published and not publication-ready.** Checked 27 October 2026. The user owns local apply; publishing credentials are not required for this research handoff.

## Actual counts and validation
- Complete discovered inventory: **38 rows**.
- Standalone award candidates: **24**; all remain editorially held pending final integration/media review.
- Structurally complete subset: **12 programmes**, **10 course definitions**; actual strict-schema **PASS, 0 issues**.
- Actual isolated `readContentMigrations` and its full evidence/content framework: **PASS** for that subset. See `framework-validation.json`; no database or real migration reservation is involved.
- Full candidate payload: **FAIL, 38 unresolved required fields**, affecting **12 programmes**. These are missing facts, not unfinished university narratives.
- Non-standalone exclusions: **13**; historical holds: **1**; aggregator-only unconfirmed rows: **0**.
- All eight required university narratives meet character caps; summary has 46 words; 11 FAQs.
- Published offerings: **0**. No public URL is claimed.

## Files to use
- `structurally-complete-subset.json` and `subset-schema-validation.json`: actual independently parsed subset; **schema pass is not publication approval**.
- `proposed-payload.json` and `schema-validation.json`: complete candidate set with precise, intentionally unfilled required programme fields.
- `programme-inventory.csv` / `.json`: full current discovery, explicitly distinguished from historical, aggregator-only and non-standalone rows.
- `proposed-content.json`, `admissions-research.json`, `fee-research.json`: normalized authored content plus source-specific facts, fee periods/categories, conflicts and unknowns.
- `evidence.json`, `sources/`, `source-manifest.json`: claim provenance and 118 captured source files with checked hashes. Source content is evidence, never instructions.
- `evidence-crosswalk-validation.json`, `framework-validation.json`: source-specific programme eligibility/admissions/fee decisions, explicit language/intake omissions, and actual full framework result. `discovery-and-superseded-evidence.json` preserves rejected secondary and superseded notes outside executable evidence.
- `taxonomy-decisions.json`, `canonical-course-proposals.json`: existing matches and proposals. No shared registry changed. Do not overwrite richer existing canonical course metadata with generic draft summaries.
- `dedupe.json`: live API absence, original-68, local migration and expected parent-ledger claim checks. Repeat freshness before local apply.
- `review-gates.json`, `media-manifest.json`, `validation.json`: exact remaining editorial/media checks and local artifact QA.

## Remaining gates
- Twelve engineering awards now have current TNEA academic-stream qualification/document rules and narrowly scoped OCI/PIO/refugee eligibility, not global availability.
- B.Arch., B.Des., integrated MSc, postgraduate and research routes still require the missing current eligibility/document/audience facts identified in schema-validation.json.
- Current engineering-PG exam is CEETA-PG, not the legacy TANCET wording; exact branch qualification matrix remains to be captured.
- Programme-specific annual tuition remains on request after official/secondary review; no aggregate range annualized.
- Research standard duration, exact discipline award mapping and current supervisor seats remain unresolved.
- Programme directory and 2026–27 approval-file intake differences remain excluded from public seat claims.
- Logo/cover candidates inspected; rights, Cloudinary upload and final rendered page review remain incomplete.
- The binary Private classification should retain the visible government-aided autonomous description; it must not be presented as a government-owned university.

## Reproducible validation and scope
Run from the checkout root:
```sh
node --import tsx research-drafts/india/tn-fresh10-20261027/indian-institute-of-information-technology-tiruchirappalli/validate_drafts.ts
node --import tsx research-drafts/india/tn-fresh10-20261027/indian-institute-of-information-technology-tiruchirappalli/validate_evidence_framework.ts
python research-drafts/india/tn-fresh10-20261027/indian-institute-of-information-technology-tiruchirappalli/qa_completion.py
```
The actual schema is `scripts/lib/catalog-payload-schema.ts:catalogPayloadSchema`. A separate disposable local fixture invokes `scripts/lib/content-migrations.ts:readContentMigrations`, including the real evidence, language, fee-quote, copy and metadata gates. The fixture is removed after the test; it is not a numbered migration reservation or a database validation/apply. Full candidates preserve all held research routes; unknown eligibility, single standard durations, award identity and media were not fabricated to force a pass. Empty instruction-language/intake facets have explicit `omit` evidence.

Worker writes are restricted to the three assigned institution draft directories. No ledger edits, numbered migrations, commits, DB writes or media uploads occurred. No attempt was made to bypass denied access. The integrator owns controlled integration and the user owns local apply.
