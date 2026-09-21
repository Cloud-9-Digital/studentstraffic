# Marwadi University -- Programme Inventory

Research pass only (India batch 3, Phase B). No payload/ledger/DB/docs edits were made from this file.

## Sources used

1. **Official international fee flyer (primary, per-programme evidence)** --
   `https://www.marwadiuniversity.ac.in/wp-content/uploads/2026/03/Fees-USD-Flyer_2026-27-2.pdf`
   ("FEES STRUCTURE FOR INTERNATIONAL ADMISSIONS 2026-27", fetched 2026-09-21). Reachable. This is a
   4-page, faculty-by-faculty table naming every degree the university opens to international
   admission with duration and annual USD fee (with-hostel / without-hostel). `pdftotext -layout`
   misaligns the fee/duration columns on this file (confirmed by the shortlist screen), so every row
   in the CSV was cross-checked against the **visually rendered PDF pages**, not the raw text dump.
   Every row on this flyer is treated as `open_to_international` evidence, since the document's sole
   purpose is to price international admission per named programme.
2. **International Admissions page** -- `https://www.marwadiuniversity.ac.in/international-admissions/`
   (fetched 2026-09-21, stripped of script/style). Reachable. Confirms the admission process (document
   submission to a country coordinator, offer letter, then confirmation), the Study in India / Ministry
   of Education scholarship route, and that eligibility is checked programme-by-programme against the
   published catalogue ("check the website to see if the course... is available"). No separate
   per-programme eligibility PDF beyond the fee flyer was found. Recorded as `other_sources` on every row.
3. **Sitemaps** -- `sitemap_index.xml`, `page-sitemap.xml`, `post-sitemap.xml`,
   `internationalprogram-sitemap.xml`. Reachable, but none exposed a static, curl-readable per-programme
   directory: `internationalprogram-sitemap.xml` indexes only two international-student blog posts (not
   a course catalogue), and `page-sitemap.xml` lists only 3 individual "-main-course" pages (BCA, MCA,
   LLM) out of ~50+ live programmes -- the rest of the university's course-detail pages are not indexed
   as standalone WordPress pages/posts (likely rendered from a database-backed catalogue plugin, not
   curl-reachable as flat URLs). Given this, individual programme pages for duration/eligibility text
   were **not** fetched one-by-one; duration was taken from the fee flyer table itself, which the
   university publishes as the authoritative international-admissions reference.
4. **Study in India / AICTE / NIRF** -- not queried in this pass. The shortlist screen
   (`research/india-university-shortlist-batch3.md`) found no NIRF 2025 rank for Marwadi on the pages
   parsed; no rank is badged here. Flagged as a follow-up for the packaging stage (NAAC/NBA/NIRF
   recognition badges).
5. **Aggregators (Shiksha/Collegedunia/Careers360)** -- not queried this pass; the fee flyer already
   gives a complete, dated, official per-programme catalogue, so no missed-programme checklist pass was
   needed to reach full coverage. If the packaging agent wants extra confidence, a checklist pass
   against aggregators is still recommended before publish, per the runbook.
6. **Canonical taxonomy** -- `docs/programme-taxonomy.md` and `lib/data/program-taxonomy.ts` (all
   ~180 canonical slugs read and diffed against every CSV row).

## Campus

Marwadi University is a **single-campus** institution: Rajkot-Morbi Road, Rajkot 360003, Gujarat,
India. All 69 rows share `campus = "Rajkot, Gujarat"`.

## Counts

- **Total programmes catalogued (excl. PhD): 69** (PhD (All Disciplines) row excluded per task scope).
- By level: UG 40, PG 21, Diploma 7, Postgraduate Diploma 1.
- By `intl_status`: **all 69 rows `open_to_international`** -- every row is sourced directly from the
  university's own international-fee table, so no row is `unknown`, `not_open` or
  `aggregator_only_unconfirmed`.
