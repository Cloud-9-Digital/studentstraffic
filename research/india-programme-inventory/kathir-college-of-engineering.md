# Kathir College of Engineering -- Programme Inventory

Batch `claude-tn-colleges-batch1-20261026`, owner `claude-tn-kathir-20261026`, checked 2026-10-26.
Offline research only; no database connection. Packaged in
`content-migrations/0357-india-kathir-college-of-engineering/` (build script
`research-drafts/india/kathir-college-of-engineering-build.py`).

## Identity

- Official name **Kathir College of Engineering** (short form KCE), "Wisdom Tree", Avinashi Road, Neelambur,
  Sulur taluk, Coimbatore district, Tamil Nadu 641062. Established 2008. Private, self-financing.
  Trust: **Lamika Educational and Charitable Trust**, 806 Avinashi Road, Neelambur. Group name "Kathir Institutions"
  (chairman E.S. Kathir).
- **Affiliated to Anna University, Chennai**, which awards the degrees. **Autonomous**: UGC's autonomous-colleges
  list gives autonomy under Anna University from 2024-25, period 2024-25 to 2033-34 (copy saved 2026-10-25 at
  `research/india-source-bundles/skasc-20261025/ugc-autonomous-text.txt`). The college has its own Regulation 2024
  curricula and a Controller of Examinations that recommends graduates to Anna University for the degree.
  This differs from the 0115/0119 references (non-autonomous); the Anna University non-autonomous academic calendar
  (classes from 2 September 2026) therefore does **not** apply, and KCE has not published its 2026-27 first-year
  start date (its 2026-27 odd-semester calendar covers II-IV years only, reopening 7 December 2026 for the even semester).
- **Anna University CAI Coimbatore district list**: examination code **7116**, TNEA counselling code **2745**
  (the CAI page does not print "(Autonomous)" after KCE's name, but DoTE's TNEA 2026 and MBA/MCA 2026-27 booklets
  both list "Kathir College of Engineering (Autonomous)" with autonomous status Yes).
- **AICTE** permanent ID **1-2389972**, Private-Self Financing, Southern region. Latest letter read: EoA 2025-26,
  F.No. Southern/1-44639335976/2025/EOA, 10 April 2025.
- **NAAC** A+, CGPA 3.49, 2nd cycle, certificate dated 28 February 2023, valid to 27 February 2028
  (EC(SC)/146/2nd Cycle/TNCOGN24510).
- **NBA**: none. TNEA 2026 booklet marks all seven branches "No". The college's NBA page hosts "DCS" files
  (data-capture/SAR material), not accreditation letters.
- NIRF 2026: data submitted (IR-E-C-36988); no rank claimed.
- Ledger alias check (2026-10-26): no row for Kathir, KCE, Neelambur, Lamika or 1-2389972. Distinct from
  Coimbatore Institute of Technology (claimed by claude-tn-cit-20261025) and other Coimbatore rows.
- Official website: https://kathir.ac.in/

## Sources used

1. KCE Mandatory Disclosure 2026-27 (as on 28.02.2026): https://kathir.ac.in/wp-content/uploads/2026/02/Mandatory-Disclosure-KCE-26-27.pdf
   (programmes and 2025-26 intakes, admitted numbers 2022-23 to 2025-26, **fee table approved by the State Fee Committee**,
   scholarships and waivers, admission procedure, infrastructure, library, faculty, committees).
2. AICTE EoA 2025-26 (and 2024-25 corrigendum), published by the college: https://kathir.ac.in/wp-content/uploads/2026/02/AICTE_2025_26.pdf
3. Anna University CAI Coimbatore district list: https://www.annauniv.edu/cai/District%20wise/district/Coimbatore.php
4. UGC autonomous colleges list: https://www.ugc.gov.in/colleges/Autonomous_Colleges_list (saved copy, 2026-10-25).
5. NAAC certificate (college-hosted): https://kathir.ac.in/wp-content/uploads/2026/02/Naac_Certificate_2023.pdf
6. DoTE TNEA 2026: Information Brochure, Information about colleges (KCE entry p.235-236: branches, approved intakes,
   NBA No, hostel and transport charges), Tentative Schedule, General Academic Vacancy after Round 1 (2745: AD, AM, CO, CS, EC, EE, ME).
