# FLAME University — programme inventory sources

## Sources used
- https://www.flame.edu.in/sitemap.xml — reachable (200), ~13,000 lines / hundreds of URLs, used as the primary discovery tool for programme and course-page URLs across `/academics/ug/`, `/academics/ug-bdes/`, `/academics/pg/*`, `/academics/doctoral-program/*`.
- https://www.flame.edu.in/academics/ug/program-structure/major-minor-courses (and its 27 child pages) — full UG major/minor catalogue, all reachable via curl.
- https://www.flame.edu.in/academics/pg/mba, /academics/pg/mba-cm, /academics/pg/msc-economics, /academics/pg/pgpei — all reachable; page `<title>` used to get official programme names ("MBA (Communications Management)", "Post Graduate Program in Entrepreneurship and Innovation").
- https://www.flame.edu.in/academics/doctoral-program and its 7 discipline sub-pages (Data Science, Economics, Environmental Studies, Humanities, Management, Psychology, Sociology) — reachable.
- https://www.flame.edu.in/global-connect/study-abroad/for-international-students — reachable; explicitly lists which degrees are open to international applicants: "B.A., B.Sc., BBA, BBA(CM), Hons.", "B.Des", "MBA, MBA (CM), M.Sc., PGPEI" — i.e. every FLAME degree-level programme found is open_to_international; individual majors/minors inherit this status since they are selected within the same UG admission.
- studyinindia.gov.in, AICTE, NIRF, aggregator checklist (Shiksha/Collegedunia/Careers360) — used only via WebSearch for cross-checking; no additional programmes were surfaced beyond what the official sitemap already listed.

## Counts
- Total distinct rows: 32 (1 umbrella UG liberal-education degree + 26 major/minor rows + 1 B.Des + 4 PG degrees + 1 condensed PhD row).
- By level: UG 28 (1 umbrella + 26 majors/minors + 1 B.Des), PG 4 (MBA, MBA-CM, MSc Economics, PGPEI), Doctoral 1 condensed row (7 tracks).
- By intl_status: open_to_international 31 (every degree-level and major/minor row, based on the international-students page confirming all named FLAME degrees), unknown 1 (the doctoral programme — no explicit international PhD-admissions statement found this pass).

## Already on site vs missing
- Already on site: 3 (flame-undergraduate-liberal-education, flame-bachelor-of-design, flame-mba — matches the published bundle exactly).
- Missing but open_to_international: MBA (Communications Management), M.Sc. Economics, PGPEI, plus all 26 individual majors/minors (to be modelled as `major_within` rows under the existing umbrella UG offering, pending a decision on whether majors get their own content sections).
- Note: "ba-psychology" and "psychology" appear as two separate course pages in the sitemap — likely a legacy duplicate rather than two distinct majors; flagged in the CSV notes for confirmation before publish, not counted twice as a gap.

## Top GAP canonical courses
- GAP:mba-communications-management
- GAP:msc-economics
- GAP:pg-entrepreneurship-innovation
- GAP:phd-various
