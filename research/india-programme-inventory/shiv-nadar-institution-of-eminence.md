# Shiv Nadar Institution of Eminence — programme inventory sources

## Sources used
- Official site programme directory: https://snu.edu.in/programs/ and filtered tabs (?programme_type=Undergraduate/Graduate/Doctoral) — reachable via curl, full HTML list of programme overview pages.
- School of Management and Entrepreneurship graduate programmes page: https://snu.edu.in/schools/school-of-management-and-entrepreneurship/departments/graduate-programmes/ — reachable.
- International admissions page (snuadmissions.com): https://snuadmissions.com/International/ — reachable; lists UG programmes explicitly open to international applicants (all engineering B.Tech, B.Des, all B.Sc(Research)/B.A.(Research) UG programmes including History and Sociology).
- snuadmissions.com homepage: https://snuadmissions.com/ — reachable; confirms UG programme URLs and dual-degree ASU links.
- IHSS (Interdisciplinary Humanities and Social Sciences) overview page: https://snu.edu.in/programs/interdisciplinary-humanities-and-social-sciences/overview/ — reachable but majors list could not be cleanly extracted from raw HTML (JS-rendered content); needs a browser-rendered follow-up before treating as authoritative for `major_within` rows.
- snu.edu.in/sitemap.xml — 404, not present; used the /programs/ directory instead.
- studyinindia.gov.in — SNU listed as SII-I-0094 (via WebSearch); detail page (https://studyinindia.gov.in/institute_details?instituet_ID=SII-I-0094) fetched via curl but returned a JS-rendered shell with no visible programme list in raw HTML; treated only as confirmation that SNU participates in Study in India, not as a programme-level source.
- AICTE facilities.aicte-india.org — not queried directly (dashboard requires interactive search, not curl-friendly); relied on WebSearch summaries instead (unreachable via curl within this session).
- NIRF — not fetched as PDF; WebSearch surfaced https://snu.edu.in/site/assets/files/16490/shiv_nadar_university_nirf_2025_overall.pdf and the NIRF portal PDF, but PDF text extraction was not performed this pass (time-boxed). WebSearch summary indicates ~20 UG, ~12 PG/integrated, 17+ PhD programmes, consistent with counts found directly.
- Aggregator checklist (Shiksha/CollegeDekho/Careers360/Times of College) — used only via WebSearch snippets to cross-check counts, not copied; no programme found only on aggregators that wasn't otherwise confirmed on the official site.

## Counts
- Total distinct programme rows: 27 (excludes the condensed PhD row, which bundles 15 doctoral tracks).
- By level: UG 19 (incl. 2 dual-degree ASU, 2 chem-eng specialisation tracks, 1 IHSS), PG 10 (incl. 2 integrated M.Sc-PhD, 4 MBA tracks), Doctoral 1 condensed row (15 tracks).
- By intl_status: open_to_international 12, not_open 2 (MBA Executive, MBA Online — unverified assumption, flagged), unknown 13 (mostly PG/PhD/dual-degree rows with no explicit international-admissions page found).

## Already on site vs missing
- Already on site: 9 (all UG, matches the published bundle's 9 programmes exactly).
- Missing but open_to_international: 3 confirmed (B.Tech ECE, B.Sc(Research) Economics & Finance, B.A.(Research) History, B.A.(Research) Sociology — 4 actually, see CSV) plus 2 dual-degree ASU programmes.
- Missing with unknown/unconfirmed intl status: remaining PG/PhD/specialisation rows — recommend confirming via direct outreach or admissions FAQ before treating as gaps to fill.

## Top GAP canonical courses
- GAP:bs-computer-science-dual-degree-asu
- GAP:bs-business-dual-degree-asu
- GAP:bsc-research-chemistry
- GAP:bsc-research-biotechnology
- GAP:ba-research-history
- GAP:ba-research-sociology
- GAP:be-btech-electrical-computer-engineering (or confirm mapping to existing be-btech-electrical-electronics-engineering)
