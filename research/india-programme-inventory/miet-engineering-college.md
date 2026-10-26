# M.I.E.T. Engineering College, Tiruchirappalli -- Programme Inventory

Tamil Nadu colleges batch 1 (`claude-tn-colleges-batch1-20261026`), owner `claude-tn-miet-20261026`,
checked 2026-10-26. Offline research only; no database connection. Packaged in
`content-migrations/0356-india-miet-engineering-college/`. Build script:
`research-drafts/india/miet-engineering-college-build.py`. Saved sources and OCR text:
`research/india-source-bundles/miet-engineering-college/`.

## Identity

- Official name **M.I.E.T. Engineering College** (AICTE: "M.I.E.T. ENGINEERING COLLEGE"; TNEA 2026:
  "M I E T Engineering College (Autonomous)"; Anna University CAI: "M.I.E.T Engineering College").
  Short form MIET. Slug `miet-engineering-college`.
- Address: Trichy - Pudukkottai Road, Gundur, Tiruchirappalli 620007 (Tiruverumbur taluk, near the airport).
- Run by the **Mohamed Institute of Education and Technology (MIET) Society** (society founded 1984 by
  Er. A. Mohamed Yunus). Private self-financing; Muslim minority institution; co-educational.
- Established 1998 (college site, TN MBA/MCA 2026-27 booklet, first branches started 1998). AICTE's
  2025-26 EoA prints 1997 (file 730-52-300(E) ET/97). 1998 used; conflict recorded in evidence.
- AICTE permanent ID **1-7532291**; 2025-26 EoA F.No. Southern/1-44642899536/2025/EOA (03-Jan-2025).
- **Autonomous college affiliated to Anna University, Chennai**, which approves and awards the degrees.
  UGC conferment F.2-10/2023(AC-Policy), November 2023, for 2024-25 to 2033-34 (UGC autonomous list
  row 1107); Anna University CAC order 4022/AU/CAC/Autonomous/2023-24 dated 09.02.2024. Permanent
  affiliation for B.E. Mechanical from 2020-21 (AU letter 052/CAI/Permanent Affin./2020-21/8124).
  Because MIET is autonomous, the brief's "non-autonomous" wording from 0115/0119 was adapted: MIET
  sets its own Regulations 2024 curricula and exams and runs its own academic calendar.
- Anna University code **8124**; TNEA code **3811**.
- NAAC **A+**, CGPA 3.33, Cycle 1, certificate 15 Feb 2022, valid to 14 Feb 2027 (scanned certificate
  hosted by the college, visually confirmed).
- NBA: B.E. Civil Tier II, AY 2024-25 to 2026-27 (to 30-06-2027) - current. B.E. ECE to 30-06-2026
  (after appeal) - lapsed. B.E. CSE, EEE, Mechanical to 30-06-2025 - lapsed. TNEA 2026 booklet still
  shows ECE "valid upto 2026".
- Group institutions excluded: M.I.E.T. Arts & Science College, M.I.E.T. Polytechnic College.
- Name clash: **Mahath Amma Institute of Engineering and Technology (MIET)**, Illupur, Pudukkottai,
  TNEA 3854, is a different college (covered in FAQ). MIET Jammu / MIET Meerut are unrelated.
- Ledger alias check (2026-10-26): no row for MIET, M.I.E.T., Mohamed Institute, Gundur or Mahath Amma.

## Sources used

1. AICTE EoA 2025-26 published by the college: https://www.miet.edu/pdf3/2025-2026_AICTE.pdf
   (13 courses, Anna University affiliating body, NRI and FN/Gulf/OCI approval No for all).
2. UGC autonomy letter (scanned, OCR) https://www.miet.edu/pdf2/AUTONOMOUS-UGCConferment.pdf and the
   UGC autonomous colleges list (cached copy in `skasc-20261025/ugc-autonomous-text.txt`).
3. Anna University autonomy order and permanent-affiliation letter (scanned, OCR), CAI Tiruchirappalli
   district list https://www.annauniv.edu/cai/District%20wise/district/Tiruchirappalli.php.
4. NAAC certificate, NBA letters (Civil 08-04-2024, ECE 07-05-2024, CSE/EEE/Mech 14-06-2022).
5. DoTE TNEA 2026: Information Brochure, Tentative Schedule, Information about colleges (p.283, cached
   in `psg-college-of-technology/tnea-colleges2026.txt`), General Academic Vacancy after Round 1
   (3811: AD, BM, CE, CS, EC, EE, IT, ME).
6. DTE Tamil Nadu MBA/MCA 2026-27: engineering colleges booklet (p.162, MBA intake 60, started 2009)
   and MBA information and instructions.
