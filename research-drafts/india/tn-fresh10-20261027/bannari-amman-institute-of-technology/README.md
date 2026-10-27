# Bannari Amman Institute of Technology — research handoff

**Outcome: held. Ten-UG research subset passes the actual isolated catalogue reader and strict schema. No production migration is reserved or published. Local integrator ledger claim is held; remote-ledger synchronization is unverified here.**

Current institution-level taught inventory reconciled to 10 UG and 4 PG programmes. The 2026 UG regulations resolve the old AI/ML mismatch; the ECE department confirms the new VLSI title/duration. All are held at professional-approval/publication gates; not live.

## Coverage

- Inventory rows: 43.
- Taught programme fragments: 14; individually held doctoral research-area drafts: 13; unenumerated doctoral-inventory discovery placeholders: 0.
- Row states: {"current_taught_held": 14, "current_cycle_conflict_held": 1, "doctoral_research_area_held": 13, "historical_not_current": 13, "embedded_pathway_excluded": 2}.
- Complete current taught portfolio verified: yes at institution-source layer, with regulator/route gates still held.
- No programme is silently treated as international-eligible. `unknown` is not local-only.
- Current doctoral research-area candidates remain in catalogue scope and individually held, not blanket-excluded. Historical awards are not new admissions; embedded pathways are not independent entry awards.

## Exact holds

- Current AICTE regulator-owned programme list/EoA for 2026-27 not read; institute disclosure reference is not substitute. No professional programme publication until this gate is cleared.
- ME/MBA precise qualifying-degree combinations and applicable entrance/counselling routes need current programme-specific authority; no generic engineering admission copied.
- AI/ML old/new conflict and obsolete programmes must remain excluded; ME VLSI current 2026 source supersedes stale Communications Systems intro, but approval remains held.
- Mandatory logo and real-campus-cover HTTP 200/image content-type, white-tile visual QA, rights record and Cloudinary hosting not completed.
- No confirmed branch/category-specific annual tuition. The official 2026–27 quota/NBA-category fee table is preserved privately, but its exact billing period, currency label and tuition-only components are not explicit; the branch accreditation category also remains unverified. Conflicting secondary full-course figures are not annualised.
- Each of the 13 listed doctoral research areas is retained within catalogue scope and individually held for exact award, duration/mode, current admission/audience rules and awarding-university authorization.
- Latest remote duplicate/ledger recheck and any executable payload assembly, mandatory media validation and actual scoped catalogue/migration validation remain integrator work before publication; they do not prevent research-bundle delivery.

## Taxonomy

Canonical matches use the checkout registry; exact official titles and shift variants remain separate. No shared taxonomy edits. Proposed gaps (all held, not packaged):



## Delivery and action boundaries

Researcher did not mutate the queue; the integrator local claim exists under research_tn_batch_b and is held. Remote-ledger synchronization is unverified in this completion pass. The researcher changed only the three assigned institution research folders; no shared queue edits, commits, DB connections/writes, media upload or publication were performed. Original-68 profiles are untouched.

Research delivery target is GitHub/local bundle; the user owns live publishing. Missing live-publishing credentials do not block saving or handing off this research. Evidence, media and actual catalogue/migration validation remain separate publication gates. The earlier Vercel 403 was not retried or bypassed.

## Actual catalogue validation (completion pass)

- `catalogue-subset-candidate.json`: 10 regular UG candidates and 10 existing canonical courses. All university required narrative fields, fees with explicit status, teaching phases, route restrictions and per-offering evidence are authored.
- `catalogue-subset-schema-validation.json`: actual strict `catalogPayloadSchema.safeParse` PASS.
- `catalogue-reader-validation.json`: actual isolated `readContentMigrations` PASS; 10 programmes, 10 courses, 120 evidence records and zero expired evidence.
- Temporary test manifest used a synthetic ID only inside this research folder and was deleted after the check. It is not a migration reservation and is never placed in `content-migrations/`.
- `catalogue-subset-crosswalk.json` enumerates the included per-offering evidence, the four excluded PG routes and thirteen held doctoral research areas. All 43 inventory rows are retained.
- `official-fee-table.json` preserves the newly checked 2026–27 quota/NBA-category table without inventing currency, annual period or tuition-only components. No `reportedFeeQuote` is manufactured from the unresolved basis.
- PASS is structural/framework validation, not external approval or editorial authorization. All ten UG candidates remain held for current AICTE regulator-owned approval, complete audience assessment and mandatory media.

Reproduce without queue, database or publishing operations:

```sh
node --import tsx research-drafts/india/tn-fresh10-20261027/bannari-amman-institute-of-technology/complete-catalogue-subset.ts
python research-drafts/india/tn-fresh10-20261027/bannari-amman-institute-of-technology/validate-research.py
```

The custom Python checks remain supplementary. The complete 14 taught-fragment research draft is not itself a `CatalogPayload`; only the separate ten-UG subset receives the actual schema/reader pass. No PG eligibility, current AICTE approval, international admission route or media evidence was invented to obtain a pass.
