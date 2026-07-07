# Trent University (Trent/Fleming School of Nursing) — Research Record

Country: Canada | City: Peterborough, Ontario | Status: PUBLISH-READY (ok=true)

## Key facts (corroborated)

- **Type:** Public university (Wikipedia; Trent's own site does not directly state "public" in plain text but is universally described as such and is a member of Universities Canada / COU).
- **Established:** 1964 (Wikipedia infobox).
- **Enrolment:** ~15,060 total students, ~13,825 undergraduates (2023–2024), per Wikipedia's Trent University infobox (sourced from Trent's own reporting).
- **Campuses:** Symons Campus, Peterborough (main); Trent Durham GTA, Oshawa.
- **Nursing school:** Trent/Fleming School of Nursing (TFSON), delivered in partnership with Fleming College.
- **CNO approval (independently verified on the regulator's own site):** College of Nurses of Ontario's published list of Approved Baccalaureate Nursing (RN) Programs explicitly lists:
  - Trent/Fleming School of Nursing Honours Bachelor of Science in Nursing (in collaboration with Fleming College) — Approved
  - Compressed Honours Bachelor of Science in Nursing — Approved
  - Post-RPN Bridging Pathway to Honours BScN (in collaboration with George Brown College) — Approved
- **Simulation Hub:** Trent's own site states TFSON is "Canada's only university nursing program with a fully internationally accredited simulation centre."

## Programs offered (BScN pathways)

1. **Collaborative Program** — 4 years, OUAC code RCN, intake ~120 students, September start, Peterborough Symons campus. Open to secondary-school applicants and those with limited post-secondary credit. This is the pathway most relevant to Indian Class-12 applicants (published admission-requirement table converts secondary/college/university course equivalents into prerequisite grades).
2. **Compressed Program** — 28 months, OUAC code RFN, intake ~100 students, September start. Requires substantial prior post-secondary transfer credit (not eligible directly from secondary school).
3. **RPN-to-BScN Pathway** — delivered at George Brown College's Waterfront campus in Toronto, for Ontario-registered practical nurses (RPNs) in good standing with CNO. OCAS code S442.

Only the **Collaborative Program** was included as a structured `program` entry in the publish-ready JSON (courseSlug: `bsc-nursing`), since it is the direct-entry pathway most relevant to Indian secondary-school applicants and matches the standard site program-page pattern. The Compressed and RPN-to-BScN pathways are described in the narrative content (summary, whyChoose, thingsToConsider, FAQ) but not duplicated as separate program entries, since they require prior Canadian-recognized post-secondary/PN credentials rather than being open, direct-entry international routes.

## What was OMITTED and why

- **Exact international tuition fee amount for BScN.** Trent's tuition pages (`trentu.ca/studentfinances/tuition-fees/international-students-tuition-fees` and the Trent International finance-scholarships page) present tuition only via a dynamic JS-driven "Trent Cost Estimator" tool and links to downloadable PDF fee schedules by term — no static international BScN tuition figure was retrievable via curl/static fetch. Per the exhaustive-then-omit rule, no fee number was fabricated or estimated; the page explicitly directs students to the official cost estimator / international@trentu.ca instead, and notes the up-to-$160,000 CAD scholarship claim (which Trent does publish in plain text) with the caveat that eligibility/amounts vary.
- **MD, Pharmacy, Dentistry, or other health programs.** Trent does not appear to offer MBBS/MD, Pharm.D, or BDS programs (it is not a medical/pharmacy school) — only Nursing (BScN, undergraduate) and MScN (graduate, joint with Ontario Tech) were found in the Health, Life Science & Medicine / Nursing category. Only BScN was in scope per the assignment (Trent/Fleming School of Nursing).
- **NCLEX-RN as the specific licensing exam name for Ontario.** The CNO's own site frames Ontario's RN registration examination process at a high level without a single simple "graduates must pass NCLEX-RN" sentence pinned to Trent specifically; the draft frames this carefully ("Canadian RN registration in most provinces is completed via the NCLEX-RN examination administered under CNO/provincial regulator processes") rather than asserting Trent-specific NCLEX pass-rate claims, which were not found.
- **India-specific admission requirements page.** `trentu.ca/futurestudents/admissions/international-students/admission-requirements-country` returned 404 on the checked date; general international admission rules (English proficiency, WES evaluation, OUAC process) were used instead, all sourced from pages that did load.
- **Exact Peterborough population for 2025/2026.** Statistics Canada's most recent full "Safe Cities" profile for Peterborough is from 2020 (using 2014–2018 data); 2021 Census city population (~83,651) and CMA population (~128,624) are known from general web search summaries citing Wikipedia/StatCan, but the full StatCan profile page (with crime and safety percentages) is what was directly fetched and cited, so the draft is explicit that the safety/demographic data reflects a 2014–2018 window, not current-year figures.
- **Specific on-campus residence fee amounts / meal plan pricing / first-year guarantee policy specifics.** Trent's housing pages describe residence options and an off-campus partnership (Places4Students.com) but do not give a static fee table in the fetched pages; the draft notes this and directs students to confirm current details post-admission rather than fabricating figures.

## Sources (labelled URLs)

1. TFSON Programs (official) — https://www.trentu.ca/nursing/programs
2. TFSON Undergraduate Admissions (official) — https://www.trentu.ca/nursing/undergraduate-admissions
3. TFSON Trent Simulation Hub (official) — https://www.trentu.ca/nursing/experience/tfson-trent-simulation-hub
4. TFSON Placement Experience (official) — https://www.trentu.ca/nursing/placement-experience
5. Trent Future Students — English Language Proficiency Requirements (official) — https://www.trentu.ca/futurestudents/admissions/international-students/english-proficiency
6. Trent International — Financial Information for International Students (official) — https://www.trentu.ca/international/finance-scholarships
7. Trent International — Who We Are (official) — https://www.trentu.ca/currentstudents/trent-international
8. Trent Student Housing — Welcome (official) — https://www.trentu.ca/housing/
9. College of Nurses of Ontario — Approved Baccalaureate Nursing (RN) Programs (independent regulator) — https://www.cno.org/become-a-nurse/approved-nursing-programs/baccalaureate-nursing-rn-programs
10. Wikipedia — Trent University (independent corroboration) — https://en.wikipedia.org/wiki/Trent_University
11. Statistics Canada — Safe Cities Profile Series: Peterborough, Ontario (independent government data) — https://www150.statcan.gc.ca/n1/pub/85-002-x/2020001/article/00001/peterborough-eng.htm
12. Peterborough Currents — "We worship all the gods here": Hindu temple opens in downtown Peterborough (independent local news) — https://peterboroughcurrents.ca/community/hindu-temple-opens/

Additional pages checked but not cited as standalone sources (used only to confirm navigation/links or returned 404/thin content): trentu.ca homepage, trentu.ca/nursing/ homepage, trentu.ca/nursing/admissions, trentu.ca/futurestudents/international-undergraduate, trentu.ca/futurestudents/degree/nursing?target=undergraduate, trentu.ca/studentfinances/tuition-fees/international-students-tuition-fees, trentu.ca/nursing/undergraduate-admissions (full page reviewed), en.wikipedia.org/wiki/List_of_Canada_cities_by_crime_severity_index (Peterborough not present in table), trentu.ca/futurestudents/admissions/international-students/admission-requirements-country (404).

## Validation

`node -e "JSON.parse(require('fs').readFileSync('trent-university.json','utf8'))"` → parsed OK.
Gate check script run manually confirms: 12 sources (≥2 required), 1 program with explicit courseSlug `bsc-nursing`, bestFitFor=4 (≥3), whyChoose=5 (≥3), thingsToConsider=6 (≥3), faq=8 (≥3), all 8 narrative fields present and free of weak-draft markers, type=Public, establishedYear=1964, officialWebsite set.
