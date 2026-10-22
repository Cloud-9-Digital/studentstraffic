# Nellai College of Engineering -- Programme Inventory

India batch 4 (`claude-india-batch4-20261022`), owner `claude-india-nce-20261022`, checked 2026-10-22.
Packaged in `content-migrations/0114-india-nellai-college-of-engineering/`.

## Identity and disambiguation

- **Nellai College of Engineering (NCE)**, Maruthakulam P.O., Nanguneri taluk, Tirunelveli district,
  Tamil Nadu 627151. Established 2000 as **National College of Engineering**; AICTE's dashboard shows the
  name changing to "College of Engineering Maruthakulam" (2019-20) and "Nellai College of Engineering"
  (2022-23 onward). AICTE permanent ID **1-4378723** is constant across all names.
- Promoted by **Manarul Huda Trust**, Thiruvananthapuram, Kerala (reg. No.46/2000/mht/15.11.2000).
  Self-financing, Muslim minority (AICTE dashboard minority flag `Y`), not autonomous.
- **Affiliated college, not a university.** Degrees are awarded by **Anna University, Chennai**
  (Region IV Tirunelveli list: examination code **9518**, TNEA counselling code **4961**).
- **Similarly named institution -- not this college:** *Nellai Nadar College of Engineering and
  Technology*, 33 Gandhi Road, Nedungundram, Chennai (AICTE permanent ID 1-483503761). Different city,
  trust and ID. Also distinct from the government *Government College of Engineering, Tirunelveli*
  (AU code 9508) and from *National Engineering College, Kovilpatti*.

## Sources used

1. **NCE Mandatory Disclosure 2026-27** (`https://nce.ac.in/wp-content/uploads/2026/10/Website-Mandatory-Disclosure-2026-27.pdf`,
   38 pages, pdftotext + tesseract OCR of image pages 29-38). Contains the programme table
   (AY 2025-29), fee statement, trust/governing-council details and the full AICTE Extension of
   Approval 2026-27 letter (F.No. Southern/1-46225914737/2026/EOA, 16-Mar-2026) with course-wise
   intake and International/NRI approval status (both `No` for every course). Image pages reproduce the
   TNEA eligibility, reservation, fee-concession schemes and admission-document list.
2. **AICTE approved-institutions dashboard** (regulator's own list,
   `https://facilities.aicte-india.org/dashboard/pages/angulardashboard.php#!/approved`, queried via its
   JSON endpoints `php/approvedinstituteserver.php` and `php/approvedcourse.php`): 2026-27 course list for
   application 1-46225914737 (7 UG courses, total intake 330); historical years 2012-13, 2016-17,
   2019-20, 2022-23 used to identify discontinued programmes.
3. **Anna University CAI, Tirunelveli district affiliated-colleges list**
   (`https://www.annauniv.edu/cai/District%20wise/district/Thirunelveli.php`) -- NCE row 5, codes 9518/4961.
4. **Official site nce.ac.in** -- home, about-us, departments, each department page, facilities,
   contact, latest news; Anna University Regulations 2021 PDF hosted on the Mechanical page.
5. **Anna University CAC academic schedule, Semester I, Aug-Dec 2025** (non-autonomous affiliated
   institutions; digitally signed by the Director, CAC), copy hosted by Government College of
   Engineering, Dharmapuri (`https://gcedpi.edu.in/sites/gcedpi.edu.in/files/I%20sem%20UG%20academic%20schedule.pdf`).
6. **DOTE Tamil Nadu fee-fixation committee page** (`https://dte.tn.gov.in/fee-fixation-committee`).
7. **Tirunelveli district administration, How to Reach** (`https://tirunelveli.nic.in/how-to-reach/`).
8. Aggregators (Collegedunia) used only as a missed-programme checklist; nothing cited.

## Unreachable / not verifiable

- TNEA 2026 brochure, schedule and Round 1 vacancy list are on `static.tneaonline.org` (found via the
  sibling 0115 bundle; all load HTTP 200). The vacancy list shows college 4961 with all 7 branches.
- No per-college fee amount is published by NCE, DOTE or the fee committee page -> fee status `on_request`.
- UGC 2(f)/12(B): NCE's disclosure says 2(f) included (F.No.8-82/2013(CPP-I/C), 21-08-2013) and 12(B)
  not included. Not found on a UGC-hosted list in this pass -> not used as a badge.
- NBA/NAAC: the disclosure lists none; none claimed.
- The NCE "Committees" page returns 404; anti-ragging committee details not published.

## Counts

- Rows: **11** -- 7 current UG programmes (AICTE 2026-27) + 4 discontinued (1 UG, 3 PG).
- By `intl_status`: `open_to_international` 0, `not_open` 11, `unknown` 0.
  All 7 current programmes have AICTE International Students approval **No** and NRI approval **No**.
- **Packaged: 7 of 7 current programmes** as `audienceEligibility.availability = "restricted"` (corrected 2026-10-22 from `local-only`):
  TNEA admits Indian nationals under nativity rules plus OCI/PIO card holders who are Tamil Nadu natives
  (TNEA 2026 Information Brochure, static.tneaonline.org). NCE publishes no management-quota route.
  Intake corrected to September (Anna University 2026-27 calendar: classes from 2 September 2026). Rationale: the runbook states audience
  eligibility is programme data, not a publication gate, and that local-only programmes may be
  published with the restriction displayed prominently. Packaging only `open_to_international` rows
  would leave a valid AICTE-approved college with zero programmes.
- Not packaged: 4 discontinued programmes (B.Tech IT; M.E. Applied Electronics; M.E. CSE;
  M.E. Control and Instrumentation) -- no current AICTE approval.
- Doctoral/research: no Ph.D. or Anna University research-centre listing found for NCE; none inventoried.
- No MBA/MCA/diploma: AICTE 2026-27 lists only the 7 UG engineering courses.

## GAP resolution

- No `GAP:` rows remain. B.Tech. Artificial Intelligence & Data Science maps to the existing parent
  `be-btech-data-science`, matching the published Marwadi 0109 mapping and the batch-4 Sardar Raja
  College of Engineering bundle for the identical Anna University degree (that course record already
  covers AI specialisation depth). A separate `be-btech-artificial-intelligence-data-science`
  canonical was drafted and then withdrawn in this batch to avoid diverging from the sibling worker;
  if the taxonomy owners later want a dedicated AI & DS canonical, remap all AI & DS offerings in one
  correction batch.
- B.E. CSE (Cyber Security) -> existing `be-btech-cyber-security` (official title retained).

## Conflicts recorded

- Civil Engineering start year: disclosure 2012, department page 2013.
- CSE sanctioned strength: home-page blurb 60, department page and AICTE 90.
- EEE page claims an M.E. Control and Instrumentation since 2010; AICTE stops listing it after 2016-17.
- Principal's message lists 5 UG courses; AICTE 2026-27 lists 7 (AI & DS and CSE Cyber Security added 2024).
