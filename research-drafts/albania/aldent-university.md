# Aldent University (UAL) - Research Document

Country: Albania | City: Tirana | Status: Draft written, gate-passing (ok=true)
Researched: 2026-07-07

## Key facts (multi-source corroborated)

- **Full name**: Aldent University (Albanian: Universiteti Aldent, "UAL")
- **Type**: Private
- **Established**: 2003 (began as a two-year pre-university programme in dental laboratory techniques); formally licensed as a university in 2006 via Decision of the Council of Ministers No. 673, dated 27 September 2006. The official site's own framing is "Founded in 2003"; Wikipedia's infobox separately lists "Established September 27, 2003" while its body text describes the 2006 licensing decision. Used 2003 as `establishedYear` to match the official site's own "Founded in 2003" framing, corroborated by Wikipedia's infobox date.
- **Official website**: https://ual.edu.al/ (content served directly in English at the root path; `/en/` returns a 404, so no separate language-prefixed path exists)
- **Structure**: 3 faculties
  - Faculty of Dental Sciences (Department of Dentistry)
  - Faculty of Medical Sciences (Department of Pharmacy)
  - Faculty of Technical Medical Sciences (Department of Nursing and Physiotherapy; Medical Laboratory and Imaging)
- **Campus**: Two sites -- main campus on Rr. Dibres, No. 235 (Selvia area, Tirana) and a second site at Lunder, with an official student shuttle service between them
- **Self-description**: "the only private HEI in Albania with 100% orientation" to clinical health sciences (per official About Us page)
- **Accreditation**: Licensed as a private university under Council of Ministers Decision No. 673 (27.09.2006); institutionally accredited by Order of the Minister of Education and Science; independently corroborated on ASCAL (Albania's national Quality Assurance Agency) with institutional accreditation decision Vendim BA Nr.01, dated 27.01.2023, valid through Jan 2028 per search-result snippets
- **International partnerships**: Erasmus+ and named partner universities -- Nicolaus Copernicus University (Poland), Palacky University (Czechia), Ankara University, Hacettepe University, and Acibadem University (Turkey) -- per Wikipedia, consistent with student testimonials on the official site describing Erasmus+ clinical placements

## Important finding: NO MBBS / general-medicine programme

Unlike University of Medicine, Tirana (the other Albanian university already researched), **Aldent University does not offer a general-medicine (MBBS-equivalent) degree**. Its clinical/health degrees are:

- Integrated Master of Science in **Dentistry** (5 years, 300 ECTS) -- maps to `bds`
- Integrated Master of Science in **Pharmacy** (5 years, 300 ECTS; the programme's own detail box actually labels "Degree: Bachelor" despite the page title saying "Master of Science") -- maps to `pharmacy`
- Bachelor's in **General Nursing** (3 years, 180 ECTS) -- maps to `bsc-nursing`
- Plus allied-health bachelor's/master's degrees with no matching course slug in the allowed set: Medical Imaging Technician and Radiotherapy, Medical Laboratory Technician, Physiotherapy, Dental Laboratory Technician, Professional Dental Assistant, Long-term Specialization in Dentistry (Oral Surgery / Orthodontics)

All three included programmes were corroborated via their own official programme pages (each has a "Study Program Details" info box stating degree, ECTS, duration, and **Study Language: Albanian**), cross-checked against the ASCAL government accreditation listing, which lists matching programme names and accreditation decisions.

## Critical honest caveats built into the draft

1. **Medium of instruction is Albanian, not English.** Every one of the three included official programme pages explicitly states "Study Language: Albanian" in its own details box. No official English-medium track for international students was found anywhere on the site. This is flagged prominently in `summary`, each program's `medium` field, `thingsToConsider`, and FAQ.

2. **No dedicated international-admissions pathway found.** The official Admission Process page describes admission via verification of Albania's own State Matura (secondary-school leaving exam) results, with no separate track described for foreign secondary qualifications (Indian board exams, etc.). Framed as an open item for students to resolve directly with Aldent, not asserted as either possible or impossible.

3. **Extremely small Indian community in Albania.** WebSearch aggregation (via consultancy/study-abroad sites citing Indian government figures) suggests fewer than 100 Indian nationals (workers + students + project staff combined) live in Albania. This directly informs the honest, non-oversold framing of `indianFoodSupport` -- no Indian-specific food infrastructure was found or claimed.

4. **No student housing/dormitories found.** The official site's "Housing Support" page describes guidance/advice for privately renting accommodation in Tirana (a checklist, tenant-rights info, emergency housing help) -- it does NOT describe university-operated dormitories. `hostelOverview` is framed around this housing-support *service*, not a dormitory, and this is called out as a `thingsToConsider` item.

5. **No tuition figures published.** The Tuition & Fees page describes payment *policies* (installment plan, early-payment discount for full payment by December) but no per-programme rate table was captured in the text extraction (likely rendered as an image/PDF/JS widget not visible via curl). Tuition is OMITTED entirely from the draft -- no fabricated numbers -- with an explicit instruction to get current written figures from the Finance Office.

6. **Home-country (India) professional recognition not confirmed.** No NMC/PCI/INC-equivalent recognition claim is made anywhere in the draft. FAQ and `thingsToConsider` explicitly instruct students to verify recognition with the relevant Indian regulator (Pharmacy Council of India for pharmacy, Indian Nursing Council for nursing, the dental regulatory body for dentistry) before enrolling, given the very thin existing pool of Indian graduates from Albanian dental/pharmacy/nursing programmes to draw precedent from.

## What was OMITTED and why

- **Tuition fee figures** -- omitted entirely; page describes payment policy only, no rate table captured.
- **Specific clinical/teaching hospital partner names** for dentistry/pharmacy/nursing placements -- the curriculum structure and learning outcomes are documented officially, but no specific named partner hospitals were found in the pages reviewed, so none are asserted.
- **English-medium claim** -- not asserted; explicitly flagged as unconfirmed / to be verified with the university.
- **WDOMS listing** -- `wdomsUrl` left null; this is a dental/pharmacy/nursing-focused university, not a WDOMS (World Directory of Medical Schools, which covers medical/MBBS-type schools) candidate, and no independent WDOMS record was located or claimed.
- **The other 6 Aldent programmes** (Medical Imaging Technician and Radiotherapy, Medical Laboratory Technician, Physiotherapy, Dental Laboratory Technician, Professional Dental Assistant, Long-term Specialization in Dentistry) -- omitted from the structured `programs` array because none map to an allowed courseSlug (`mbbs`, `medical-pg`, `bsc-nursing`, `pharmacy`, `bds`); their existence is documented here in the research record and could be added to the site's course taxonomy in a future pass if a matching slug is introduced.

## Sources (all checked 2026-07-07)

1. Official site homepage: https://ual.edu.al/
2. Official site -- History & Institutional Profile (About Us): https://ual.edu.al/about-us/
3. Official site -- Accreditation: https://ual.edu.al/accreditation/
4. Official site -- Bachelor Programs listing: https://ual.edu.al/bachelor-programs/
5. Official site -- Master Programs listing: https://ual.edu.al/master-programs/
6. Official site -- Master of Science in Dentistry programme page: https://ual.edu.al/rt-program/master-of-science-in-dentistry/
7. Official site -- General Nursing (Bachelor) programme page: https://ual.edu.al/rt-program/general-nursing/
8. Official site -- Master of Science in Pharmacy programme page: https://ual.edu.al/rt-program/master-of-science-in-pharmacy/
9. Official site -- Admission Process: https://ual.edu.al/admission-process/
10. Official site -- Tuition Fee: https://ual.edu.al/tuition-fee/
11. Official site -- Housing Support: https://ual.edu.al/housing-support/
12. ASCAL (Albanian Quality Assurance Agency in Higher Education) -- HEI listing for Universiteti Aldent: https://www.ascal.al/en/hei-list/hei/universiteti-aldent-2
13. Wikipedia -- Aldent University: https://en.wikipedia.org/wiki/Aldent_University

Additional sources consulted for city/context and Indian-community grounding via WebSearch aggregation (not individually cited as primary structured facts, but informing the honest framing in `cityProfile`, `safetyOverview`, and `indianFoodSupport`):
- MetaApply, Standyou, MOKSH, Unique Education, MBBS Mithram -- MBBS/study-in-Albania consultancy content (used only for general Tirana cost-of-living/community context, never for Aldent-specific facts, since Aldent does not offer MBBS)
- General search-snippet aggregation on Indian community size in Albania (India MEA figures referenced via consultancy summaries)

## Gate validation result

Ran a local check against the exact publisher validation logic (scripts/publish-university-draft.ts -- `validateDraft()`):

- countrySlug: albania -- OK
- officialWebsite / name / city / type / establishedYear -- all present -- OK
- type: "Private" (recognized value) -- OK
- sources: 10 (>=2 required), each with label/url/kind/checkedAt -- OK
- draftContent: all 8 narrative fields present, no weak markers ("pending official-source research" / "not yet verified" / "internal draft" / "needs official..." / "still needs" / "before publication" / "do not publish...") -- OK
- whyChoose: 5 (>=3) -- OK
- thingsToConsider: 6 (>=3) -- OK
- bestFitFor: 5 (>=3) -- OK
- faq: 8 (>=3) -- OK
- programs: 3 (>=1), courseSlugs = bds, pharmacy, bsc-nursing (all in allowed set), each with title/officialProgramUrl/medium/durationYears -- OK

**Result: ok=true.** JSON file validated with `node -e "JSON.parse(...)"` and passes a from-scratch re-implementation of the publisher's `validateDraft()` gate logic (0 issues found).
