# UNC Chapel Hill admissions enrichment report — 2026-07-14

## Scope and identity

- Target: existing `university-of-north-carolina-chapel-hill` only.
- Live DB pre-check: university id `826`, canonical name “University of North Carolina at Chapel Hill”, `published=true`.
- Ledger pre-check: one existing published row; no duplicate claim or identity/program slug changes.
- Existing programme count: six; all six were audited and backfilled.

## Published programme admissions content

The payload now carries a distinct validated `admissionsContent` object for each existing offering:

- `bs-computer-science-unc-chapel-hill` — UNC international first-year/transfer route, English tests, 2026–27 testing policy, October 15/January 15 undergraduate dates, documents and I-20/DS-2019 note.
- `bs-biological-sciences-unc-chapel-hill` — same UNC undergraduate route, Biology-specific academic progression, transfer date, documents and immigration-document note.
- `phd-computer-science-unc-chapel-hill` — UNC CS/Graduate School route, mathematics and CS preparation, early-January guidance, transcripts/statements/recommendations and international processing note.
- `mph-unc-gillings` — Gillings concentration/format-specific eligibility, application route, document set and an explicit hold on guessing a universal deadline.
- `mba-unc-kenan-flagler` — Full-Time MBA degree, testing/waiver, professional experience, essays, recommendation, round-specific deadline verification and immigration-document note.
- `jd-unc-law` — JD/LSAC/CAS/LSAT route, undergraduate-degree requirement, holistic file, documents, current school deadline verification and immigration note.

Primary sources used include UNC Undergraduate Admissions, UNC undergraduate and graduate catalogs, UNC Computer Science, Gillings, Kenan-Flagler and UNC School of Law pages. Claims not exposed as stable current dates were qualified rather than inferred.

## Corrections and validation

- Removed the live `{}` admissions-content gap through the validated catalogue publisher.
- Corrected contaminated shared catalogue copy for CSE, PhD Computer Science and MBA so it no longer references CU Boulder or Leeds.
- JSON/schema validation passed after correcting provenance kinds to the publisher’s allowed `official-program` value and including the CSE focus keyword in its meta description.
- Atomic publish succeeded: six programme slugs, three cache tags and one university path revalidated.
- DB post-check: university and all six programmes remain published; each admissions object contains overview, eligibility, application steps, documents, deadline note and visa considerations.
- Cloudinary logo and cover URLs returned HTTP 200; no new media was required.

## Production QA

All seven scoped production URLs returned HTTP 200 and contained UNC body content. The existing report-only title-shell regression remains: programme HTML responses have a blank `<title>`, while the university title is incorrectly targeted to the CSE catalogue page. This was not changed because the requested scope excludes app/lib/scripts changes; it is recorded for a separate regression fix.

## Held scope

Taxonomy-gap items remain held in `research/programme-taxonomy-gaps-university-of-north-carolina-chapel-hill-2026-07-12.md`; no unmatched UNC awards were relabelled or added.
