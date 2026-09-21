# MAHE (Manipal Academy of Higher Education) -- Programme Inventory

Research pass only. No payload/ledger/DB/docs edits were made from this file.

## Sources used

1. **Official site -- manipal.edu sitemap.xml** (`https://www.manipal.edu/sitemap.xml`, fetched 2026-09-21): 421 `program-list` URLs across all constituent institutes (Manipal, Mangalore, Bengaluru, Jamshedpur campuses). This is the primary source for the CSV -- every row's `official_source_url` is a distinct programme page on manipal.edu (or tapmi.edu.in for the TAPMI MBA). Reachable.
2. **International admissions eligibility page** -- `https://www.manipal.edu/mu/admission/international-students/who-can-apply.html`. Reachable. Confirms MAHE runs a single, institution-wide international/NRI/foreign-national admission route (not a per-programme allow-list): UG via 10+2/A-Levels/IB/equivalent boards, PG via a recognised bachelor's degree, with AIU equivalency certificates where needed. Carve-outs found: MBBS/BDS/MD/MS/DM/MCh admissions run through NEET + DGHS/MCC/KEA/JCECEB counselling; B.Arch requires NATA; there are **no NRI-sponsored seats** for B.Arch. No programme was found to be closed to international applicants outright, so `intl_status = open_to_international` was applied uniformly with this page as evidence, and the NEET/DGHS caveat is flagged in `notes` for medical/dental rows.
3. **`programs-list.html` / `streams-programs.html`** -- both reachable but render their actual catalogue client-side (AJAX search widget); no static per-programme list could be scraped from them. Used only for the institute/faculty/stream taxonomy narrative ("300+ programmes ... 11+9+11 streams across 3 faculties"), which corroborates the sitemap-derived count.
4. **Study in India (studyinindia.gov.in)** -- not queried in this pass (time-boxed); flagged as a follow-up source, not yet cross-checked.
5. **AICTE facilities dashboard / NIRF data PDF** -- not queried in this pass; MAHE's approved-intake figures per AICTE and its NIRF data file were not fetched. Follow-up.
6. **Aggregators (Shiksha/Collegedunia/Careers360)** -- one WebSearch pass only, used to corroborate the "300+ programmes, 195 UG / 151 PG" scale claim from collegedekho/shiksha summaries; no aggregator-only programme titles were copied into the CSV (none stood out beyond what the sitemap already covers).
7. **Existing bundle payload** -- `content-migrations/0091-india-manipal-academy-of-higher-education/payload.json` read for the 5 already-published offerings and their `officialProgramUrl` (used to match `already_on_site` by exact URL, not fuzzy title matching).

## Methodology / limitations (read before using the CSV for planning)

MAHE runs ~30 constituent institutes/departments across 5 campuses with 300+ live programmes. Given the scale, rows in `manipal-academy-of-higher-education.csv` were built by **enumerating every `program-list` URL in the official sitemap** and deriving `programme_official_title`, `level`, `campus` and `discipline` (institute) from the URL slug and path -- not by individually fetching and reading all 358 programme pages for duration/fee/eligibility text. Every row's `official_source_url` is a real, working manipal.edu programme page; **duration is marked "unknown (see official source)"** rather than guessed, and should be confirmed from that URL before being used to seed content. Titles are Title-Cased from the URL slug and may not exactly match the page's on-page heading (e.g. "BTECH Computer Science Engineering" vs the page's "B.Tech in Computer Science & Engineering") -- treat the CSV title as a locator, not a publishable string.

Pure PhD / integrated-PhD pathway pages (5 found: Integrated PhD, MD/MS-PhD dual programmes, PhD pathway pages) were excluded per the task's PhD exclusion rule. Lateral-entry-only pages were not separately flagged (MAHE's sitemap did not surface a distinct lateral-entry URL pattern the way KIIT's catalogue did).

## Counts

- **Total programmes catalogued (excl. PhD): 358**
- By level: PG 176, UG 131, Certificate 43, Diploma 7, Integrated 1
- By `intl_status`: all 358 rows are `open_to_international` (institution-wide route; see Sources #2). None were found `not_open`; none marked `unknown`.
- **Already on site: 5** -- B.Tech CSE (Manipal), B.Tech Mechanical (Manipal), TAPMI MBA (Core), B.PT (Manipal), BA Media & Communication (Manipal) -- matched by exact `officialProgramUrl` against the published bundle.
- **Missing (open-to-international, not on site): 353**
- **GAP canonical courses (no fitting entry in the 51-slug canonical catalogue): 266** rows tagged `GAP:<slug>`; 92 rows matched an existing canonical course slug.

## Top GAP themes (recurring programme families with no canonical course yet)

- **Allied health / diagnostic technology** (School of Allied Health Sciences, Manipal + KMC Mangalore): Medical Radiology & Imaging Technology (B.Sc/M.Sc, x3 variants), Dialysis Therapy Technology (x3), Respiratory Technology, Radiation Therapy Technology, Physician Associate Studies, Anaesthesia & OT Technology, Advanced Care Paramedic, Cardiac Cath Intervention Technology, Echocardiography, Prosthetics & Orthotics -- a dense cluster of allied-health UG/PG programmes with no canonical-course equivalent at all today.
- **Super-specialty medicine**: MD (Doctor of Medicine) and MS (Master of Surgery) specialisations at KMC Manipal/Mangalore -- dozens of named specialisations, none canonicalised.
- **M.Tech engineering specialisations** at MIT Manipal/Bengaluru (e.g. Mechanical -- Applied CFD, and many others) -- only the generic B.E./B.Tech canonical slugs exist; no M.Tech canonical slugs at all.
- **Design/fashion/hospitality PG** and **library & information science**, **forensic science**, **sports management** -- each a single well-defined programme with no canonical match.

## Unreachable / not attempted this pass

- Study in India portal, AICTE facilities dashboard, NIRF data PDF for MAHE: not queried (flagged for a follow-up pass).
- Individual duration/eligibility text for the 358 rows was not fetched page-by-page (see Methodology).
