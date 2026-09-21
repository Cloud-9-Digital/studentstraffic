# Sharda University — programme inventory (research pass 1)

## Sources used
1. **Official site sitemap** — https://www.sharda.ac.in/sitemap.xml (12,209 lines; 234 distinct `/programmes/<slug>` URLs extracted). This is the primary source for every row in the CSV.
2. **Spot-checked programme pages** for the "For International Students" fee evidence pattern: `mbbs`, `md-general-medicine`, `bsc-nursing`, `llm-corporate-law`, `executive-mba` (all five show a dedicated international fee cell), plus the 7 programmes already published on our site (which have full verified fee/eligibility research in `content-migrations/0099-india-sharda-university/payload.json`).
3. **International fee list** — https://www.sharda.ac.in/international/global-course-fee — page loads a JS-driven filter (level/discipline dropdowns) with no server-rendered table and no discoverable AJAX endpoint in the page source, so it could not be scraped for a full fee table in this pass. https://www.sharda.ac.in/international/admission-rules was reachable and readable.
4. **Study in India portal (studyinindia.gov.in)** — not queried in this pass (time-boxed); flagged as a follow-up.
5. **AICTE facilities.aicte-india.org / NIRF nirfindia.org** — not queried in this pass; flagged as a follow-up. Sharda's NBA/NMC/PCI recognition scope is already documented per-programme in the existing published rows (e.g. B.Tech CSE's NBA accreditation lapsed 30 June 2026).
6. **Checklist aggregators (Shiksha/Collegedunia/Careers360)** — not individually cross-checked row by row in this pass; the 234-URL official sitemap is treated as comprehensive since it already covers every discipline the aggregators typically list (engineering, medicine, dentistry, nursing, pharmacy, law, management, design, media, sciences, humanities). Flagged as a follow-up for high-value GAP rows before publishing decisions.

## Coverage caveat
This pass builds the inventory from the official programme-directory URL list plus a small evidence sample, rather than re-fetching and re-parsing fee/eligibility content from all 234 pages individually (out of scope/budget for a research-only step 1). `intl_status` is set to `open_to_international` for the whole catalogue based on the spot-check pattern (every sampled page, across UG, PG-medical, nursing, law and executive-MBA, carries a "For International Students" fee cell) — this is a reasonable inference, not a per-row verification. MBBS/BDS/MD/MS/MDS rows carry a note that admission is additionally gated by NMC/DCI seat-matrix rules for foreign nationals, which the university-facing marketing page does not itself resolve.

`canonical_course_match` is produced by fuzzy token matching against `lib/data/program-taxonomy.ts` and should be treated as a first-pass suggestion, not a final mapping decision.

## Counts
- Total programmes found: **234**
- By level: UG 120, PG 105, Certificate 4, Diploma 2, Integrated 3
- intl_status: open_to_international 234 (see coverage caveat above), not_open 0, unknown 0
- Already on our site: **7** (B.Tech CSE, B.Tech ECE, MBA International Business, B.Des Communication Design, B.Pharm, BA Psychology, BA Journalism & Mass Communication)
- Missing (open_to_international, not on site): **227**
- GAP canonical courses (no confident taxonomy match): **83** of 234, top disciplines by count: other 21, health-medicine 16, computing-it 13, business-management 13, sciences 7

## Top GAP canonical courses (candidates for new taxonomy entries)
- Engineering/CSE specializations: AI-enabled fintech, AI & Data Science, Computer Science & Medical Engineering (AI), CSE Full Stack (Xebia), CSE Cyber Security/Forensics (Microsoft), ECE-VLSI, EEE-Renewable Energy, Advanced Electric Vehicle, Genetic Engineering, Food Process Engineering
- Medicine/dentistry/allied health PG: the full MD/MS/MDS residency list (14 MD branches, 5 MS branches, 7 MDS specializations), MSc Genomic Medicine, MSc Clinical Neurophysiology, BSc Cardiovascular Technology, BSc Radiological Imaging Techniques, BSc Optometry, Pharm.D, M.Pharm
- Nursing specializations: post-basic BSc Nursing, MSc Child/Community/Obstetrics-Gynae/Psychiatric Nursing
- Business: BBA/MBA specialization tracks (Business Analytics Hons, Healthcare & Hospital Admin Hons, Logistics & SCM Hons, Dual Specialization MBA), B.Com Hons with ICA, B.Com International Accounting & Finance (ACCA)
- Law: LLM Corporate Law, LLM Criminal Law, BBA-LLB integrated, BA-LLB integrated
- Design/media: MA Jain Studies, MA International Relations, Interior Design Masters, Fashion Design Masters

## Follow-ups for step 2
- Re-crawl the 234 pages individually to extract confirmed per-row fee/eligibility/duration and replace the blanket `open_to_international` inference with per-programme evidence.
- Query studyinindia.gov.in, AICTE facilities dashboard and the NIRF data-file PDF for Sharda to cross-check the sitemap list and surface any AICTE-approved intake not marketed on the public site.
- Resolve GAP rows against `lib/data/program-taxonomy.ts` with a human review pass (the fuzzy matcher over-matches on generic tokens like "science"/"technology" and under-matches highly specific specializations).
