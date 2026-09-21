# University of Hyderabad -- Programme Inventory

Research pass only (India batch 3, Phase B). No payload/ledger/DB/docs edits were made from this file.

## Sources used

1. **Official prospectus -- Prospectus 2026-27**
   (`https://acad.uohyd.ac.in/downloads/pros2026.pdf`, 18,539-line `pdftotext -layout` dump, fetched
   2026-09-21). Reachable (13.8 MB PDF, curl + pdftotext). This is the primary and only source for the
   CSV:
   - **"Break-up for the Approved Intake for 2026-27" -- Table-I (UG / 5-Year Integrated PG
     Programmes)**, **Table-II (PG Programmes)** and **Table-III (M.Tech. Courses)** (pdftotext lines
     ~18109-18306): the complete, authoritative list of every non-PhD degree programme UoH admits for
     2026-27, with official subject/course names and category-wise intake. This is a cleaner and more
     complete source than the narrative per-school programme pages, so it was used as the row source
     for the whole CSV instead of fetching each school's page individually.
   - **"Admission of International Students 2026-27"** (lines 2941-3040, p.67-68): confirms UoH runs a
     single, **university-wide 25% supernumerary "in absentia" international-admission route** open to
     "any program", not a per-programme allow-list; NRIs with Indian passports are explicitly excluded
     from the international-student category; IELTS 6.5 / TOEFL required unless the qualifying degree
     was taught in English.
   - **"Fees Payable by Foreign Students 2026-27"** (lines 3627-3800, p.79-81): a 9-row fee-group table
     naming most UG/Integrated/PG/M.Tech programmes explicitly by title, in USD per semester, split
     "Foreign students and NRI" vs "SAARC & Korean students", each with a one-time development fee.
     Used as the **per-programme** evidence for `intl_status` wherever a row's exact title (or an
     explicit grouping such as "M.Tech (CS/AI/IT)") appears in this table; the university-wide policy
     above was used only as the fallback evidence for the handful of rows not individually named
     (M.Ed., M.A. Financial Economics, M.Tech Microelectronics & VLSI Design) -- flagged per-row in the
     CSV `notes`.
2. **International Affairs office page** -- `https://oia.uohyd.ac.in/direct-admissions/` -- checked
   per the batch-3 shortlist note that it still links the 2021 prospectus; the 2026 prospectus PDF was
   used as the authoritative source instead, not this page.
3. **Study in India, AICTE, NIRF data file** -- not queried in this pass (the prospectus intake tables
   already gave a complete, dated, official programme list; time-boxed). Flagged as a follow-up
   cross-check, not required to complete the inventory.
4. **Aggregators (Shiksha/Collegedunia/Careers360)** -- not queried in this pass; UoH's own approved-
   intake table is exhaustive by construction (it is the seat-allocation table filed with UGC), so no
   aggregator missed-programme check was needed.

## Methodology

Rows were built directly from Table-I/II/III of the prospectus's approved-intake section rather than
from individual school/department pages, because that section is the university's own single source of
truth for "every degree programme with an approved 2026-27 intake" -- exactly the full-coverage unit the
runbook asks for. `duration` is given in semesters in Table-I for the two UG programmes and is stated as
"5-Year" in the Integrated-PG table header; Table-II (PG) and Table-III (M.Tech) do not state duration,
so those rows carry `duration = unknown (see official source)` rather than an assumed 2-year figure --
confirm on each department's own programme page before publishing. `discipline` uses the Subject/School
column from the intake tables. PhD programmes (Table-IV) were excluded per the task's PhD-exclusion
rule; M.Phil is not offered (prospectus states this explicitly).

## Counts

- **Total programmes catalogued (excl. PhD): 70**
- By level: PG 50 (46 Table-II + 4 Table-III M.Tech), Integrated 18, UG 2
- By `intl_status`: all 70 rows `open_to_international` -- 65 evidenced by an explicit row/group in the
  per-programme Foreign Students Fee table 2026-27; 5 evidenced only by the university-wide 25%
  supernumerary policy (M.Ed. Education, M.A. Financial Economics, M.Tech Microelectronics & VLSI
  Design, and the two rows folded into that group by name-grouping ambiguity are noted individually in
  the CSV). None `not_open`; none `unknown`.
