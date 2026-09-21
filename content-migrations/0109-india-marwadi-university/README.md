# 0109-india-marwadi-university

India batch 3, Phase D packaging (`india-batch-3`). Packager: `claude-india-batch3-20260921`, 2026-09-21.
Status: validated offline (`npm run content:validate -- --id 0109-india-marwadi-university`), ledger `validated`.
It has not been applied.

## Coverage

- Inventory `research/india-programme-inventory/marwadi-university.csv`: 69 rows, all `open_to_international`.
- Packaged: **56 programmes** (55 at first; the combined BA was added on 2026-09-21, see below). Fees are `confirmed` in USD from the 2026-27 international fee sheet. The tuition figure is the
  "without hostel" rate, and the "with hostel" package is in the fee notes.
- Held: **11 rows** (below). The three BA Psychology / Sociology / Political Science rows are now one packaged offering.
- Courses: 41 records (40 plus `ba-general-arts`). The 13 new batch-3 courses are copied verbatim from `research/india-batch3-canonical-courses.json`. The
  27 existing courses are copied verbatim from the live `courses` rows (read with SELECT only on 2026-09-21), so applying the bundle does not
  change their text.

## Held rows

| Inventory row(s) | Reason |
|---|---|
| M.Tech Mechanical Engineering | The programme page (`/cad-cam-mechanical-engineering-mtech/`, titled CAD/CAM) gives eligibility as "Passed HSC in any Stream with 50% marks with Maths and Physics". That is B.Tech text, and no required bachelor's discipline is published. The title also differs from the fee sheet. |
| M.Tech Civil Engineering | Same problem: the page shows HSC-level eligibility for a master's degree, so the entry requirement cannot be verified. |
| MSc Chemistry, MSc Microbiology | The pages (`/chemistry-m-sc/`, `/microbiology-m-sc/`) show HSC-level eligibility for a master's degree. The required bachelor's discipline is not published. |
| MBA - I - Analytics | The official title is "MBA International Analytics". It is a 1+1 programme, with one year at Marwadi and one year at an unnamed international partner university. The partner, the second-year campus and the second-year fee cannot be verified. |
| B Physiotherapy; M Physiotherapy x3 (Neuromuscular, Musculoskeletal, Cardiopulmonary) | No verified first-year intake. The 2024-25 calendar shows only continuing BPT years starting 18 Nov 2024, and no 2025-26 or 2026-27 calendar is published. MPT first-year dates are not published. |
| BSc Nursing; GNM | No verified first-year intake (same calendar gap). Indian Nursing Council recognition was not verified on INC's own list. |

## Combined BA (fix 2026-09-21)

The three inventory rows BA Psychology, BA Sociology and BA Political Science are one multidisciplinary BA
(`/ba-in-sociology-psychology-political-science/`): the page lists Sociology, Psychology and Political Science as
core disciplines for every student, so no major is chosen at admission. It is packaged as ONE offering,
`marwadi-ba-sociology-psychology-political-science`, mapped to the new generic canonical `ba-general-arts`
(record in `research/india-batch3-canonical-courses.json`). `bachelor-liberal-arts` was not used: it describes
declared-major liberal-arts degrees and its live summary is university-specific. Eligibility: 10+2 in any stream
with 35 per cent (programme page). Fee: the 2026-27 USD flyer's shared BA row, USD 1,700 a year without hostel
or USD 2,900 with hostel, 3 years plus an optional Honours year.

## Recognition (regulator-verified 2026-09-21)

- UGC State (Private) University list, Gujarat, entry 85. Marwadi is not in the 12(B) list, so no 12(B) claim is made.
- NAAC workbook (valid as on 14-08-2025): A+, CGPA 3.31, Cycle 1, declared 09-11-2023, AISHE U-0825.
- NBA Tier I WA (UG): Civil and Mechanical to 30-06-2027; Chemical, Computer and ICT to 30-06-2028. NBA Management PG: MBA to 30-06-2027.
- NIRF 2025: University 101-150, Pharmacy 102-125, Engineering 201-300.
- BCI Approved CLE list (attachment uploaded 2026-09-18): 5-year BA LL.B.(H) and B.Com LL.B.(H), approved up to 2026-27. There is no LL.M. claim.
- Not claimed: PCI (pharmacy), INC (nursing, held), ICAR (agriculture), AICTE. None was verified on the regulator's own list.

## Known caveats

- Teaching language: Marwadi's own pages state no medium of instruction. English is sourced from the Study in India FAQ ("English is
  the medium of instruction in all the Study in India partner institutes") together with Marwadi's prospectus statement that all its
  international students are admitted under Study in India.
- Intake: set to July from the latest published calendar (2024-25, semester I from 1 July 2024). For the LL.M. it is August (trimester I, 5 Aug
  2024). Recheck when Marwadi publishes a newer calendar.
- The Civil, Mechanical, Chemical and ICT diploma pages repeat the B.Tech HSC eligibility line. The fee sheet ("Diploma in Engineering
  (after 10th) (Grade 10 / Form-4 / O Level)") and the international FAQ both set Grade 10 entry. Only that entry level is published, and the
  conflict is recorded in the evidence.
- B.Tech ECE, ECE (AI&ML), Mechanical (R&A) and Mechanical (AI&ML) pages say "As per ACPC Guidelines". The ACPC rule is quoted from
  Marwadi's admission-page FAQ.
- Marwadi's international FAQ says the published fees are already net of its 45-100% tuition scholarship.
- Media: logo `mu-logo.svg` (official; includes a NAAC A+ seal) and cover Commons `File:Marwadi_University.jpg` (CC BY-SA 4.0,
  Eddie Stann). Both are in `research/media-enrichment/india-batch-3-upload-manifest.json`, and neither has been uploaded.
