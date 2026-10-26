# Tagore Engineering College -- Programme Inventory

Batch `claude-tn-colleges-batch1-20261026`, owner `claude-tn-tagore-20261026`, checked 2026-10-26.
Offline research only; no database connection. Packaged in
`content-migrations/0359-india-tagore-engineering-college/` (build script
`research-drafts/india/tagore-engineering-college-build.py`). Source copies in
`research/india-source-bundles/tagore-engineering-college/`.

## Identity

- Official name **Tagore Engineering College** (short form TEC), Rathinamangalam, Vandalur-Kelambakkam Main Road,
  Chennai 600127 (AICTE address: Rathinamangalam, Vandalur, Chennai 600048, Kanchipuram district). Vandalur taluk,
  **Chengalpattu district** (TNEA 2026 and MBA/MCA 2026-27 booklets). Established 1998. Private, self-financing.
  Trust: **Tagore Educational Trust**, 25 Mahalingam Street, Mahalingapuram, Chennai 600034 (chairperson Prof. Dr. M. Mala).
- **Affiliated to Anna University, Chennai, non-autonomous.** TNEA 2026 and MBA/MCA 2026-27 booklets give autonomous
  status No; the UGC autonomous-colleges list (saved copy 2026-10-25, `research/india-source-bundles/skasc-20261025/ugc-autonomous-text.txt`)
  has no entry for it. Anna University's non-autonomous affiliated-college calendar therefore applies: I-semester
  B.E./B.Tech and MBA (FT) classes start 2 September 2026, end-semester exams from 22 December 2026.
- **Anna University CAI Chengalpattu district list**: examination code **4127**, TNEA code **1420**.
- **AICTE** permanent ID **1-9722913**, Private-Self Financing, Southern region. Latest letter read: EoA 2025-26,
  F.No. Southern/1-44643134823/2025/EOA, 3 January 2025 (also EoA 2024-25, 19 May 2024).
- **NBA** (letters F.No. 33-239/2010/NBA, 5 November 2024, OCR of college-hosted scan): B.E. CSE, B.E. ECE, B.Tech IT
  (Tier II) and MBA accredited for AY 2024-25 to 2026-27, valid to 30 June 2027. Confirmed by TNEA 2026 and MBA/MCA booklets.
- **NAAC**: no current grade. The college's About page still cites 2009 accreditation; not used.
- NIRF 2026: data submitted (IR-E-C-16541, IR-M-C-16541); no rank claimed.
- Not to be confused with Tagore Medical College, Tagore Dental College (same trust group, separate institutions) or
  Tagore Institute of Engineering and Technology, Attur, Salem (TNEA 2646).
- Ledger alias check (2026-10-26): no row for Tagore, Rathinamangalam, Vandalur (other than Crescent) or 1-9722913.
- Official website: https://tagore-engg.ac.in/

## Sources used

1. TEC Mandatory Disclosure 2026-27: https://tagore-engg.ac.in/pdf/MANDATORY%20DISCLOSURE%202026-2027%20(1)_removed.pdf
   (programmes, sanctioned intake 2023-24 to 2026-27, State Fee Committee fee table labelled "for the Academic year 2025-26
   student's admission", hostel estimate, enrolment 2023-24 to 2025-26, committees, infrastructure, library).
2. AICTE EoA 2025-26 and 2024-25 (college-hosted): https://tagore-engg.ac.in/pdf/AICTE%20-%20EOA%20Report%202025-2026.PDF,
   https://tagore-engg.ac.in/pdf/EOA.pdf (2024-25, OCR).
3. Anna University CAI Chengalpattu list: https://www.annauniv.edu/cai/District%20wise/district/Chengalpattu.php
4. TEC faculty statement for Anna University affiliation AY 2026-27 (lists B.E. Aero, CSE, CSE Cyber Security, ECE, Mech,
   M.E. CSE, M.E. Environmental, MBA departments).
5. NBA letters 2024 (college-hosted scan, OCR): https://tagore-engg.ac.in/pdf/NBA.pdf
6. DoTE TNEA 2026: Information Brochure, Information about colleges (TEC entry p.88), Tentative Schedule, General Academic
   Vacancy after Round 1 (1420: AD, AE, CS, EC, IT, ME, SC).
7. DoTE MBA/MCA 2026-27 college booklet (TEC p.69: MBA intake 60, since 2002, NBA to 2027; room 37,000, electricity 11,000, mess 47,000).
8. Anna University calendar, non-autonomous affiliated colleges, I semester Sep-Dec 2026; Academic Regulations 2025 (UG/PG).
9. TEC NIRF 2026 Engineering and Management data PDFs.
10. TEC pages: home, about, admission, UG/PG listing, department pages, hostel, AICTE and mandatory disclosure pages.

Aggregators were not used.

## Unreachable or unavailable

- **AICTE dashboard (facilities.aicte-india.org) unreachable** on 2026-10-26 (connection failed, HTTP 000). TEC has not
  published a 2026-27 EoA. UG and MBA packaged on AICTE EoA 2025-26 + TNEA 2026 booklet and Round 1 vacancy list +
  MBA/MCA 2026-27 booklet + the 2026-27 disclosure, as 0356/0357 did. **2026-27 AICTE check pending.**
- tanca.annauniv.edu and tancet.annauniv.edu timed out; TANCET 2026 MBA eligibility and test date carried from the brochure
  as read for 0148 (checkedAt 2026-10-23).
- Fee year: the 2026-27 disclosure labels its fee table for 2025-26 admissions; payload uses `academicYear: "2025-26"`
  and the notes ask readers to confirm 2026-27.
- Intake conflict: AICTE 2025-26 lists IT 60; 2026-27 disclosure and TNEA 2026 list IT 120 for 2026-27 (TNEA used).
- TNEA booklet hostel amounts (mess 3,500, room 2,833, electricity 750 "per annum") look monthly; not used publicly.
  MBA/MCA booklet and the disclosure's INR 85,000 estimate are used and attributed.
- TNEA gives ECE and IT start year 1996; disclosure says 1998. No start year is stated publicly for those branches.

## Counts

- Inventory rows: 13. Packaged 8 (7 B.E./B.Tech + MBA), all `availability: "restricted"`, fees `confirmed` INR,
  `fee.audience: "domestic"`:
  - B.E./B.Tech GQ INR 50,000/yr (Aero, AI&DS, Cyber Security, Mech) or INR 55,000/yr (NBA-accredited CSE, ECE, IT);
    MQ INR 85,000 / 87,000 in notes.
  - MBA GQ INR 35,000/yr; MQ INR 41,000 in notes.
- Held 2: M.E. Computer Science and Engineering and M.E. Environmental Engineering (18 each; fee INR 50,000). Blocker: no
  readable 2026-27 AICTE approval and no 2026-27 state PG counselling record. Supporting evidence for release: 2026-27
  disclosure sanctioned intake, AU affiliation 2026-27 faculty statement, NIRF PG enrolment (31). Canonical matches if
  released: me-mtech-computer-science-engineering, me-mtech-environmental-engineering.
- Not offered: B.E. Civil and B.E. EEE (legacy department pages only). Ph.D. not packaged.

## Taxonomy

No new canonical course. All 8 course records copied byte-identical from the latest bundle shipping each slug
(Aeronautical -> be-btech-aerospace-engineering and AI&DS -> be-btech-data-science, as in 0148/0149/0115).
