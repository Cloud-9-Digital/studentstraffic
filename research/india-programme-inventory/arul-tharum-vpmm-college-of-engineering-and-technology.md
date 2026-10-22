# Arul Tharum VPMM College of Engineering and Technology -- Programme Inventory

India batch 5 (`claude-india-batch5-20261022`), owner `claude-india-vpmm-20261022`, checked 2026-10-22.
Offline research only; no database connection. Packaged in
`content-migrations/0119-india-arul-tharum-vpmm-college-of-engineering-and-technology/`.

## Identity

- Requested as "V.P. Muthaiya Pillai Meenatchi Ammal Engineering College, Srivilliputhur". This is ONE
  institution. Its current official name is **Arul Tharum VPMM College of Engineering and Technology**
  (short form VPMM). It was formerly **V.P. Muthaiah Pillai Meenakshi Ammal Engineering College for
  Women** (Anna University's Virudhunagar list and its 2022-23 affiliation letter print "Formerly V.P.
  Muthaiah Pillai Meenakshi Ammal Engineering College for Women").
- Address: V.P.M. Nagar, Krishnankoil (AICTE spells it Krishnankovil), Srivilliputtur taluk, Virudhunagar
  district, Tamil Nadu. AICTE's PIN is 626190; the college site uses 626126.
- Established 2002 (AICTE EoA). Private, self-financing. The trust named by AICTE is the **V.P. Muthaiah
  Pillai Meenakshi Ammal Trust**, 40 North Car Street, Srivilliputtur 626125. The college's own site
  calls it the "VPMM Educational Trust", founder and chairman Dr. V.P.M. Sankar.
- **Not part of the Kalasalingam group.** Kalasalingam Academy of Research and Education is a separate
  deemed university in Krishnankoil with its own AICTE record (1-46215297252, Deemed to be
  University (Pvt)). The VPMM group is a separate group run by the V.P.M.M. trust.
- **No longer a women-only college.** AICTE's 2026-27 approved-institutes list shows the Women flag as
  `N` (66 of the 67 Tamil Nadu institutions with "WOMEN" in their AICTE name carry `Y`). The 2026-27 mandatory
  disclosure lists a boys' hostel and a girls' hostel on campus, and the faculty lists include men.
- Affiliated, non-autonomous college of **Anna University, Chennai**, which awards the degrees.
  Anna University CAI Virudhunagar list: exam code **9535**, TNEA code **4979**.
- AICTE permanent ID **1-8897103**; 2026-27 application ID 1-46268701029; 2025-26 EoA
  F.No. Southern/1-44643474407/2025/EOA (20 March 2025).
- Official website: https://engineering.vpmm.in/ (group site https://vpmm.in). vpmmecw.com and
  vpmminstitutions.com do not resolve.
- Ledger alias check: no existing row for VPMM, V.P. Muthaiah Pillai, Meenakshi Ammal, Arul Tharum or
  Krishnankoil other than Kalasalingam (a different institution).

## Sources used (all reachable 2026-10-22)

1. AICTE approved-institutes dashboard, 2026-27 (regulator's own list), via its JSON endpoints:
   `php/approvedinstituteserver.php` (institution row, Women `N`, Minority `N`) and
   `php/approvedcourse.php?aicteid=1-46268701029&year=2026-2027` (8 courses: 6 UG, 2 PG).
2. AICTE NRI/PIO/OCI approved list 2026-27 (`php/nripiofcinstitute.php?q=2026-2027&q1=NRI`):
   no VPMM row among 965 Tamil Nadu rows.
3. AICTE EoA 2025-26 letter, published by the college: https://engineering.vpmm.in/EOAReport2025-26.PDF
   (FN/Gulf/OCI and NRI approval "No" for all 12 courses then approved).
4. VPMM Mandatory Disclosure 2026-27: https://engineering.vpmm.in/disclosure2627.pdf (courses and
   intake, fee, admission procedure and dates, infrastructure, hostels, library, committees).
5. Anna University provisional-affiliation letter 2022-23 (scanned, OCR):
   https://engineering.vpmm.in/content/PDF/ANNA%20UNIVERSITY.pdf
6. Anna University CAI Virudhunagar district list: https://www.annauniv.edu/cai/District%20wise/district/Virudhunagar.php
7. VPMM faculty profile for Anna University CAI, September 2026:
   https://engineering.vpmm.in/content/PDF/FACULTY%20DETAILS%20AU-CAI-SEP2026%20.pdf
8. VPMM committee list 2026-27: https://engineering.vpmm.in/committe2627.pdf
9. DoTE TNEA 2026: Information Brochure, Tentative Schedule and General Academic Vacancy after Round 1
   (static.tneaonline.org). The vacancy list shows college 4979 with branches AD, CE, CS, EC, EE, IT.
10. Anna University academic calendar, non-autonomous affiliated colleges, I semester Sep-Dec 2026
    (classes from 2 September 2026) and Academic Regulations 2025 (English medium, 4-year B.E./B.Tech).
11. College pages: home, about, courses offered, management, hostel, library, scholarships, placement
    training, six UG and two M.E. department pages, apply.

Aggregator checklist (not cited): Careers360 and Shiksha list M.E. Power Electronics and Drives and
M.E. VLSI Design (both discontinued per AICTE 2026-27). No aggregator-only programme was packaged.

Unreachable or not available:
- No 2026-27 AICTE EoA letter is published by the college (EOAReport2026-27 404s); the AICTE dashboard
  2026-27 course list is used instead.
- VPMM (4979) has no entry in TNEA's 2026 "Information about colleges" booklet, so no TNEA hostel, mess
  or transport charges exist for it.
- No current (2026-27) Anna University-issued affiliation list or CAI application form for VPMM.
- No hostel or mess fee is published by the college.
- Principal conflict: the 2026-27 disclosure names Dr. S. Sivakumar; the AU-CAI September 2026 faculty
  list names Dr. Ramasubramanian Perumal. Not used in public copy.
- Library conflict: the website says over 35,000 books; the 2026-27 disclosure lists 24,331 books in
  6,620 titles. The disclosure figure is used.

## Counts

- Rows: 13. 6 current UG, 2 current M.E., 4 discontinued (2 UG, 2 M.E.), 1 not offered (M.E.
  Structural, website text only).
- Packaged: 6 (all B.E./B.Tech on AICTE 2026-27 and in TNEA 2026 under code 4979).
- Held: 2 M.E. (CSE, ECE). AICTE 2026-27 approves intake 12 each and the college lists them, but no
  current Anna University-issued affiliation evidence exists (latest letter 2022-23), Anna University's
  CEAP 2026 booklet covers only government, aided and university colleges, and the disclosure reports
  no enrolment. Follows the 0115 precedent of holding M.E. rows without current affiliation proof.
- `intl_status`: all 13 rows `not_open` (no NRI/foreign seats in AICTE 2025-26 or 2026-27 lists;
  TNEA admits Indian nationals and Tamil Nadu-native OCI/PIO card holders only).
- `GAP:` rows: none. AI & DS maps to `be-btech-data-science` (0114, 0115, 0117 precedent); IT maps to
  `be-btech-information-technology`.

## Packaging decision

Packaged with `audienceEligibility.availability = "restricted"`, as in 0114/0115, because no row is
`open_to_international`. Fees use the 2026-27 mandatory disclosure (INR 50,000 a year government quota,
INR 85,000 a year management quota) as `confirmed`, INR, 2026-27.

Material caveat carried into public copy: the 2026-27 disclosure records 66 (2023-24) and 37 (2024-25)
management-quota admissions and states that "all the enrolled students were transferred to other
colleges via Anna University compliance"; it reports no enrolment or placement data for the last three
years.
