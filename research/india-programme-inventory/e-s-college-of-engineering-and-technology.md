# E.S. College of Engineering and Technology, Villupuram -- Programme Inventory

Tamil Nadu colleges batch 2 (`claude-tn-colleges-batch2-20261026`), owner `claude-tn-es-college-20261026`, checked
2026-10-26. Offline research only; no database connection. Packaged in
`content-migrations/0396-india-e-s-college-of-engineering-and-technology/` (build script
`research-drafts/india/e-s-college-of-engineering-and-technology-build.py`). Source copies in
`research/india-source-bundles/e-s-college-of-engineering-and-technology/`.

## Identity

- Official name **E.S. College of Engineering and Technology** (AICTE: "E.S.COLLEGE OF ENGINEERING AND TECHNOLOGY";
  TNEA 2026: "E. S. College of Engineering and Technology"). Short form ESCET (college site). Also called "ES Engineering
  College" / "E.S. Engineering College" on aggregators. Formerly **Quannta School of Software Engineering** (Anna
  University CAI list). Slug `e-s-college-of-engineering-and-technology`.
- Address: No 3/249, E.S. Nagar, NH-45, Chennai Trunk Road, Ayyankoilpattu, Villupuram 605602 (AICTE; college pages and
  TNEA body use 605601); Vikkiravandi taluk, Viluppuram district.
- Trust: **E.S.S.M. Educational and Charitable Trust**, Regd. 115/1998 of 14-09-1998; chairman Er. S. Selvamani; founder
  chairman E. Swamikannu. Principal Dr K. Indira. Private self-financing, non-minority, co-educational.
- Established **2007** (AICTE EoA; CS and EC start year 2007 in TNEA 2026).
- **AICTE permanent ID 1-3858465**. Latest letter read: EoA 2025-26, F.No. Southern/1-44642585660/2025/EOA, 10 April 2025
  (also EoA 2024-25, F.No. Southern/1-43659370118/2024/EOA, 23 March 2024).
- **Non-autonomous college affiliated to Anna University, Chennai**, which awards the degrees. TNEA 2026 booklet: autonomous
  No, minority No; not on the UGC autonomous list (copy saved 2026-10-25 in `skasc-20261025/`). Anna University's
  non-autonomous calendar applies: I-semester classes from 2 September 2026, end-semester exams from 22 December 2026.
- **Anna University CAI Villupuram district list**: S.No 8, college code **4210**, TNEA code **1428**.
- **TNEA code 1428** (Information about colleges 2026, p.95).
- NAAC: none. NBA: none (mandatory disclosure "NIL, Not Applied"; TNEA marks every branch NBA No). NIRF: no data found.
- Ledger alias check (2026-10-26): no row for ESCET, Quannta, Ayyankoilpattu, E.S. group or AICTE 1-3858465. Other
  Villupuram rows (Arignar Anna Government Arts College Villupuram, St Joseph University, Annamalai Villupuram extension)
  are distinct institutions.

## Sources used

1. AICTE EoA 2025-26 and 2024-25, published by the college: https://escet.in/pdf/escet-eoa-25-26.PDF,
   https://escet.in/pdf/escet-eoa-24-25.PDF (text layer; 7 UG courses under Anna University; NRI and FN/Gulf/OCI No for
   CSE and IT, NA for others).
2. Anna University CAI Villupuram list: https://www.annauniv.edu/cai/District%20wise/district/Villlupuram.php (sic, three
   l's). The college's PDF link is `#`; the older `/cai/PDF/Villupuram/e.s.pdf` returns 404.
3. DoTE TNEA 2026 Information about colleges (`tnea-info-colleges-2026.pdf`, 460 pp., p.95), Information Brochure,
   Tentative Schedule, General Academic Vacancy after Round 1 (cached at `tagore-engineering-college/tnea-vacancy-r1.txt`).
4. Anna University calendar for non-autonomous affiliated colleges, I semester Sep-Dec 2026 (cached
   `tagore-engineering-college/au-cal.txt`); Academic Regulations 2025 (UG).
