# Lovely Professional University — programme inventory (research pass 1)

## Sources used
1. **Official site sitemap** — https://www.lpu.in/sitemap.xml (1,267 URLs). Filtered to `/international/programmes/...` pages, then excluded all `full-time-phd-*` / `part-time-phd-*` pages (≈95 PhD pages, excluded per the task's PhD rule) and non-programme index/search pages (`.../all/Graduation`, `programSearch.php`, `globaltechimmersion/...`). 298 individual programme pages remained.
2. **5 already-published programmes** in `content-migrations/0097-india-lovely-professional-university/payload.json` carry full verified fee/eligibility research and were matched by exact `officialProgramUrl`.
3. **Study in India portal, AICTE facilities dashboard, NIRF data file** — not queried in this pass; flagged as follow-ups.
4. **Checklist aggregators (Shiksha/Collegedunia/Careers360)** — not individually cross-checked; LPU's `/international/programmes/` directory is unusually exhaustive (427 raw URLs before filtering, including lateral-entry and "international-transfer-option" variants of many degrees) and is treated as comprehensive for this pass.

## Coverage caveat
Every row's source URL is itself under `lpu.in/international/programmes/`, i.e. LPU's international-admissions programme directory — treated as standing evidence of `open_to_international` for the whole list. Per-row fee/eligibility figures were not re-extracted in this pass except for the 5 already-published rows. LPU publishes many near-duplicate rows for the same base degree: `-lateral-entry` (diploma-holder entry, separate admissions cycle) and `-with-international-transfer-option` (a study-abroad/2+2-style track) variants are kept as separate rows with an explanatory note rather than merged, since LPU itself markets and prices them as distinct programme pages.

## Counts
- Total programmes found: **298** (after excluding ~95 PhD pages and index/search pages)
- By level: UG 179, PG 99, Diploma 13, Integrated 7 (BA-B.Ed, B.Sc-B.Ed, B.Ed-M.Ed, B.Plan-M.Plan integrated)
- intl_status: open_to_international 298 (see coverage caveat), not_open 0, unknown 0
- Already on our site: **5** (B.Tech CSE, MBA, B.Design Interior & Furniture, BSc Hons Agriculture, BHMCT)
- Missing (open_to_international, not on site): **293**
- GAP canonical courses (no confident taxonomy match): **90** of 298, top disciplines: other 27, computing-it 12, business-management 11, engineering 9, sciences 7, health-medicine 7

## Top GAP canonical courses (candidates for new taxonomy entries)
- Engineering/CSE specializations: CSE-AI & Data Engineering, CSE Big Data & AI (IBM), CSE Cloud DevOps (Xebia), CSE Cyber Security Compliance & Risk, CSE Generative AI, CSE Robotics & AI, CSE Software Product, CSE-UI/UX, ECE-VLSI Design, B.Tech Semiconductor Technology & VLSI, B.Tech Electrical & Computer Engineering, M.Tech VLSI Design, M.Tech Information Security & Cyber Forensics, M.Tech Data Science & Analytics
- Design: B.Design/M.Design in Gaming, Graphics, UX/UI, Product & Industrial Design, Animation & VFX (separate B.Design and BSc tracks), M.Sc UI/UX Design
- Allied health/agriculture: BSc Operation Theatre & Anaesthesia Technology, BSc Child & Elderly Care, MSc Clinical Embryology, MSc Clinical Biochemistry, MSc Clinical Microbiology, the full MSc Agriculture specialization set (Entomology, Horticulture-Floriculture/Fruit/Vegetable Science, Soil Science, Agronomy, Genetics & Plant Breeding), M.Pharm specializations (Ayurveda, Pharmaceutical Analysis, Pharmaceutics, Pharmacology)
- Business: MBA Data Science & AI, MBA Fintech & AI, MBA Technology Management, MBA Tourism/Aviation/Hospitality, BBA Fintech & AI, BBA Digital Marketing & AI, BBA Airlines & Airport Management, BBA Cargo Logistics & SCM, B.Com Corporate Finance / Management Accounting & International Finance / International Accounting
- Law: LLB, LLM, BA-LLB Hons, BBA-LLB Hons
- Library/education/performing arts: B.LIS/M.LIS, M.Ed, integrated B.Ed tracks, BPA/MPA Music & Theatre, MFA

## Follow-ups for step 2
- Re-crawl each of the 298 pages individually to extract confirmed per-row fee/eligibility/duration/intake, replacing the blanket international-directory inference with per-programme evidence and citations.
- Decide whether `-lateral-entry` and `-with-international-transfer-option` variants should be modelled as distinct catalogue offerings or as admission-route flags on a single offering — currently kept as separate CSV rows pending that product decision.
- Query studyinindia.gov.in, AICTE and NIRF for LPU to cross-check and surface any AICTE-approved intake not marketed on the international pages.
- Human review of the fuzzy `canonical_course_match` column, especially the very large number of named CSE/MBA/BBA/M.Sc specialization tracks.
