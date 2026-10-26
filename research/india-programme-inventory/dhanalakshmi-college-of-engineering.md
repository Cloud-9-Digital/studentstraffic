# Dhanalakshmi College of Engineering, Manimangalam (Chennai) -- Programme Inventory

Tamil Nadu colleges batch 1 (`claude-tn-colleges-batch1-20261026`), owner `claude-tn-dhanalakshmi-coe-20261026`,
checked 2026-10-26. Offline research only; no database connection. Packaged in
`content-migrations/0358-india-dhanalakshmi-college-of-engineering/`. Build script:
`research-drafts/india/dhanalakshmi-college-of-engineering-build.py`. Saved sources and text/OCR:
`research/india-source-bundles/dhanalakshmi-college-of-engineering/`.

## Identity

- Official name **Dhanalakshmi College of Engineering** (AICTE 2026-27: "DHANALAKSHMI COLLEGE OF ENGINEERING";
  TNEA 2026: "Dhanalakshmi College of Engineering (Autonomous), Manimangalam, Chennai 601301"; Anna University CAI:
  same). Short form DCE / DCE Chennai. Slug `dhanalakshmi-college-of-engineering`.
- Address: Dr V P R Nagar, Manimangalam (Manimangalam Puducheri Road, Manimangalam Post), Tambaram, Chennai 601301;
  Sriperumbudur taluk, Kancheepuram district.
- Run by the **Dhanalakshmi Educational Trust** (registered 1998; founder and managing trustee Dr V P Ramamurthi).
  Private self-financing; non-minority; co-educational.
- Established **2001** (AICTE 2026-27 EoA, AISHE 2024-25, college "2001-2002"). Anna University's affiliation
  disclosure prints 2000; conflict recorded in evidence.
- AICTE permanent ID **1-4064279**; EoA 2026-27 F.No. Southern/1-46260325361/2026/EOA dated 13-Apr-2026.
- **Autonomous college affiliated to Anna University, Chennai**, which awards the degrees. UGC autonomous list
  (Tamil Nadu S.No 1041): autonomy 2025-26 to 2034-35. UGC 2(f) and 12(B) included (letter 8-578/2017 (CPP-I/C),
  19-09-2023). Because DCE is autonomous, its own 2026-27 calendar is used (first-year classes 1 Sept 2026), not
  Anna University's non-autonomous calendar.
- Anna University college code **4107** (CAI Kancheepuram district list, S.No 9); TNEA code **1405**.
- NAAC **A**, CGPA 3.19, Cycle 2, certificate 12 July 2024 (EC(SC)/207/2nd Cycle/TNCOGN100453), valid to 11 July 2029.
- NBA: none (TNEA 2026 marks every branch "No"; AISHE 2024-25 NBA column "No").
- AISHE code C-16567.

### How DCE differs from DSCET and the Dhanalakshmi Srinivasan group

| | Dhanalakshmi College of Engineering (this record) | Dhanalakshmi Srinivasan College of Engineering and Technology (DSCET, published 0148) |
|---|---|---|
| Location | Manimangalam, near Tambaram, Kancheepuram district | East Coast Road, Poonjeri near Mamallapuram, Chengalpattu district |
| TNEA code | 1405 | 1322 (off-campus Tiruppur 2323) |
| Anna University code | 4107 (Kancheepuram list) | 3105 (Chengalpattu list) |
| AICTE permanent ID | 1-4064279 | different (see 0148) |
| Promoter | Dhanalakshmi Educational Trust (Dr V P Ramamurthi) | Dhanalakshmi Srinivasan group |

Also separate: Dhanalakshmi Srinivasan Engineering College, Perambalur (TNEA 3805), Dhanalakshmi Srinivasan College
of Engineering, Coimbatore (TNEA 2743), Dhanalakshmi Srinivasan University (Samayapuram, 0279), DSIRT (0290) and DSISR
(held). Ledger alias check 2026-10-26: no row for Dhanalakshmi College of Engineering, DCE Chennai or Manimangalam;
the only Dhanalakshmi rows are the four Dhanalakshmi Srinivasan identities above.

## Sources used

1. AICTE EoA 2026-27, published by the college: https://dce.edu.in/wp-content/uploads/2026/05/EOA-Report-26-27.pdf
   (computer-generated, text layer; 7 UG + 3 M.E. courses, Anna University affiliating body, NRI and International
   Students approval No for all). The 2026-27 AICTE check is therefore **done** from AICTE's own letter; the AICTE
   dashboard itself was not queried.
2. UGC autonomous colleges list (cached copies in `skasc-20261025/` and `dg-vaishnav-college/`).
3. Anna University CAI district lists (Kancheepuram, Chengalpattu) and Anna University affiliation mandatory
   disclosure for code 4107 (generated 31-01-2025; course table, sanctioned intakes and students on roll).
