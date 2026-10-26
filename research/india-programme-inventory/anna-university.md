# Anna University - programme inventory (2026-27)

- Slug: `anna-university`; official name: Anna University, Sardar Patel Road, Guindy, Chennai 600025.
- UGC: State University, 1978 (UGC consolidated list of universities).
- Bundle: `content-migrations/0149-india-anna-university` (built by `research-drafts/india/anna-university-build.mjs`).
- Checked: 2026-10-23. Owner: claude-tn-anna-university-cloud-20261023.

## Scope and merged units

Merged into one page (scope CSV rows 99-102 and 2049-2060), all confirmed as Anna University units on
https://www.annauniv.edu/constituent_colleges.php and in the TNEA 2026 "Constituent Colleges" list:

- University Departments, Chennai: CEG (TNEA 1), ACT (2), SAP (3), MIT Chromepet (4).
- Regional campuses: Coimbatore (2025), Tirunelveli (4020), Madurai (5010).
- University Colleges of Engineering: Villupuram (1013), Tindivanam (1014), Arni (1015), Kancheepuram (1026),
  BIT Campus Tiruchirappalli (3011), Ariyalur (3016), Thirukkuvalai (3018), Panruti (3019), Pattukkottai (3021),
  Nagercoil (4023), University V.O.C. College of Engineering Thoothukudi (4024), Ramanathapuram (5017), Dindigul (5022).
- Thirukkuvalai and Dindigul are not named in the scope row but are constituent colleges on both lists; the scope row
  "University College of Engineering (row 2049)" is not separately identifiable and is covered by this set.
- Affiliated colleges excluded.

## Counts

| | Rows |
|---|---:|
| Inventory rows | 248 |
| Packaged | 218 (120 global, 98 restricted) |
| UG packaged | 136 (34 Chennai global, 16 BIT global, 86 other constituent/regional restricted) |
| PG packaged | 82 (M.E./M.Tech./M.Arch./M.Plan. 64; MBA/MCA 10; M.Sc. 2-year 6; M.Sc. 5-year integrated 2) |
| Held | 25 Tamil-medium B.E. Civil/Mechanical rows (23) and B.Arch. (2) |
| Not packaged (out of scope) | part-time B.E., B.Voc., ODL/online MBA/MCA/M.Sc., consortium seats, Ph.D./M.S. by research |

## Holds

1. Tamil-medium B.E. Civil Engineering / Mechanical Engineering (TNEA XC/XM), 23 rows: the teaching language is
   Tamil, but `tamil` is not in `teachingLanguageCodes` (`lib/catalogue-facets.ts`). Packaging needs that facet
   added first (outside this worker's allowed files).
2. B.Arch. at SAP (TNEA codes AR and BA, 40 seats each): COA approved-institution list could not be checked;
   coa.gov.in failed TLS through the session proxy (incomplete chain; intermediate repository blocked). The brief gates
   B.Arch. on COA.

## Routes and sources

- TNEA 2026 (Indian B.E./B.Tech./B.Plan.): brochure, schedule, college booklet, Round 1 vacancy list (static.tneaonline.org).
- FN/(LDC/SIDS), NRI, CIWGC: Centre for Admissions 2026-27 instructions (cfa.annauniv.edu/cfa/pdf/*_2026.pdf).
  UG USD 7,500 (CSE/ECE/IT/VLSI at CEG; CSE/ECE/IT/AI&DS at MIT) or USD 3,750 a year; PG USD 2,000; M.Sc. 5-year USD 5,000.
  UG route covers CEG, ACT, MIT, SAP and UCE BIT Campus; PG route covers CEG, ACT, MIT, SAP only; MBA/MCA/M.Sc. CEG only.
- CEETA-PG / CEAP 2026: programme list, intakes and yearly fees per campus (CEAP_BOOKLET_INFORMATION_2026.pdf).
- TANCET 2026 and DoTE MBA/MCA 2026-27 booklet: MBA/MCA at CEG, Coimbatore, BIT, Nagercoil, Madurai.
- Domestic UG fees: CEG/ACT/MIT/SAP 2025-26 fee structures (latest published on annauniv.edu).
- Calendars: cac.annauniv.edu University Departments calendars (UG & PG classes 24 Aug 2026; PG 9 Jul 2026; MBA/MCA 2 Sep 2026).

## Unreachable / not used

- NAAC (naac.gov.in) connection reset; NIRF (nirfindia.org) and NBA (nbaind.org) returned HTTP 403; AICTE dashboard TLS failure;
  COA TLS failure. No NAAC grade, NIRF rank, NBA or COA badge is claimed.
- cfa.annauniv.edu, tancet.annauniv.edu and cac.annauniv.edu serve an incomplete certificate chain; fetched with the
  proxy CA bundle plus Sectigo's published intermediate (verification kept on).
- Constituent-college tuition is not published (TNEA booklet lists deposits and hostel charges only): fee `on_request`.

## Fee pass 2026-10-26

Correction bundle `content-migrations/0368-india-anna-university-fees` (supersedes 0149). All 109 on-request fees
filled as confirmed domestic annual tuition (2025-26); no programme remains on request.

- 108 constituent-college / regional-campus programmes: Anna University Registrar circular 102/Misc/PD4/2023-2
  (14 June 2023, constituent colleges fee revision, from 2023-24), re-hosted at
  https://www.annaunivtut.in/doc/FEES%20structure-2023.pdf, corroborated by the BIT Campus "College Fees Structure 2025"
  (https://aubit.edu.in/wp-content/uploads/2025/07/College-Fees-Structure-2025.pdf). Tuition per semester: B.E./B.Tech.
  INR 6,000; MBA INR 15,000; MCA INR 9,000. Both scanned PDFs were read visually (no text layer).
- CEG MCA (Evening, self-supporting): CEG M.B.A./M.C.A. admission circular and fee structure 2025-26
  (ceg.annauniv.edu/files/dean/), tuition INR 21,500 a semester for general candidates.
- Not used: the 2014 CPDE self-supporting circular (too old); Careers360/Collegedunia/GetMyUni figures (discovery only).
- No 2026-27 constituent-college fee table was found; the 2026-27 odd-semester circular (No. 5/AU/eGov-UCE, 17 June 2026)
  gives payment dates only.
- Bundle 0368 also normalises `intakeMonths` to bare month labels (validator rule for bundles >= 0154); timing text was
  already in each `deadlinesNote`.