- **Already on site:** 0 (new university, batch 3).
- **Distinct GAP parent canonical courses: 16** --
  `bachelor-business-administration`, `bachelor-computer-applications`,
  `be-btech-bioinformatics-engineering`, `bsc-data-science`, `diploma-chemical-engineering`,
  `diploma-civil-engineering`, `diploma-computer-engineering`, `diploma-electrical-engineering`,
  `diploma-information-technology`, `diploma-mechanical-engineering`, `gnm-nursing-midwifery`,
  `integrated-llb`, `mca`, `me-mtech-computer-science-engineering`, `mpharm`,
  `pgd-medical-laboratory-technology`.

## Notable mapping decisions / flags for the packaging pass

- **"Computer Engineering" vs "Computer Science and Engineering"** are two distinct rows on the fee
  sheet with identical duration/fee; both are provisionally mapped to
  `be-btech-computer-science-engineering`. Confirm on the official programme page (not found this pass)
  whether "Computer Engineering" is a materially different curriculum before publishing both under the
  same canonical course.
- **AI/ML and AI/Data-Science specialisation tracks** inside CSE, ECE and Mechanical B.Tech branches
  were mapped to the cross-cutting `be-btech-artificial-intelligence-machine-learning` /
  `be-btech-data-science` canonical families rather than left under their parent engineering branch,
  since the taxonomy already treats AI/ML and Data Science as their own programme families. Flag for
  taxonomy review if the reviewer prefers keeping them under the parent branch with a specialisation
  note instead.
- **MBA - I - Analytics**: the fee-flyer text is truncated/ambiguous (likely "MBA International -
  Analytics"); mapped to `mba-business-analytics` but the exact official title must be confirmed on a
  programme page before packaging.
- **BA (English / Psychology / Sociology / Political Science)**: the flyer lists this as a single row.
  It was **split into 4 separate CSV rows** (one per named major) on the assumption these are distinct
  at-admission major choices, consistent with how Indian BA (Hons) programmes are typically structured.
  This assumption is **not verified against a programme/admission page** in this pass -- if majors are
  actually chosen post-admission (liberal-arts model), these should instead be recorded as
  `major_within` rows under one parent BA degree per runbook §1b, not packaged as four separate offerings.
- **Regulated/medical-adjacent programmes** (BSc Nursing, GNM, B Pharm/M Pharm, B/M Physiotherapy) need
  their INC/PCI/regulator registration caveats added at packaging time; the international-admissions
  page did not surface programme-specific regulator caveats beyond the generic FAQ.
- No programme on the flyer was found to require a `not_open` or `unknown` status; foreign-national
  admission at Marwadi appears to be a blanket international-fee-sheet policy rather than a
  programme-by-programme allow/deny list, which is itself recorded here as the intl_status evidence
  basis (per runbook §1b, "fall back to a university-wide policy when no per-programme list exists, and
  say so in notes" -- here the fee sheet **is** the per-programme list, so evidence is per-row, not a
  university-wide fallback).

## Unreachable / not attempted this pass

- Individual programme detail pages (duration/eligibility/curriculum text) were not crawled
  page-by-page; the sitemaps did not expose a flat, curl-readable programme directory (see Sources #3).
- Study in India, AICTE facilities dashboard, NIRF 2025 data file: not queried (no NIRF rank found for
  Marwadi in the batch-3 shortlist screen; not re-checked here).
- Aggregator missed-programme checklist pass: not run (fee flyer already provides full, dated coverage).

## Phase D packaging and fix (2026-09-21)

Migration `0109-india-marwadi-university` packages **56** offerings; holds and reasons are in
`content-migrations/0109-india-marwadi-university/README.md`. The BA (English / Psychology / Sociology /
Political Science) assumption above was checked against the programme pages: BA English is its own
programme, while Sociology, Psychology and Political Science form one multidisciplinary BA that every student
takes in full. That BA is packaged as one offering mapped to the new canonical `ba-general-arts`, and the three
CSV rows now point to it.