7. MIET academic calendar 2026-2027 (scanned, OCR): programmes Civil, CSE, Mech, EEE, ECE, BME, AI&DS,
   IT, MBA; I-year inaugural 19 Aug 2026; I-year classes from 24 Aug 2026.
8. MIET B.E./B.Tech and MBA Regulations 2024 (English medium; 165-175 credits; college exams; Anna
   University approves the degree).
9. MIET pages: home, about, courses offered, eligibility, fees structure, hostel, library, placements,
   photo gallery; Mandatory Disclosure 2024-25 (no fee table).

Unreachable or not available:
- **AICTE dashboard and aicte-india.org reset the connection** (curl and WebFetch, 2026-10-26), so the
  AICTE 2026-27 approved-course list and the NRI/PIO/OCI list could not be read. The college publishes
  no 2026-27 EoA or 2025-26/2026-27 mandatory disclosure. 2026-27 seat evidence for the packaged
  programmes is the DoTE TNEA 2026 booklet and Round 1 vacancy list (B.E./B.Tech) and the DTE MBA/MCA
  2026-27 booklet (MBA), plus the AICTE 2025-26 EoA. **Re-check the AICTE 2026-27 list before publishing.**
- No official tuition amount: the fee page says only "As Prescribed by Government of Tamil Nadu"; the
  TNEA and MBA booklets print no tuition; DTE's fee-fixation page shows only proposal formats. All fees
  are `on_request`; TNEA/DTE-listed hostel, mess, admission and transport charges are in the notes.
- www.miet.edu returns HTTP 406 to plain curl; pages and PDFs were read through WebFetch.

## Counts

- Rows: 14. Packaged 9 (8 B.E./B.Tech, 1 MBA). Held 5 (M.E. Structural, Manufacturing, Power
  Electronics and Drives, VLSI Design, CSE).
- Held reason: AICTE approved them for 2025-26 and the courses page lists them, but the AICTE 2026-27
  list was unreachable, MIET's 2026-27 calendar names only the eight UG branches and the MBA, and no
  2026 M.E. admission notice or state PG counselling entry was found.
- `intl_status`: all `not_open` (AICTE 2025-26: NRI and FN/Gulf/OCI approval No; TNEA and state MBA
  counselling admit Indian nationals and Tamil Nadu-native OCI/PIO card holders only).
- `GAP:` rows: none. AI & DS maps to `be-btech-data-science`; IT to `be-btech-information-technology`;
  held M.E. specialisations map to their parent M.E./M.Tech canonical courses. No new canonical course.
  Course records copied byte-identical from 0339 (and 0333 for biomedical).

## Packaging decision

All 9 programmes `availability: "restricted"`, fee `on_request`, English medium (Regulations 2024),
intake month August (MIET's own 2026-27 calendar; Anna University's 2 September date applies only to
non-autonomous colleges). Aggregators were not used for any claim.

## Fee pass 2026-10-26

Correction bundle `0383-india-miet-engineering-college-fees` supersedes 0356 and adds indicative Grade C
`reportedFeeQuote`s from CollegeBatch (https://www.collegebatch.com/3917-miet-engineering-college-fees-structure-courses-trichy):
B.E. Civil, Mechanical, EEE, ECE and CSE at INR 55,000 a year; B.Tech IT and AI & Data Science at INR 50,000 a year
(listing titled 2026, quota unstated). The 55,000/50,000 split matches the Tamil Nadu fee committee's government-quota bands.

Still without a fee:
- **B.E. Biomedical Engineering:** CollegeBatch shows no figure; GetMyCollege (INR 1.6L, no period) and TargetAdmission
  (generic B.E. INR 2L over 4 years) are not branch-specific enough.
- **MBA:** sources conflict and were rejected: CollegeBatch INR 17,500 a year (35,000 total, implausibly low),
  TargetAdmission INR 30K for 2 years, Campusoption INR 3 lakh total, GetMyCollege INR 1.2L.

Searched: miet.edu fees-structure page and fn.html (2024-25 foreign-national tuition USD 1,200 a year for B.E./B.Tech and
USD 1,300 for M.E./MBA; not used as an international-only past-year fee), Mandatory Disclosure 2024-25, TNEA 2026 booklet,
DTE fee-fixation-committee page, Campusoption (INR 87,000-1,42,000 a year, rejected as conflicting and likely management
quota), CollegeBatch, GetMyCollege, TargetAdmission, collegeandfees.com (no figure); Collegedunia (401), Careers360 (404),
Admistay (404).
