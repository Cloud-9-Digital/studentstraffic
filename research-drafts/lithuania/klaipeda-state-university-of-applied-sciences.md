# Research Document — Klaipėda State University of Applied Sciences (KVK)

Country: Lithuania | City: Klaipėda | Status: PUBLISH-READY (ok = true)
Researched: 2026-07-07

## Key Facts (corroborated, multi-source)

- **Full name**: Klaipėdos valstybinė kolegija / Higher Education Institution — Klaipėda State University of Applied Sciences (KVK)
- **Type**: Public university of applied sciences (kolegija)
- **Established**: 2009 — formed by the merger of Klaipėda College and Klaipėda Business and Technology College. KVK traces extended institutional roots to a teacher-training school founded in 1902 (this "century of experience" framing appears on KVK's own homepage), but the entity in its current form dates to the 2009 merger. Corroborated by Mastersportal/Bachelorsportal listing in addition to KVK's own "About KVK" history page.
- **Structure**: Three faculties — Business, Technologies, and Health Sciences. Third-largest higher education institution in Lithuania (KVK official site + studyin.lt independent portal both state this).
- **Official website**: https://www.kvk.lt/en/
- **Address**: Jaunystės street 1, LT-91274, Klaipėda, Lithuania

## Programs

Only one clinically relevant program exists for the India-outbound MBBS/medical-pg/nursing/pharmacy/BDS audience:

- **General Practice Nursing** → mapped to courseSlug `bsc-nursing`
  - Qualification: Professional Bachelor of Health Sciences, General Nurse
  - Duration: Full-time, 3.5 years
  - Language: Lithuanian **or** English (KVK's own page lists both — cohort-dependent; must be confirmed per intake)
  - Annual tuition fee (as listed on official page at check time): EUR 3,540
  - Programme code: 6531GX002
  - Curriculum: 108 credits covering anatomy & physiology, pharmacology, medical/surgical/child/community/mental-health nursing, emergency & intensive care, applied research; ~50% of study time is practical (clinical simulation labs + real hospital/community placements)
  - Admissions weighting: Biology 40%, Chemistry/Mathematics/IT/Physics 20%, non-overlapping subject 20%, English language 20%
  - Source: https://www.kvk.lt/en/program/general-practice-nursing/

KVK does **not** offer MBBS, Doctor of Medicine, Pharmacy, or BDS programs. This was confirmed by reviewing the full program directory at https://www.kvk.lt/en/program/ (26 programs listed across all three faculties — Accounting, Hospitality Administration, Automobile Transport Engineering, Construction Engineering, Cosmetology, Dental Assisting, Dental Hygiene, Dietetics, Digital Marketing, Electrical & Automation Engineering, Finance, Food Technologies, **General Practice Nursing**, Informatics, Informatics Engineering, Logistic Management, Management of Organizations, Mechanical Engineering, Midwifery, Pedagogy of Primary Education (x2 language variants), Physiotherapy, Pre-school Pedagogy, Real Estate Measurement Engineering, Social Work, Systems Administration, Tourism Business). None of these map to mbbs/medical-pg/pharmacy/bds course slugs.

## Dormitory / Hostel

- **Debreceno Taikos Dormitory** — Debreceno g. 25, southern Klaipėda
- Double and triple rooms in shared blocks (one double + one triple room per block, shared hallway/toilet); showers and kitchens per floor
- Facilities: small gym, recreation areas (table tennis, foosball, board games), free self-service laundry, bicycle storage, video surveillance
- Price: EUR 80–140/month (as listed at check time)
- International-student placements are **limited** — allocated via request to the dormitory administrator, not automatic
- Source: https://www.kvk.lt/en/dormitories/

## City Context — Klaipėda

- Lithuania's third-largest city and its only major seaport; sits where the Curonian Lagoon meets the Baltic Sea (Britannica)
- Busiest port in the Baltic states; major industries include shipbuilding/repair, deep-sea fishing fleet, textiles, pulp/paper, timber, amber jewelry
- Gateway to the Curonian Spit, a UNESCO World Heritage sand-dune peninsula, reached by short ferry
- Historic Old Town with half-timbered Prussian-era architecture
- Generally described as calmer-paced and more affordable than Vilnius

## What Was OMITTED and Why

- **Specific current-year tuition figure as a guaranteed number**: Included the EUR 3,540/year figure but explicitly flagged it as "at time of research, reviewed annually — reconfirm for the intake year" rather than asserting it as a fixed, permanent number. Not fully omitted since it was directly confirmed on the official program page, but caveated per the "honest feeNotes" rule.
- **Teaching hospital names**: KVK's program page describes practical placements happening in "hospitals of various profiles, healthcare centres, communities and patient home environment" but does not name specific partner hospitals for the nursing program on the pages reviewed. Rather than fabricate hospital names, `teachingHospitals` was left as an empty array and the clinicalExposure narrative field explicitly tells students to confirm current placement sites with KVK's Nursing and Social Welfare Department.
- **Indian Nursing Council (INC) automatic recognition claim**: General web research on INC's equivalency process confirms recognition of foreign nursing qualifications is case-by-case (per Section 11(2)(a) of the INC Act), not automatic, and no Lithuania-specific INC ruling was found. The draft explicitly avoids asserting INC recognition and instead tells students to verify eligibility with INC directly before enrolling.
- **Indian community/Indian food scene in Klaipėda specifically**: No corroborated evidence of an established Indian student community or Indian grocery/restaurant scene in Klaipėda (unlike bigger hubs). The `indianFoodSupport` field is honestly framed around general supermarket staples and dormitory self-cooking, explicitly noting the smaller community size, rather than fabricating an Indian-food ecosystem.
- **recognitionBadges / recognitionLinks**: No WHO/NMC/other formal recognition-listing data specific to KVK's nursing program was found in this research pass; left as empty arrays rather than invented.
- **similarUniversitySlugs**: Left empty — no cross-reference research was done against other already-published DB entries in this pass.
- **MBBS/medical-pg/pharmacy/bds programs**: Omitted entirely (not applicable) since KVK's program catalogue confirms it runs no such programs; only the nursing program is listed under `structuredFacts.programs`.

## Full Source List

1. **KVK official site — General Practice Nursing programme page** — https://www.kvk.lt/en/program/general-practice-nursing/ (official; checked 2026-07-07) — qualification, duration, language, tuition, subjects, admissions weighting, career outcomes.
2. **KVK official site — About KVK** — https://www.kvk.lt/en/about-kvk/ (official; checked 2026-07-07) — institutional history, "century-long tradition," third-largest HEI claim.
3. **KVK official site — Dormitories** — https://www.kvk.lt/en/dormitories/ (official; checked 2026-07-07) — Debreceno Taikos dormitory details, pricing, facilities, international-student placement process.
4. **Study in Lithuania (national HE promotion portal) — KVK institution profile** — https://studyin.lt/institutions/klaipedos-valstybine-kolegija-higher-education-institution/ (secondary/independent; checked 2026-07-07) — independent corroboration of institutional scale, program list/durations, Erasmus charter, address.
5. **Mastersportal/Bachelorsportal — KVK institution listing** — https://www.mastersportal.com/universities/9493/klaipdos-valstybin-kolegija-higher-education-institution.html (secondary; checked 2026-07-07) — corroborates 2009 merger origin story.
6. **Encyclopaedia Britannica — Klaipėda (city)** — https://www.britannica.com/place/Klaipeda (secondary; checked 2026-07-07) — city/port context facts.

Additional general (non-institution-specific) background searches used for honest caveats, not cited as per-fact sources in the JSON sourceBundle:
- Indian Nursing Council equivalency process — https://www.indiannursingcouncil.org/equivalency
- General Klaipėda/Curonian Spit travel context — https://en.wikipedia.org/wiki/Klaip%C4%97da, https://tourismattractions.net/lithuania/klaipeda

## Gate Validation

Ran a local Node script re-implementing `scripts/publish-university-draft.ts`'s `validateDraft` checks against the saved JSON: **0 issues** — countrySlug, name, city, type, establishedYear, officialWebsite, >=2 sources (each with label/url/kind/checkedAt), all 8 narrative fields present and free of weak markers, whyChoose/thingsToConsider/bestFitFor/faq each >=3, and the one program has a valid courseSlug (`bsc-nursing`), title, officialProgramUrl, medium, and durationYears.

## Publish Command (when ready)

```
tsx scripts/seed-nonwdoms-draft.ts --file research-drafts/lithuania/klaipeda-state-university-of-applied-sciences.json
tsx scripts/publish-university-draft.ts --queue-id <id returned above>
```
