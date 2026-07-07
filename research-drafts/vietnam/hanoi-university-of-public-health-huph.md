# Hanoi University of Public Health (HUPH) - Research Record

**Country:** Vietnam
**City:** Hanoi (1A Duc Thang Road, North Tu Liem / Bac Tu Liem district)
**Status:** HELD - NOT publish-ready (`ok=false`)
**Researched:** 2026-07-07
**Draft JSON:** `research-drafts/vietnam/hanoi-university-of-public-health-huph.json`

## Summary of finding

HUPH (Truong Dai hoc Y te cong cong) is a Vietnamese Ministry of Health public university
specializing in **public health training and research** -- it is not a clinical
medicine, nursing, pharmacy, or dentistry school. Its own official 2026 admissions
decree confirms that every currently offered program (undergraduate, master's,
doctoral, specialist) is Vietnamese-medium with domestic-only admission routes.
No corroborated English-medium program or general international/Indian-student
admissions pathway exists in any of the required course categories for this site
(`mbbs`, `medical-pg`, `bsc-nursing`, `pharmacy`, `bds`). Per the exhaustive-then-omit,
never-fabricate rule, this draft is held rather than published.

## Key corroborated facts

- **Founding lineage:** predecessor "Health Management Cadre School" founded 1976
  (Ministry of Health); Public Health Faculty established within it in 1990 and
  joined the Asia-Pacific Academic Consortium for Public Health; first Vietnamese
  Master's in Public Health cohort in 1997 (with Rockefeller Foundation / US CDC
  support).
- **University established:** 26 April 2001, by Prime Ministerial decision.
- **English name adopted:** October 2016 ("Hanoi University of Public Health (HUPH)").
- **International network membership:** joined the tropEd Network for Education in
  International Health in May 2008 and began receiving international students
  (exchanges referenced with Tulane, Emory, Johns Hopkins historically; more
  recently Simon Fraser University, Canada).
- **Campus move:** relocated to a new campus in Bac Tu Liem district, Hanoi, on
  1 November 2016 (Atlantic Philanthropies-supported).
- **Scale:** ~19 training programs from undergraduate to postgraduate; ~160 faculty
  (mostly Master's/PhD holders, many trained abroad).
- **2026 official program roster** (per Quyet dinh so 314/QD-DHYTCC, 28 May 2026):
  7 undergraduate majors, 5 master's majors, 2 doctoral majors, 2 specialist programs.
  2026 regular-track undergraduate intake: Public Health, Nutrition, Social Work,
  Rehabilitation Technique, Medical Laboratory Technique, Data Science -- all via
  Vietnamese domestic admission routes (direct admission, THPT transcript-based,
  2026 national high-school exam, or, for Data Science only, Hanoi National
  University's aptitude test).

## What was checked for an India-facing program (and why it was NOT used)

1. **"Master of Public Health International Program" (English, IELTS 5.5, One
   Health / Health Economics / Reproductive Health tracks, est. 2015).** This
   surfaced repeatedly in searches for "Hanoi public health MPH international"
   and could easily be mistaken for an HUPH program. Cross-checked via
   `spmph.edu.vn` and `sdh.hmu.edu.vn` and confirmed to belong to **Hanoi Medical
   University's School of Preventive Medicine and Public Health (SPMPH)**, located
   at 1 Ton That Tung, Dong Da district -- a **separate institution** from HUPH
   (1A Duc Thang Road, Bac Tu Liem district). Not attributed to HUPH in this draft.

2. **Standyou.com aggregator listing** ("B.Sc in Public Health" and "B.Sc in
   Genetics," English-medium, 4-year, Class-12 entry, attributed to HUPH). This
   contradicts HUPH's own official 2026 admissions decree (Vietnamese-medium,
   domestic-only admission for the equivalent Cu nhan Y te cong cong program) and
   could not be corroborated on the official site or in any second independent
   source. Treated as unverified low-confidence aggregator content and
   **not used** to populate `structuredFacts.programs`.

3. **tropEd membership and student-exchange programs** (e.g. with Simon Fraser
   University) are genuine and corroborated on HUPH's own site, but these are
   network/exchange arrangements, not a distinct HUPH degree program with its own
   official program page, explicit medium of instruction, and duration -- so they
   cannot be turned into a `structuredFacts.programs` entry either.

## Why the publish gate cannot be honestly met

- No program in the required `courseSlug` set (`mbbs`, `medical-pg`,
  `bsc-nursing`, `pharmacy`, `bds`) can be populated with a corroborated
  `officialProgramUrl`, medium of instruction, and duration.
- Since `structuredFacts.programs` must stay empty, `bestFitFor` (needs >=3,
  India-audience-specific) cannot be honestly written either.
- All 8 narrative `draftContent` fields (summary, campusLifestyle, cityProfile,
  clinicalExposure, hostelOverview, indianFoodSupport, safetyOverview,
  studentSupport) plus `whyChoose`/`thingsToConsider`/`faq` would require
  fabricating an India-facing admissions story (clinical exposure, hostel life
  framed for foreign MBBS/nursing/pharmacy students, NMC/PCI/INC-relevant
  recognition framing) that has no factual basis for this specific university.
  Left empty per the no-fabrication rule.

## Sources (all URLs checked 2026-07-07)

1. HUPH official website home page - https://huph.edu.vn/ (official-university)
2. HUPH official site, About Us / history page - https://huph.edu.vn/page/about-us (official-university)
3. HUPH official 2026 undergraduate admissions notice - https://tuyensinh.huph.edu.vn/post/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-nam-2026 (official-university)
4. Hanoi University of Public Health - Wikipedia (English) - https://en.wikipedia.org/wiki/Hanoi_University_of_Public_Health (other)
5. tropEd (Network for Education in International Health) - HUPH member institution profile - https://troped.org/2020/08/06/hanoi-university-of-public-health-huph/ (other)
6. Standyou.com - Hanoi University of Public Health, Vietnam study-abroad listing - https://www.standyou.com/study-abroad/hanoi-university-of-public-health-vietnam/ (other, lower confidence, disambiguated/rejected claims noted above)
7. Hanoi Medical University SPMPH - Master of Public Health International Program call for applications - https://spmph.edu.vn/en-GB/article/news/call-for-application-academic-year-2023-2025-master-of-public-health-international-program (other; used to disambiguate/reject mis-attribution to HUPH)
8. HUPH official site - "Why did you choose HUPH" enrollment page - https://huph.edu.vn/post/why-did-you-choose-huph (official-university)

## Revisit condition

Revisit if/when HUPH's official site (or a corroborating second source) confirms
a specific English-medium degree program, open to international/Indian
applicants, in one of the required course categories (MBBS, postgraduate
medicine, BSc Nursing, Pharmacy, or BDS), with an explicit official program URL,
medium of instruction, and duration.
