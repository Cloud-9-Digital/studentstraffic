# Albanian University (Tirana) — Research Record

Status: ok=true, publish-ready draft written to `albanian-university.json` in this folder.

## Key facts (corroborated, multi-source)

- **Name:** Albanian University
- **City:** Tirana, Albania
- **Type:** Private
- **Established:** 2004 (licensed by Council of Ministers Decision No. 197, dated 10.04.2004, originally as private university "UFO dental"; renamed "UFO University" in 2009, then "Albanian University" in 2011 per Decision No. 603, dated 24.08.2011)
- **Official website:** https://albanianuniversity.edu.al/en/
- **Faculty of Medical Sciences:** opened in the 2010-2011 academic year; located mainly on "Durresi" Street (former Court Building) with teaching spread across several other university-owned buildings in Tirana ("Kajo Karafili" Street, "Kavaja" Street, "Zogu I" Boulevard, "Raiffeisen" Building).
- **Accreditation:** Programs accredited/re-accredited by Albania's national Quality Assurance Agency in Higher Education (ASCAL) — confirmed via ASCAL's own site and the university's department pages (e.g., Pharmacy accredited by MoES Order no. 462 dated 14.10.2010, re-accredited by ASCAL Decision no. 18 dated 02.03.2019; Dentistry accredited by MoES order no. 388 dated 23.07.2010, re-accredited by ASCAL Decision no. 88 dated 21.09.2017).
- **International cooperation:** Cooperation agreement with Leiden University Medical Center (Netherlands); Erasmus+ mobility; International Relations Office.

## Programs found (confirmed, official department pages)

1. **Integrated Master of Science in Pharmacy** — 5 academic years, 300 ECTS. Program started 2005-2006 (MoES approval no. 5663, dated 01.09.2005), reorganized 2009. → courseSlug: `pharmacy`
2. **Integrated Master of Science in Dentistry** — 5 years (2-year pre-clinical + 3-year clinical). Department established September 2004 (Council of Ministers Decision No. 197, dated 10.04.2004). Curriculum influenced by the Tufts University (Boston) model. → courseSlug: `bds`
3. Also offered (NOT included as structured programs — outside the target courseSlug set / insufficiently distinct for this pass): Bachelor in Nursing, Bachelor in Physiotherapy, Professional Master in Surgical Nursing, 2-year "Dental Technician" professional program, long-term specializations in Orthognathodontics and Oral Surgery.

## What was explicitly NOT found / OMITTED and why

- **No MBBS / general-medicine program.** The Faculty of Medical Sciences' official program list (Dentistry, Pharmacy, Nursing, Physiotherapy) does not include a "Doctor of Medicine" / general medicine track. This is stated clearly in the draft's `thingsToConsider` and FAQ rather than silently omitted, so prospective MBBS-seeking students are correctly redirected.
- **Tuition fees.** No official tuition figures for Pharmacy or Dentistry (for international/Indian students specifically) were found on the official department or admissions pages during this pass. Rather than fabricate a number, tuition was omitted entirely from `structuredFacts.programs` (no `annualTuitionUsd`/`officialAnnualTuitionAmount` fields set).
- **Language of instruction / English-track availability.** Official pages do not explicitly state an English-medium track for Pharmacy or Dentistry, and general admissions material indicates foreign applicants typically face an Albanian-language requirement. Rather than asserting "taught in English" (which appears untrue for this university, unlike Western Balkans University or University of Medicine, Tirana which do advertise English-taught medical programs), this is flagged as an open item for the student to confirm directly with the university's International Relations Office.
- **On-campus hostel/dormitory.** No dedicated hostel/dormitory program was found in official materials. This is disclosed honestly in `hostelOverview`/`thingsToConsider` rather than fabricated; private rental housing in Tirana is described instead, grounded in third-party cost-of-living sources.
- **Regulator framing (PCI etc.).** No PCI-specific recognition statement was found/asserted for this university's Pharmacy degree; the FAQ tells students to verify recognition with the regulator themselves rather than asserting recognition.

## Sources (all checked 2026-07-07)

1. Albanian University — official site (English): https://albanianuniversity.edu.al/en/
2. Albanian University — Faculty of Medical Sciences (official): https://albanianuniversity.edu.al/en/faculty-of-medical-sciences/
3. Albanian University — Department of Pharmacy (official): https://albanianuniversity.edu.al/en/pharmacy-department/
4. Albanian University — Department of Dentistry (official): https://albanianuniversity.edu.al/en/department-of-dentistry/
5. Albanian University — The Admission Criteria (official): https://albanianuniversity.edu.al/en/the-admission-criteria/
6. Albanian University — Wikipedia: https://en.wikipedia.org/wiki/Albanian_University
7. Quality Assurance Agency in Higher Education (ASCAL), Albania — Mission and Activity: https://www.ascal.al/en/about-us/mission-and-activity
8. Cost of Living in Tirana — Numbeo: https://www.numbeo.com/cost-of-living/in/Tirana
9. (Context only, not cited as a program source) City/cost-of-living and Indian-restaurant searches via general web search — Tirana overview, Indian restaurants (Chakra Indian Fusion, Orkidea Lounge Indian Cuisine).

## Gate check

Ran the same validation logic as `scripts/publish-university-draft.ts` (`validateDraft`) locally against the JSON: **0 issues**. Sources: 8, programs: 2, whyChoose: 4, thingsToConsider: 5, bestFitFor: 4, faq: 5. All 8 narrative fields present and free of weak-marker strings.

## Next step to actually publish

```
tsx scripts/seed-university-draft.ts --file research-drafts/albania/albanian-university.json
tsx scripts/publish-university-draft.ts --queue-id <id-printed-above>
```
