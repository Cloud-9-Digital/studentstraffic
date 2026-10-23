# University of Madras - research notes (2026-10-23)

Owner `claude-tn-madras-cloud-20261023`. Bundle `0150-india-university-of-madras`, built by
`research-drafts/india/university-of-madras-build.mjs`. Inventory:
`research/india-programme-inventory/university-of-madras.{csv,md}`.

## Access

- `www.unom.ac.in`, `unom.ac.in` (both 218.248.44.203 via web.unom.ac.in): TLS reset or upstream
  timeout on https and http, with -m 60/90 and retries; WebFetch 503. `egovernance.unom.ac.in`
  (218.248.44.212) and `exam.unom.ac.in` respond. Every University document used came from egovernance.
- The PG prospectus link is revealed by an ASP.NET postback (`__EVENTTARGET=AOpenProcs`) on
  https://egovernance.unom.ac.in/CBCS2627/ ; the B.Sc. one by `AOpenProcsBsc`; instructions by `AInst`.
- naac.gov.in, ncte.gov.in, tndce.tn.gov.in, tn.gov.in: unreachable. nirfindia.org: 403. archive.org: 429.

## Facts used (all from the 2026-27 prospectus unless noted)

- Incorporated 5 September 1857 by an Act of the Legislative Council of India; Madras University Act 1923.
- 18 schools, 87 departments, 128/138 affiliated colleges (prospectus gives both numbers), six campuses.
- Prospectus also states NAAC A++ (CGPA 3.59, August 2023, cycle IV) and NIRF 2025 University 38 /
  Overall 68. NIRF 2026 data: NAAC valid 21-08-2023 to 20-08-2030, CGPA 3.59. Not used as badges:
  regulator lists unreachable.
- PG applications 25.04.2026-01.06.2026; INR 354 per application; 15% supernumerary seats for foreign
  nationals incl. NRIs; foreign nationals exempt from entrance; MBA/MCA via DoTE single window.
- Credits: PG 2-year 91; MBA 94; LL.M. 102; PG 3-year 135; PG Diploma 36; Diploma 18; Certificate 9.
- Semesters: odd July-November, even December-April.
- B.Sc. (Blended): applications 04.05.2026-19.06.2026; entrance 29.06.2026-03.07.2026; 143 credits.
- Entrance schedule 2026-27: 69 programme rows, tests 08/06/2026-18/06/2026.
- NIRF 2026 data: PG 2-year sanctioned intake 1,565 (2024-25); 3,060 PG 2-year students incl. 356 from
  outside the state and 6 from outside India; 2024-25 graduates 1,359, placed 516, median INR 5,95,000,
  higher studies 318; Ph.D. 1,653 full-time, 646 part-time.
- TN MBA/MCA 2026-27 booklet, code 710: MBA 45 aided (1955), MBA 50 self-supporting (2004), MCA 30
  aided (1987); hostel deposit 7,000, room rent 2,460, mess 30,000 per annum; admission fees 28,181.

## Fee tables (INR, 2026-27; Indian I/II year totals; foreign I/II year totals; tuition in brackets)

| Group | Indian | Foreign |
|---|---|---|
| Humanities/Social Sciences/Languages regular (incl. LL.M., M.Com. IB&F, Journalism, Public Administration TM & EM) | 6,101 / 4,761 (1,650) | 87,500 / 58,500 (40,000) |
| M.A. Ancient History and Archaeology, M.A. HRM (regular) | 8,301 / 6,961 (1,650) | 1,07,500 / 78,500 (40,000) |
| M.A. Bharathanatyam (SS) | 31,711 / 30,276 (17,250) | 1,87,200 / 1,58,200 (1,50,000) |
| M.A. Yoga, M.Com. Business Data Science (SS) | 56,196 / 53,306 (32,200) | not published |
| LL.M. (SS) | 22,031 / 20,681 (17,250) | not published |
| M.A. English, M.A. HRM (SS) | 28,801 / 27,366 (23,000) | 2,69,150 / 2,38,500 (2,00,000) |
| M.A. Ancient History (SS); M.S.W. (SS); M.A. Defence (SS) | 42,701/41,266 (39,100); 56,401/54,966 (50,600); 26,516/25,166 (23,000) + field work 22,000/yr | not published |
| Sciences regular (M.Sc. list incl. Criminology, Cyber Forensics, Psychology, M.Lib.I.Sc.) | 8,431 / 7,006 (1,650) | 1,48,700 / 1,18,950 (80,000) |
| M.Sc. Anatomy/Medical Microbiology/Physiology (3 yr) | 10,461 / 8,956 (3,300) | 1,72,150 / 1,40,150 / 1,40,150 (80,000) |
| M.Sc. Applied Geography, Geology, Applied Geology (regular) | 10,631 / 9,206 (1,650) | 1,68,750 / 1,38,950 (80,000) |
| M.Sc. Yoga | 13,381 / 11,956 (5,500) | not published |
| M.Tech. Geoinformatics | 30,026 / 28,601 (15,400) | not published |
| M.Sc. Counselling Psychology (SS) | 39,186 / 37,751 (28,750) | not published |
| M.Sc. Actuarial Science (SS) | 47,236 / 45,801 (34,500) | 1,61,200 / 1,31,450 (90,000) |
| M.Sc. Mathematics (SS) | 17,626 / 16,191 (10,350) | 1,61,200 / 1,31,450 (90,000) |
| M.Sc. HRD Psychology (SS) | 31,711 / 30,276 (17,250) | 2,73,700 / 2,43,900 (1,50,000) |
| M.Sc. Biotechnology/Medical Biochemistry/Medical Microbiology/Nanoscience/Biochemistry (SS) | 42,636 / 41,201 (17,250) | Biotechnology 3,78,700 / 3,48,950 (1,50,000); Medical Biochemistry NRI 3,57,200 / 3,46,950 (3,00,000) |
| M.Sc. Neuroscience, M.Sc. Information Technology (SS) | 31,181 / 29,746 (16,100) | Neuroscience 5,52,150 / 5,21,650 (5,00,000) |
| M.Sc. Geology, Applied Geology (SS) | 56,836 / 55,401 (17,250) | not published |
| M.Sc. Cyber Forensics (SS) | 62,571 / 61,056 (57,500) | not published |
| M.Sc. Computer Science (SS) | 29,411 / 27,976 (17,250) | 2,58,600 / 2,44,500 (1,50,000) |
| MBA / MCA / M.Ed. (regular) | 28,181/25,301 (15,400); 25,101/21,341 (12,100); 9,401/8,061 (1,650) | 2,23,250/1,80,250; 2,25,250/1,74,250; 1,17,500/88,850 |
| MBA / Executive MBA / M.Ed. (SS) | 56,196/53,306 (32,200); 1,03,946/1,01,056 (64,400); 23,996/22,646 (13,800) | MBA and EMBA 4,97,250/4,54,250 (2,80,000); M.Ed. 1,87,500/1,58,500 |
| B.Sc. (Blended) | 49,531 / 48,326 / 48,326 (20,000) - one table for all students | - |

Note: the prospectus prints the MBA and MCA regular columns in the order MCA / MBA / M.Ed. in the
heading but the tuition row reads 12,100 / 15,400; check which is which before packaging either.

## Holds

See the inventory `.md`. Main block: teaching language unpublished in reachable official sources.