7. DoTE MBA/MCA Admissions 2026-27 college booklet: https://static.tn-mbamca.com/docs/TNMBAMCA-ENGINEERING-COLLEGES-BOOKLET-2026.pdf
   (KCE 2745: MBA intake 60, since 2009; room rent 45,000, mess 35,000, deposit 5,000, admission fee 5,000).
8. KCE NIRF 2026 Engineering data: https://kathir.ac.in/wp-content/uploads/2026/nirf/Kce_2026_Engineering.pdf
9. KCE pages: home, about, admission eligibility, curriculum and syllabi (R2024 UG and PG), department pages, MBA,
   four M.E. pages, hostel, placement, grievance/ICC, academic calendar 2026-27 (odd).

Aggregators were not used.

## Unreachable or unavailable

- **AICTE dashboard (facilities.aicte-india.org) unreachable** from this environment on 2026-10-26: every HTTPS
  attempt (curl, sandboxed and unsandboxed, and WebFetch) ended in a TLS connection reset; port 80 refused. The
  2026-27 approved-course list and NRI/PIO/OCI lists could not be read. KCE has not published an EoA 2026-27
  (AICTE_2026_27.pdf 404; media library has letters up to 2025-26).
  - UG and MBA were packaged on the strength of DoTE's 2026 counselling booklets (approved intakes for 2026-27
    entry), the AICTE 2025-26 EoA and the 2026-27 mandatory disclosure. Public copy says "AICTE approved ... latest
    published EoA 2025-26" and does not claim a 2026-27 AICTE letter.
- tancet.annauniv.edu timed out; TANCET 2026 MBA eligibility and test date (9 May 2026) are carried from the brochure
  as read for bundle 0148 on 2026-10-23 (evidence marks checkedAt 2026-10-23).
- No 2026-27 first-year start date published by KCE.
- Data conflict: TNEA 2026 booklet lists mess bill INR 3,500 per annum (likely a monthly figure); the MBA/MCA booklet lists
  INR 35,000. Only the MBA/MCA figure is used publicly. Room rent also differs (TNEA 40,000 men / 30,000 women; MBA/MCA 45,000);
  both are attributed to their booklet.
- Placement claims on the college site (highest 6 LPA on the placement page vs about 12 LPA in the disclosure, 90-95%) conflict;
  only NIRF 2026 figures are used.

## Counts

- Inventory rows: 14. 7 UG + 1 MBA packaged; 4 M.E. held; 1 M.E. discontinued (Communication Systems, closure applied
  2025-26); Ph.D. not packaged (NIRF: 0 Ph.D. students).
- Packaged: 8, all `availability: "restricted"`, all fees `confirmed` INR, `fee.audience: "domestic"`:
  - B.E./B.Tech: GQ INR 50,000/yr for all; MQ INR 85,000 (AI&DS, CSE, CSE AI&ML, CCE, ECE) or INR 50,000 (EEE, Mech) in notes.
  - MBA: INR 60,000/yr GQ and MQ.
- Held: M.E. CSE, M.E. Manufacturing Engineering, M.E. Power Electronics and Drives, M.E. VLSI Design and Embedded Systems
  (intake 6 each in AICTE 2025-26; fee INR 50,000/yr). Blocker: no readable 2026-27 AICTE approval and no 2026-27 PG
  counselling record. Canonical matches if released: me-mtech-computer-science-engineering, me-mtech-mechanical-engineering,
  me-mtech-electrical-engineering, me-mtech-electronics-communication-engineering (same mappings as 0148/0149).

## Taxonomy

No new canonical course. `be-btech-computer-communication-engineering` is not in `lib/data/program-taxonomy.ts` but is
shipped by 0207/0339; the record was copied byte-identical from the latest bundle that ships it (0339). All other course
records were copied from the latest bundle shipping each slug.
