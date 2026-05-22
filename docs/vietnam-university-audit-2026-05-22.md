# Vietnam University Audit

Date: 2026-05-22

## Verdict

No, the Vietnam university catalog is not fully accurate and verified yet.

The country is live and populated, but the current Vietnam university pages are still closer to a seeded catalog than to the research-grade standard now used for Georgia.

## What I Checked

- Published Vietnam universities in the live catalog
- Published Vietnam program offerings
- Presence of verification dates
- Specificity of official program URLs
- Whether each university has an MBBS-like offering or only postgraduate content
- A small official-source spot check for current Vietnam medicine pages already linked in the database

## Current Catalog Snapshot

- Published Vietnam universities: `29`
- Published Vietnam program offerings: `32`
- Universities missing `last_verified_at`: `29`
- Programs missing `fee_verified_at`: `30`
- Programs using the university homepage as `official_program_url` instead of a real course page: `27`
- Universities with MBBS-like medicine offerings: `26`
- Universities that are effectively PG-only in the current live catalog: `2`

## High-Confidence Findings

### 1. Verification metadata is almost entirely missing

All `29` Vietnam universities currently have `last_verified_at = null`.

That means none of the Vietnam university pages can honestly be treated as recently verified.

### 2. Fee verification is almost entirely missing

`30` of the `32` live Vietnam program offerings have no `fee_verified_at`.

For a country page set that relies heavily on tuition comparisons, this is a major accuracy risk.

### 3. Most program URLs are not specific enough

`27` live Vietnam programs currently use the university homepage as the `official_program_url`.

That is not strong enough for a research-grade page because:

- it does not prove the exact medical program exists in the claimed format
- it does not prove the language of instruction
- it does not prove current tuition
- it does not prove the clinical structure or intake details

### 4. Two Vietnam university pages are PG-only in the live catalog

These two live university pages currently do not have a published MBBS-style program attached:

- `pham-ngoc-thach-university-medicine`
- `vnu-university-of-medicine-and-pharmacy-hanoi`

That may be intentional if these pages are meant for postgraduate pathways, but if they are being surfaced as part of the broader Vietnam MBBS funnel, they need clearer positioning.

### 5. The current Vietnam content appears to come from an older seeding approach

The pattern is consistent across the country:

- generic program titles like `Doctor of Medicine (MBBS equivalent)`
- broad tuition values with no verification date
- homepages used as official program sources
- no current research drafts in `research/university-guides/vietnam/`

This is materially weaker than the new queue -> draft -> publish flow now used for Georgia.

## Examples of Why This Is Risky

These are not necessarily all wrong, but they are not strong enough to trust without re-research:

- `hanoi-medical-university-mbbs` uses `https://hmu.edu.vn` as the program URL
- `can-tho-university-medicine-pharmacy-mbbs` uses `https://ctump.edu.vn` as the program URL
- `ump-ho-chi-minh-city-mbbs` uses `https://ump.edu.vn/` as the program URL
- `vinuniversity-college-health-sciences-mbbs` uses `https://vinuni.edu.vn/` as the program URL

For each of these, we still need a current official medicine-page source and a current fee source before the content can be called accurate.

## What This Means Operationally

Vietnam should not be treated as complete in the same way Georgia now is.

Georgia status:

- queue-backed
- source-backed drafts
- publish-gated
- newly researched pages for missing universities

Vietnam status:

- mostly seeded live catalog
- weak verification metadata
- weak source specificity
- no country research-draft batch yet

## Recommended Next Step

Move Vietnam into the same research workflow used for Georgia.

Recommended order:

1. Create Vietnam research drafts for the highest-traffic universities first.
2. Rebuild each university from official sources.
3. Add real `last_verified_at` and `fee_verified_at`.
4. Replace homepage URLs with actual program and fee URLs.
5. Re-publish only after draft validation passes.

## Priority Universities To Re-Research First

Start with the pages most likely to influence user decisions and SEO:

- `ump-ho-chi-minh-city`
- `hanoi-medical-university`
- `hue-university-medicine-pharmacy`
- `can-tho-university-medicine-pharmacy`
- `vinuniversity-college-health-sciences`
- `vnu-hcmc-school-of-medicine`
- `thai-nguyen-university-medicine-pharmacy`
- `pham-ngoc-thach-university-medicine`

## Bottom Line

Vietnam is live, but it is not fully verified.

The safest statement today is:

`Vietnam pages need a structured re-research pass before we should trust them as accurate university pages.`
