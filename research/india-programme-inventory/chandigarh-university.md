# Chandigarh University — programme inventory (research pass 1)

## Sources used
1. **Official site sitemap** — https://www.cuchd.in/sitemap.xml (2,279 URLs). Filtered to the `/international/<school>/...php` programme-detail pages (school index pages `ug-courses.php`/`pg-courses.php`/`phd-courses.php` and non-programme pages such as country-partner pages, blogs and the FRRO/visa content were excluded). 133 individual UG/PG programme pages remained after also excluding pure PhD pages (21 excluded per the task's PhD-exclusion rule).
2. **8 already-published programmes** in `content-migrations/0101-india-chandigarh-university/payload.json` carry full verified fee/eligibility/NBA-status research and were matched by exact `officialProgramUrl`.
3. **Study in India portal, AICTE facilities dashboard, NIRF data file** — not queried in this pass; flagged as follow-ups.
4. **Checklist aggregators (Shiksha/Collegedunia/Careers360)** — not individually cross-checked; CU's `/international/` site section is unusually granular (per-specialization pages, e.g. 9 separate CSE specialization pages under Engineering) and is treated as comprehensive for this pass.

## Coverage caveat
Every row's source URL is itself under `cuchd.in/international/`, i.e. CU's international-admissions site section — this is treated as standing evidence of `open_to_international` for the whole list (CU builds a dedicated marketing page per programme specifically for its international audience, distinct from the domestic `cuchd.in` catalogue). Per-row fee/eligibility figures were not re-extracted in this pass except for the 8 already-published rows. Several engineering rows are lateral-entry (diploma-holder) admission routes and are kept as separate rows with a note, per the task's separate-admissions-cycle rule.

## Counts
- Total programmes found: **133** (after excluding 21 pure-PhD pages)
- By level: UG 85, PG 44, Integrated 4 (BA-LLB, BBA-LLB, B.Com-LLB integrated law, plus BE/ME integrated CSE)
- intl_status: open_to_international 133 (see coverage caveat), not_open 0, unknown 0
- Already on our site: **8** (BE CSE, BE Mechanical, BE Aerospace, MBA, B.Pharm, BA Psychology Hons, BA Journalism & Mass Comm, MSc Chemistry)
- Missing (open_to_international, not on site): **125**
- GAP canonical courses (no confident taxonomy match): **71** of 133, top disciplines: engineering 15, other 12, computing-it 11, business-management 10, sciences 7

## Top GAP canonical courses (candidates for new taxonomy entries)
- Engineering specializations not in the taxonomy: CSE + Business Systems (TCS), CSE-AI/ML, CSE Full Stack, CSE-IoT, CSE-Cloud (Virtusa), ME Robotics, ME Environment Engineering, ME Transportation Engineering, ME CTM, EEE-Electric Vehicles, BE Food Technology, BE-ME Integrated CSE, several lateral-entry tracks
- Computing: BCA AR/VR, MCA AI/ML, MCA Cloud Computing/DevOps, MCA Data Science, MSc Data Sciences, BSc CSM (Computer Science & Mathematics)
- Business: MBA AI & Data Science, MBA Healthcare & Life Sciences, MBA Logistics & SCM, MBA Tourism & Hospitality, MBA Fintech, MBA Global Business Management, MBA Digital Marketing, MBA International Relations, MBA Media & Entertainment, MBA Strategic HR, BBA Digital Marketing, BBA Fintech, BBA Strategic HR with AI, B.Com ACCA
- Allied health: Optometry (regular + LEET), Physiotherapy Masters, Forensic Science/Toxicology (UG+PG), Medical Lab Technology (UG+PG+LEET), Nutrition & Dietetics (UG+PG)
- Hospitality/travel: BSc Airline & Airport Management, BSc Culinary Arts, BSc Hotel & Hospitality Management, BSc Travel & Tourism Management
- Law: BA-LLB / BBA-LLB / B.Com-LLB integrated, standalone LLB, LLM
- Basic sciences PG: MSc Botany, MSc Statistics, MSc Zoology, MSc Industrial Chemistry/Microbiology, MSc Bioinformatics

## Follow-ups for step 2
- Re-crawl each of the 133 pages individually to extract confirmed per-row fee/eligibility/duration/intake, replacing the blanket international-site-section inference with per-programme evidence and citations.
- Query studyinindia.gov.in, AICTE and NIRF for CU to cross-check and surface any AICTE-approved intake CU does not market on its international pages.
- Human review of the fuzzy `canonical_course_match` column, especially for the many named-specialization CSE/MBA/BBA tracks that only partially overlap existing taxonomy entries.