- **Already on site: 0** (new university; not yet published).
- **GAP canonical courses: 9** distinct parent slugs, covering 24 of the 70 rows:
  - `GAP:bachelor-optometry` (B.Optometry)
  - `GAP:ma-indian-languages` (Hindi, Telugu, Urdu, Sanskrit -- both Integrated-M.A. and M.A. rows)
  - `GAP:ma-comparative-literature` (M.A. Comparative Literature)
  - `GAP:me-mtech-computer-science-engineering` (Integrated M.Tech CS, M.Tech CS, M.Tech AI -- no
    canonical M.Tech-level Computer Science course exists at all today, only B.E./B.Tech CSE)
  - `GAP:me-mtech-materials-engineering` (Integrated M.Tech Materials Engineering)
  - `GAP:me-mtech-bioinformatics` (M.Tech Bioinformatics)
  - `GAP:msc-neuroscience-cognitive-science` (M.Sc. Neural and Cognitive Science)
  - `GAP:master-performing-arts` (M.P.A. Dance x2, Theatre Arts, Music x2)
  - `GAP:master-visual-arts` (M.V.A. Painting, Print Making, Sculpture, Art History x4)
  - 46 of the 70 rows matched an existing canonical course slug (several -- biochemistry, plant
    biology & biotechnology, molecular microbiology, animal biology & biotechnology, systems &
    computational biology -- were mapped to the generic `msc-biological-sciences` parent rather than
    given individual GAP slugs, since that canonical course is defined broadly enough to genuinely fit).

## Unreachable / not attempted this pass

- Study in India, AICTE facilities dashboard, NIRF data file: not queried (prospectus intake tables
  were sufficient and authoritative for the full-coverage row list).
- Individual department/school pages were not fetched for the 50 PG/M.Tech rows' duration, fee amount
  precision, or eligibility text -- `duration` is marked unknown rather than guessed; confirm before
  packaging.

## Phase D packaging (2026-09-21) - migration `0111-india-university-of-hyderabad`

Packaged **60 of 70** `open_to_international` rows at first (67 after the language fix below); ledger row set to `validated`. All 60 use the
university-wide direct in-absentia FN route (Prospectus 2026-27 pp.67-68 printed / PDF pp.69-70:
supernumerary up to **25%** - the OIA basic-info page still says 15%, superseded; SII number required
except OCI; applications Jan-30 Apr, decisions by 31 May). ICCR/SII-sponsored applicants go through
their sponsoring body. Durations taken from the prospectus programme tables (PG 4 semesters; M.P.A.
Theatre Arts 6; integrated 10; B.S. 8; B.Optometry 10). Fees: USD per semester from the 2026-27
Foreign Students table; two semesters a year (Jan-Jun, Jul-Dec) so annual = 2 x semester and total =
semester x semesters. Note: the inventory's `#page=` anchors use printed page numbers; PDF page =
printed + 2 (the payload uses PDF pages).

Supernumerary-policy-only rows resolved: **M.A. Financial Economics** -> fee row 5 ("M.A. courses in
Humanities, Social Sciences & Economics"), confirmed. **M.Ed.** and **M.Tech Microelectronics & VLSI
Design** are not in the FN fee table (the Indian table lists VLSI separately from "IC Technology &
Bioinformatics"), so both are packaged with fee status `on_request`.

### Language M.A.s released (fix 2026-09-21)

`hindi`, `sanskrit`, `telugu` and `urdu` were added to `teachingLanguageCodes` and to the database
guard (`drizzle/0079_indian_teaching_languages.sql`), and the 7 language programmes are now packaged
(67 of 70 rows):

- **Integrated M.A. Hindi / Telugu / Urdu** -> `instructionLanguages` `[english, <language>]`. The
  prospectus remarks to the UG/Integrated table (PDF p.25) say language-course students also take
  university-level mandatory courses and electives taught in English; the note on PDF p.62 says
  language courses are taught in the language concerned. Eligibility from PDF pp.22-24.
- **M.A. Hindi / Telugu / Urdu** -> the language only, per the PDF p.62 note. Eligibility from PDF
  p.31 (CUET-PG LAQP02 / LAQP36 / LAQP37).
- **M.A. Sanskrit Studies** -> `[sanskrit]`. This is the weakest of the seven: it is treated as a
  language course under the p.62 note (Department of Sanskrit Studies, School of Humanities; entry
  requires a Sanskrit qualification), but neither the department site nor its prospectus pages
  (pp.218-219) state a separate medium. Recheck if UoH publishes a programme-level statement.
- Fees: all seven are in fee row 5 ("M.A. (5-year Integrated), M.A. courses in Humanities...") at
  USD 1,090 per semester. Canonical `ma-languages-linguistics`.

### Held (3)

| Row | Reason |
|---|---|
| 5 Year Integrated M.Tech CSE; 5 Year Integrated M.Tech Materials Engineering | Indian admission via JoSAA/CSAB (JEE Main). UoH is a DASA 2026 participating Other-GFTI (DASA: JEE Main score, USD 300 + USD 4,000 first-semester fee) while the UoH FN fee table lists USD 1,880/semester. Route and fee basis conflict; DASA seat matrix for UoH not verified. |
| M.C.A. | UoH admits on NIMCET 2026 eligibility (Indian nationals only) and gives foreign nationals only "the required minimum qualification" plus TOEFL/IELTS; the NIMCET qualification could not be read from an official source. |