4. NAAC certificate (scanned, visually confirmed).
5. AISHE 2024-25 data capture format C-16567 (programmes, "offered in an Indian language: No", hostels, area 13.28 acres).
6. DoTE TNEA 2026: Information Brochure, Tentative Schedule, Information about colleges p.77 (cached in
   `psg-college-of-technology/tnea-colleges2026.txt`), General Academic Vacancy after Round 1 (excerpt
   `tnea-vacancy-r1-1405.txt`: AD, AM, CS, EC, EE, IT, ME, SC).
7. DCE academic calendars 2026-27: I-year I-semester (scanned; OCR + visual check: classes and bridge course from
   Tue 1 Sept 2026; II semester reopens 1 Feb 2027) and odd semester II-IV years (text layer).
8. DCE pages: home, about, academic, programmes offered, admissions 2026 (eligibility, channels, FAQ), life at DCE,
   administration (committees), mandatory disclosures, department pages, gallery, llms.txt.

Not available:
- **No tuition published anywhere official.** Admissions FAQ: fee details "communicated by the Admissions Office".
  No fee in the AU disclosure, AICTE EoA, AISHE or any page. All fees `on_request`; TNEA-listed admission,
  establishment, hostel, mess and transport charges are in the notes. No aggregator or secondary figure used.
- Academic regulations (2023/2024/2025) links on the academic page are placeholders (`href="#"`), so credits,
  assessment weights and a medium-of-instruction clause are not published. Medium "English" rests on AISHE 2024-25
  (no programme offered in an Indian language) - grade B evidence.
- dce.edu.in `wp-content/uploads` PDFs and images return HTTP 403 to curl; they were read through WebFetch.

## Counts

- Rows: 11. Packaged 8 (all B.E./B.Tech). Held 3 (M.E. Computer Science and Engineering, M.E. Embedded System
  Technologies, M.E. CAD/CAM).
- Held reason: AICTE 2026-27 approves 9 seats each and the college lists them, but Anna University's disclosure shows
  0-1 students on roll in each M.E. programme across five years, AICTE flags CAD/CAM intake as reduced for <=30%
  admissions over 5 years, and no 2026-27 M.E. admission notice, TANCA/CEETA-PG 2026 entry or M.E. first-year
  calendar was found. Same rule as 0115/0119/0356.
- No MBA/MCA: not in AICTE 2026-27 approval.
- `intl_status`: all `not_open` (AICTE 2026-27 NRI and International Students approval No; TNEA admits Indian
  nationals and Tamil Nadu-native OCI/PIO card holders only).
- `GAP:` rows: none. AI & DS -> `be-btech-data-science`; CSE (AI & ML) -> `be-btech-artificial-intelligence-machine-learning`;
  CSE (Cyber Security) -> `be-btech-cyber-security`. No new canonical course; records copied byte-identical
  (0357, 0356, 0339).
- Title note: the AI & ML department page heading says "B.Tech. - Artificial Intelligence and Machine Learning";
  AICTE, TNEA and Anna University use B.E. Computer Science and Engineering (Artificial Intelligence and Machine
  Learning), which is used.

## Packaging decision

All 8 programmes `availability: "restricted"`, fee `on_request` (no audience field: the schema's on_request
variant carries none and no amount is published), English medium, intake month September (DCE's own autonomous
2026-27 calendar). Aggregators were not used for any claim.

## Fee pass 2026-10-26

Correction bundle `0386-india-dhanalakshmi-college-of-engineering-fees` supersedes 0358 and adds indicative Grade C
`reportedFeeQuote`s of INR 50,000 a year from GetMyUni
(https://getmyuni.com/college/dhanalakshmi-college-of-engineering-dce-chennai-courses-fees: "tuition fees for B.E ... INR
50,000 per annum"; BE Mechanical, CSE, IT, ECE, EEE at INR 2,00,000 for 4 years) for CSE, IT, ECE, EEE and Mechanical.
Corroborated by Campusoption (INR 50,000 a year for Computer, Electrical, IT, Electronics) and a Collegedunia snippet
(B.E./B.Tech INR 2,20,000 total). Matches the Tamil Nadu fee committee government-quota band.

Still without a fee (no consistent branch figure):
- **B.Tech AI & Data Science:** CollegeBatch INR 1,92,000 a year; Collegedunia "Top Courses" widget INR 1,05,000 first year.
- **B.E. CSE (AI & ML):** only CollegeBatch, INR 1,92,000 a year.
- **B.E. CSE (Cyber Security):** only CollegeBatch, INR 87,000 a year.
CollegeBatch (2571) was rejected throughout: its course table (INR 1,92,000 a year) contradicts its own summary
(INR 87,000 a year). Collegedunia course pages return 401. No official tuition exists (see original research above).
