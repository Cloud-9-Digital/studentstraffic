# Witten/Herdecke University (Universität Witten/Herdecke) — Research Notes

Status: HELD — NOT PUBLISH-READY (ok=false)

## Why held

The publish gate requires at least one program with an explicit `courseSlug` in
`{mbbs, medical-pg, bsc-nursing, pharmacy, bds}`, each with a real, corroborated
`medium` of instruction and `durationYears`, framed for an India-audience
(NEET/NMC, PCI, or INC as applicable) ONLY where corroborated.

Multi-source research (official site + Wikipedia + independent aggregators)
consistently shows:

- Witten/Herdecke University's **Faculty of Health** offers **Medicine (Medizin,
  Staatsexamen / "model medicine programme")**, but it is taught **in German**,
  and the university's own program page states applicants need **German
  language proficiency at CEFR C1 level** to apply to the state-examination
  medicine programme. There is no English-medium MBBS-equivalent undergraduate
  track.
- There is **no undergraduate Nursing Science bachelor's degree taught in
  English** — UW/H's official "Degree Programmes taught in English" listing
  (https://www.uni-wh.de/en/uwh-international/university/degree-programmes-taught-in-english/)
  and bachelor's-programme listing show only German-medium bachelor's
  programmes (Management Bachelor is the one English-taught bachelor's;
  Health Care Management, Psychologie, PPÖ, Wirtschaft/Politik/Recht are
  German-medium). Nursing at UW/H exists as a research discipline within the
  Faculty of Health and at the master's level ("Community Health Nursing
  Master", "Pflegewissenschaft Master" — German-taught, master's entry, not
  equivalent to a BSc Nursing pathway for Indian 12th-pass students).
- **No Pharmacy, Dentistry (BDS), or Medical PG (English-medium, India-facing)
  program** was found at UW/H in any source consulted.
- The only English-taught bachelor's confirmed is **Management (B.Sc.)**,
  which falls outside the allowed `courseSlug` set for this pipeline (it is
  not a health/medical program).

Given the hard rule "EXHAUSTIVE-THEN-OMIT — never fabricate" and "assert
regulator relevance (NMC/PCI/INC) ONLY if corroborated," there is no honest
way to populate a qualifying `programs[]` entry without misrepresenting the
language of instruction or inventing an India-facing medical/health program
that does not exist at this institution. Per instructions, this draft is
being held rather than force-fit.

## Corroborated facts (for future reference / possible non-medical listing)

- **Name**: Witten/Herdecke University (Universität Witten/Herdecke), often
  abbreviated UW/H.
- **City**: Witten, North Rhine-Westphalia (Ennepe-Ruhr-Kreis), in the
  southern Ruhr area; Witten town population ~90,000+; well connected to
  Dortmund, Bochum, Herdecke by public transport.
- **Type**: Private, state-recognised, non-profit university.
- **Established**: 1982 — first private institution in Germany recognised by
  the Federal Government; first private German institution accredited as a
  "Universität" (full doctorate/Habilitation-granting rights).
- **Structure**: Three faculties — Faculty of Health (Medicine, Dentistry,
  Nursing Science, Psychology — the only German institution combining these
  four under one roof), Faculty of Business and Economics, Faculty of
  Cultural Reflection ("Studium fundamentale").
- **Scale**: ~2,500 students (2019 figure), 582 staff incl. 71 professors and
  232 lecturers/researchers.
- **Medicine programme**: "Model medical programme" (Modellstudiengang
  Medizin), state-recognized since 2000, Staatsexamen route (~6–6.5 years),
  strong patient-care/practical focus; German C1 required.
- **English-taught programmes** (per official UW/H international page):
  limited set incl. BSc Management, MA Philosophy Politics & Economics,
  MSc Management (Strategy & Organization), part-time MBA (Leadership &
  Management) — none in the health/medical space relevant to this pipeline's
  course taxonomy.
- **Housing**: No university-owned halls of residence / on-campus dorms;
  International Office assists with private shared-flat ("WG") housing in
  Witten and surroundings; student WhatsApp groups commonly used to find
  flat-shares.
- **International support**: International Office, welcome/induction week,
  German-language courses for internationals, Career Services.

## Sources consulted

- Official site (English international-students page):
  https://www.uni-wh.de/en/your-studies/international/international-students
- Official site (Degree Programmes taught in English):
  https://www.uni-wh.de/en/uwh-international/university/degree-programmes-taught-in-english/
- Official site (Medizin State Examination programme page, language
  requirement C1):
  https://www.uni-wh.de/en/studies/degree-programmes/state-examination-programmes/medizin-state-examination
- Official site (Living in Witten / accommodation):
  https://www.uni-wh.de/en/our-vibe/student-life/living-in-witten
- Wikipedia: https://en.wikipedia.org/wiki/Witten/Herdecke_University
- Wikipedia (city): https://en.wikipedia.org/wiki/Witten
- mygermanuniversity.com (English programmes list):
  https://www.mygermanuniversity.com/universities/Witten-Herdecke-University/english-programs
- privathochschulen.net (institutional fact sheet):
  https://www.privathochschulen.net/en/universities/north-rhine-westphalia/witten-herdecke-university
- medizinstudium.io (Medicine programme details, German-medium):
  https://www.medizinstudium.io/universitaet/witten-herdecke/

## Recommendation

Do not publish a health/medical program page for Witten/Herdecke University
under this pipeline's course taxonomy unless/until an official, English-
medium, India-relevant program (MBBS-equivalent, Pharmacy, BDS, BSc Nursing,
or Medical PG) is confirmed to exist. If a general "Study in Germany"
non-medical listing framework exists elsewhere in the codebase (e.g. for
Management/Business programs), this university could be reconsidered there,
but that is out of scope for this medical/health-focused research task.
