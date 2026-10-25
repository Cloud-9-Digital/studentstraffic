# Tamil Nadu Teachers Education University — programme inventory (25 October 2026)

Owner `claude-tn-tnteu-20261025`; batch `tn-group28-20261025`. This replaces the earlier two-row
`held` inventory. It records the complete taught/research portfolio named by the university, separates
university-department awards from affiliated-college awards, and marks exactly one offering as
packaged.

## Scope and identity

Tamil Nadu Teachers Education University (TNTEU) is a public, single-discipline education university
at Gangaiamman Koil Street, Karapakkam, Chennai 600097. It was established by Tamil Nadu Act No. 33
of 2008 and commenced on 1 July 2008 under G.O.Ms. 256 dated 25 June 2008. It is an affiliating
university: its own six departments teach one common M.Ed., while B.Ed., B.Ed. Special Education,
B.A.B.Ed., B.Sc.B.Ed. and M.Ed. Special Education are affiliated-college programmes.

The current `departments.php` statement is decisive for the university-owned portfolio:
"all six Departments ... together offer one common M.Ed Programme. In addition ... these six
Departments together offer M.Phil and Ph.D Programmes in Education."

## Inventory summary

| Award | Level | Campus / route | Status | Reason |
|---|---|---|---|---|
| M.Ed. Degree (Two-Year Full-Time) | Masters | University Departments, Karapakkam | **Packaged** | Current 2026-27 notification, fee, eligibility, duration and NCTE recognition verified |
| ITEP (Science stream) | Bachelors (integrated) | University Departments (proposed) | Held | NCTE 2020-21 permission only; commencement directions awaited; no current admission notice |
| M.Phil. in Education | Masters (research) | University Departments | Held | No 2026-27 admission notice; published students list has only 2020/2021 entrants |
| Ph.D. in Education | Doctoral | University Departments | Excluded | Research doctorate outside taught UG/PG scope |
| B.Ed. | Bachelors | Affiliated colleges | Excluded | Affiliated-college award, not a university-department offering |
| B.Ed. Special Education | Bachelors | Affiliated colleges | Excluded | Affiliated-college award |
| B.A.B.Ed. (4 years) | Bachelors (integrated) | Affiliated colleges | Excluded | Affiliated-college award |
| B.Sc.B.Ed. (4 years) | Bachelors (integrated) | Affiliated colleges | Excluded | Affiliated-college award |
| M.Ed. Special Education | Masters | Affiliated colleges | Excluded | Affiliated-college award, distinct from the common M.Ed. |

## Packaged: M.Ed. (two-year full-time)

**Why it clears the bar**

- The official 2026-27 admission notification (3-page PDF, text layer intact) invites applications to
  the "Full-Time Two year M.Ed., Degree programme offered by this University Departments for the
  academic year 2026 - 2027". It gives the online portal, application fee and tuition.
- `departments.php` confirms the six departments jointly teach one common M.Ed. at Karapakkam, so this
  is a university-department offering rather than an affiliated-college award.
- NCTE's own Tamil Nadu SRC list (page 57, row 848, Institute ID NCTE4731890) records M.Ed., intake 50,
  order 02-05-2017, session 2017-18, Revised Recognition.
- The currently linked CBCS regulations (2021-22 file, effective from 2020-21) give the 50% B.Ed./
  B.A.B.Ed./B.Sc.B.Ed./B.El.Ed. entry rule, the two-year/four-semester/90-credit structure, the
  selection basis, field-work components and attendance thresholds.

**Facts packaged**

- Tuition: INR 5,945 in year one and INR 4,640 in year two, total INR 10,585 for 2026-27; domestic
  audience. Application fee INR 100 (SC/ST/PWD INR 50) is separate, as are hostel and eligibility fees.
- Medium: **omitted**. The regulations say "Tamil or English depending on the availability of medium
  of instruction in the Colleges of Education / University Departments", but the Karapakkam
  department's actual language is not published. `medium: ""` and `instructionLanguages: []` are used
  with explicit omit evidence; English is not inferred.
- Intake months: **omitted**. The 2026-27 notification gives no first-year start date. The 01.09.2025
  commencement circular is addressed to affiliated-college principals, so it cannot establish a
  university-department start. Both intake arrays are empty with omit evidence.
- Audience: restricted to domestic applicants. No international/NRI admission route or international
  fee is published; the application form asks nationality but provides no separate route or visa
  process.
- Recognition: UGC 2(f) & 12(B) state university; NAAC Grade A, CGPA 3.17, first cycle (declared
  15-11-2022); NCTE M.Ed. recognition.
- Documents: transfer certificate, UG degree, PG degree, B.Ed. degree, B.Ed. marks, community
  certificate, two passport photos, and PWD certificate where applicable.

## Held or excluded in detail

### ITEP (Science stream)

The official `itep.php` page says NCTE granted permission in 2020-21 but that directions for
commencement are awaited. No current 2026-27 admission notice, degree title, duration, eligibility,
fee, medium or intake is published, and NCTE's current Tamil Nadu list shows no ITEP course for this
institution. It is not inferred from the affiliated B.Sc.B.Ed. programme. Inventory only.

### M.Phil. in Education

The departments page and academic menu still name M.Phil. (the menu labels it one year), but there is
no 2026-27 M.Phil. admission notification, current fee page or current regulations. The published
`Mphil_students_list.xlsx` contains only 2020 entrants (8) and 2021 entrants (10), and no later
cohort. It is therefore recorded as not a current intake, not as a missing-language hold.

### Ph.D. in Education

Named on the departments page as a research programme. It is outside the taught UG/PG scope of this
task; no admission, fee or supervision detail was assessed.

### Affiliated-college awards

`genesis.php` states the one UG programme (B.Ed.) and two PG programmes (M.Ed. and M.Phil.) are
conducted in affiliated colleges. The site's affiliated-college menu additionally lists B.Ed. Special
Education, B.A.B.Ed. (4 years), B.Sc.B.Ed. (4 years) and M.Ed. Special Education. None of these is a
Karapakkam university-department offering, so none is packaged or used to infer an ITEP launch.

## Evidence and cautions

The full source audit, exact URLs, row identifiers and media checks are in
`research/india-source-bundles/tnteu-20261025-rescue/source-audit.md`.

- UGC register row ID 395 spells the name "Tamil Nadu Teacher Education University"; NAAC and NCTE
  use "Teachers". The official institutional name is retained, and the UGC spelling is recorded as an
  identity variant.
- The site publishes conflicting affiliated-college counts (668 vs 731) and an old 75,000-student
  strength; none is used.
- `eligibility_fees.php` (INR 635 first year / INR 180 second year) is an eligibility fee, not tuition.
  `students_details_fees.php` shows an older generic table and is not the 2026-27 M.Ed. tuition.
- No database write, Cloudinary upload, commit, push or publication was performed.
