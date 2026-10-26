# Tamil Nadu fee pass: brief for fee-correction workers

Goal: fill in the fee for every programme that currently shows "Fee on request" at one published
Tamil Nadu institution. Use the best fee evidence the validator allows, and package it as a
correction bundle. Stop at ledger `validated`; publishing is a separate step.

## Read first

- `content-migrations/README.md`: the supersede rule for correction bundles.
- `docs/content-seeding-runbook.md`: fee rules, including "Reported fee quote fallback".
- `docs/university-pipeline-architecture.md`: `fee.audience`, `additionalFees`, and the
  `admissionsContent.reportedFeeQuote` contract.
- `scripts/lib/catalog-payload-schema.ts` and `scripts/lib/content-migrations.ts`: these define
  what the validator accepts.
- `research/india-programme-inventory/<slug>.md`: what the original researcher already found and
  couldn't find.

## Where to look (search widely)

Search the web broadly, including aggregators, to locate fee documents. Then cite the strongest
source you can reach:

1. **Grade A (official):**
   - the university or college fee page, prospectus PDF or fee notification;
   - the admission portal's fee table;
   - the AICTE mandatory disclosure (it carries a fee table);
   - the NIRF data file;
   - the Tamil Nadu Fee Fixation Committee order for self-financing colleges;
   - the DoTE TNEA booklet or TANCET booklet;
   - government G.O.s on fees for government and aided colleges.
2. **Grade B (credible secondary):** a government or regulator page that reports the fee, or an
   official document re-hosted by a government site. A university's fee figure quoted in a reputable
   newspaper report also counts, but only when no official document is reachable.
3. **Any other website** (Shiksha, Collegedunia, Careers360, CollegeDekho, news sites and similar)
   is Grade C. Since 2026-10-26 the validator accepts Grade C evidence for an **indicative
   `reportedFeeQuote` only**, which pages show as "Approx. fees". Prefer an official document when
   one is reachable. Otherwise use the best third-party figure:
   - record the exact page URL, its label, and the academic year it states;
   - record the period (`academic_year`, `semester`, `first_year` or `full_course`) and the
     category (for example management quota);
   - set `status: "indicative"` and `sourceGrade: "C"`.

   Never use Grade C for a confirmed fee.

## How to record each fee

- **Clean annual tuition from an official source:**
  - `fee.status: "confirmed"`, in INR (or USD when the source quotes it), with the academic year.
  - Set `fee.audience` (`domestic`, `international` or `all`) from the source, never from the currency.
  - Needs Grade A `verified` fee evidence.
- **Both an Indian-student and an NRI/foreign fee in the same official table:** the main fee plus
  `additionalFees`.
- **Credible fee that isn't a clean annual tuition** (per semester, first year only, includes other
  charges, or comes from a Grade B source): keep `fee.status: "on_request"`, and add
  `admissionsContent.reportedFeeQuote` with Grade A `verified` evidence or Grade B `indicative`
  evidence, exactly as the runbook's "Reported fee quote fallback" describes.
- **Government and aided colleges:** the state-fixed nominal fee is a real fee. Cite the G.O. or
  the college's own notice.
- **Nothing credible found:** leave the programme unchanged, and record what you searched in
  `research/india-programme-inventory/<slug>.md` under a dated "Fee pass 2026-10-26" heading.

## Packaging

1. Copy the institution's latest payload: the ledger row's `migration_id` / `payload_file`.
2. Change only fees, fee notes, `reportedFeeQuote` and the matching evidence. Keep every other
   field byte-identical.
3. Reserve a new bundle with
   `npm run content:reserve -- --name india-<slug>-fees --description "Correction superseding <old id>: fills programme fees ..."`.
4. Write `payload.json` there.
5. Point the ledger row at the new bundle with `npm run queue:update`. Use the row's existing owner
   and keep its status (`published` stays `published`), passing `--migration` and `--payload`.
6. Validate: `npm run content:validate -- --id <new id>`.

If no programme gained a fee, don't create a bundle.

## Hard rules

- Stay offline: no database connection, no publishing, no Cloudinary, no commits.
- Never put personal data or anyone's email in request headers.
- No full-project typecheck, test suite, lint or build.
- Other workers run concurrently in this checkout. Touch only your own institution's files.

## Final report (short)

1. Institution and new migration ID, or "no bundle".
2. Programmes that gained a fee, split into confirmed, reported quote and both-fee, out of the number
   that were missing a fee.
3. The main sources used and their grades.
4. Programmes still without a fee, and why.
5. Validation result and ledger status.