5. ESCET pages: home, about, courses offered, admission procedure, scholarship, facilities (library), mandatory disclosure
   (headed 2025-26), institution-industry cell, department pages, gallery, principal and chairman messages.

## Unreachable or unavailable

- **AICTE dashboard (facilities.aicte-india.org) unreachable** on 2026-10-26 (HTTPS connection reset, port 80 refused;
  WebFetch ECONNRESET). ESCET publishes EoA letters only to 2025-26 (`/pdf/escet-eoa-26-27.PDF` 404). The four packaged
  programmes therefore rest on AICTE EoA 2025-26 + TNEA 2026 seat matrix and Round 1 vacancy list (DoTE only lists
  AICTE-approved, Anna University-affiliated seats) + Anna University CAI listing, as 0359 did. **2026-27 AICTE check
  pending.**
- No current Anna University affiliation PDF for code 4210 is reachable; affiliation for 2026-27 is inferred from the CAI
  listing and TNEA 2026 participation.
- No brochure or prospectus PDF on escet.in.

## Counts

- Inventory rows: 7. Packaged 4 B.E./B.Tech, all `availability: "restricted"`, fees `on_request`:
  - B.Tech AI and Data Science (AD, 60, since 2023), B.E. CSE (CS, 120, since 2007), B.E. ECE (EC, 60, since 2007),
    B.Tech IT (IT, 120, since 2023).
- Held 3: B.E. Civil (30), B.E. EEE (30), B.E. Mechanical (60). AICTE-approved for 2025-26 and still listed on the college
  site, but absent from the TNEA 2026 college booklet and Round 1 vacancy list for 1428, so there is no evidence they admit
  in 2026-27 or remain in the current Anna University seat matrix. Release only with a 2026-27 AICTE approval plus a
  2026-27 admission record. Canonical matches if released: be-btech-civil-engineering,
  be-btech-electrical-electronics-engineering, be-btech-mechanical-engineering.
- No PG, MBA or MCA (none in AICTE 2025-26; ESCET absent from the Tamil Nadu MBA/MCA 2026-27 booklet). Ph.D. none.
- `intl_status`: all `not_open`.
- Intake note: the college's courses page still shows CSE 60 and IT 60 (2024-25 levels); AICTE 2025-26, the disclosure and
  TNEA 2026 give 120 each (TNEA used).

## Taxonomy

No new canonical course. All 4 course records copied byte-identical from the latest bundle shipping each slug (AI&DS ->
`be-btech-data-science`, as in 0114-0117, 0358, 0359).

## Fees

No official tuition: the mandatory disclosure says only "Fee - As per Government Norms"; no fee on any ESCET page, AICTE
letter or DoTE document. TNEA 2026 lists other charges (admission 1,000; establishment 2,000; caution deposit 5,000; room
6,000, electricity 6,000 and mess 60,800 a year; transport 12,000-30,000 a year), used in fee notes.

Fee pass rule (tamil-nadu-fee-pass-brief section 3) applied at packaging time: Grade C figures **rejected as conflicting**,
so no `reportedFeeQuote`:
- Collegedunia: first-year INR 50,000 (CSE) and 55,000 (IT, AI&DS) in a search snippet; B.E. total INR 2.2 lakh on one
  page and INR 3.48 lakh on another; course pages return 401.
- Campusoption: INR 2.2 lakh "Total Fees (Approx)" for every branch; a second Campusoption "ESEC" page says GQ INR 40,000 /
  MQ INR 70,000 a year.
- Shiksha: INR 1.2-2 lakh total (pages 403). Careers360: no fee figures. Zollege: INR 5.68 lakh (AI&DS) and 7.68 lakh
  (Mechanical) totals, implausible for the fee-committee band.
- The recurring INR 2.2 lakh equals the disclosure's average placement salary (INR 2.2 L), a likely data mix-up.

## Media

`research/media-enrichment/india-tn-colleges-e-s-college-of-engineering-and-technology.json`: logo `ready`
(https://escet.in/img/logo/logo.png, 631x150); cover `hold` (only exterior photo is inside the composite
`about_img_03.png`; gallery is 2012 event photos of identifiable people; other images are stock). Not uploaded.
