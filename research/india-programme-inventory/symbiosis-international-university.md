# Symbiosis International (Deemed University) — programme inventory sources

## Sources used
- Official programme catalogue (server-rendered via a filterable JS listing, read with the Browser pane since curl returns an empty shell): https://www.siu.edu.in/programmes/undergraduate (72 UG rows, 20 constituent institutes) and https://www.siu.edu.in/programmes/postgraduate (58 PG rows, 24 constituent institutes). This is SIU's own "Select Level / Campus / Faculty / Institute" filter page and is the most complete official list found — it enumerates every institute (SIBM, SCMHRD, SIIB, SIT, SICSR, SLS, SID, SIMC, SSLA, SSE, SSI, SIG, SSBS, SSCANS, SCON, SSSS, SIHS, SMCW, SAII, SCOP, SIOM, SSBF, SIMS, SIU Dubai) with the exact official titles used on the site.
- https://www.siu.edu.in/international-affairs/overview — Symbiosis Centre for International Education (SCIE) overview: confirms admission for Foreign National/NRI/OCI/PIO categories is centralised across the university (85+ countries, 47 institutes, campuses in Pune, Bengaluru, Noida, Hyderabad, Nagpur, Dubai), used as the blanket intl_evidence_url for this pass.
- Existing bundle payload for cross-check: content-migrations/0089-india-symbiosis-international-university/payload.json (5 canonical courses on site today: mba, llb, bachelor-liberal-arts, bachelor-media-communication, bdes — all single-campus Pune offerings, confirmed against scie.ac.in programme URLs already recorded in that payload's `officialProgramUrl` fields).
- Canonical course slugs: grepped from `content-migrations/*/payload.json` (51 distinct slugs) per docs/university-pipeline-architecture.md.
- NOT completed in this pass (time-boxed research-only task): Study in India portal (studyinindia.gov.in), AICTE facilities dashboard, the NIRF institutional data PDF, and the Shiksha/Collegedunia/Careers360 checklist cross-check. SIU's federation of ~24 separately-domained institute sites (scie.ac.in, scmspune.ac.in, symlaw.edu.in, sicsr.ac.in, scon.edu.in, sid.edu.in, scmsnagpur.edu.in, scmsbengaluru.edu.in, siib.ac.in, sibm.edu.in, scmhrd.edu.in, siom.ac.in, sibmnagpur.edu.in, sibmhyd.edu.in, slsh.edu.in, symlaw.ac.in, etc.) also means per-institute official fee/intake and Doctoral/Diploma/Certificate/Corporate-Education/Skills-Development/Online-Education programme tiers were not individually captured — only UG and PG (siu.edu.in/programmes/undergraduate and /postgraduate) were enumerated.

## Counts
- Total distinct rows: 130 (72 UG, 58 PG).
- By level: UG 72, PG 58. (Doctoral, Diploma, Certificate, Corporate Education, Skills Development, Online Education tiers exist on the site's level filter but were not enumerated — recommended follow-up.)
- By intl_status: open_to_international 129 (blanket SCIE evidence, per-programme intake cap/fee not individually re-verified); not_open 1 (B.Arch, under progressive closure from AY2025-26, no new admissions).
- MBBS (Symbiosis Medical College for Women) is flagged intl_status=unknown-adjacent in notes — regulator scope (NMC) likely requires a separate route from SCIE's standard Foreign National/NRI/OCI/PIO categories; needs direct verification with SMCW/SCIE before treating as a straightforward gap.

## Already on site vs missing
- Already on site: 6 rows matched to the 5 existing canonical offerings — MBA (SIBM Pune Lavale), B.A. LL.B. (Hons.) (SLS Pune), B.A./B.Sc. Liberal Arts Honours (SSLA Pune, 2 rows matched), B.A. Mass Communication (SCMC Pune), B.Des. (SID Pune).
- Missing (open_to_international but not on site): 124 rows. Highest-value gaps by volume: 9 MBA variants at other SIBM/SCMHRD/SIMS/SIIB/SIDTM/SSBF/SIOM campuses and specialisations (Business Analytics, International Business, Banking & Finance, Digital & Telecom Management, Operations Management, Executive, Innovation & Entrepreneurship); the full SIT engineering B.Tech/M.Tech stack (Civil, Mechanical, CSE, ECE, AI&ML, Robotics) which has zero canonical coverage today; the SIHS/SCON/SSCANS allied-health and nursing cluster (18 UG+PG programmes); LL.B./LL.M. at Noida, Hyderabad and Nagpur; and BBA/BCA at SCMS/SICSR (no canonical BBA or BCA course exists in the taxonomy at all).

## Top GAP canonical courses (no existing canonical slug fits)
- GAP:bba (9 rows — BBA across SCMS Pune/Bengaluru/Hyderabad/Nagpur/Noida/Dubai; no canonical `bba`/`bachelor-business-administration` slug exists)
- GAP:bachelor-allied-health-sciences (11 UG rows — SIHS paramedical/cardiovascular/respiratory/dialysis/radiology/anaesthesia/neuroscience/endoscopy/radiotherapy technology programmes)
- GAP:master-allied-health-sciences (7 PG rows — SIHS master's-level equivalents of the above)
- GAP:mtech-* (5 rows split across mtech-artificial-intelligence-machine-learning, mtech-engineering-design, mtech-automotive-technology, mtech-robotics-artificial-intelligence, plus geoinformatics)
- GAP:bca (2 rows), GAP:msc-geoinformatics (2 rows), GAP:master-international-studies, GAP:master-economics, GAP:bachelor-nutrition-dietetics, GAP:bachelor-culinary-arts, GAP:bachelor-sports-science, GAP:bsc-statistics-data-science, GAP:msc-nursing, GAP:msc-assisted-reproduction-embryology, GAP:nurse-practitioner-critical-care (1 row each).

## Follow-up needed before publishing
- Verify per-programme international intake cap, fee and eligibility via scie.ac.in (this pass used the university-wide SCIE overview page only).
- Enumerate Doctoral/Diploma/Certificate/Online-Education tiers if those are in scope.
- Confirm MBBS international-admission route (separate from SCIE's standard categories) before adding.
- Run the Study in India / AICTE / NIRF / aggregator cross-check that this pass skipped.
