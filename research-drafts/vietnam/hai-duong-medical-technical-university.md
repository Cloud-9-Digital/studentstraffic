# Hai Duong Medical Technical University (HMTU) — Research Draft (HOLD, not publish-ready)

- Country: Vietnam
- City: Hai Duong
- Vietnamese name: Truong Dai hoc Ky thuat Y te Hai Duong
- Official website: https://hmtu.edu.vn/
- Type: Public (Ministry of Health)
- Established: 1960 (as a Secondary Medical Technical School, 2-year program); upgraded to Medical Technical College in 2001 (3-year program); upgraded to full university status in 2007 by Prime Ministerial decision.

## Status: DO NOT PUBLISH

This draft is being held as a local research record only. It does **not** meet the publish gate in `scripts/publish-university-draft.ts` because no corroborated English-medium / international-student program could be found. See "Why this was not published" below.

## What the research found

HMTU is a Vietnamese Ministry of Health public university whose core mission is training the domestic Vietnamese healthcare workforce: general nurses, dental nurses, obstetrics/gynaecology nurses, anesthesia nurses, physiotherapists, medical laboratory technicians, and medical imaging technicians, plus (per some secondary aggregator listings) a medical doctor track. Per search-result summaries:

- Began training nurses/midwives at secondary level (2-year program) from 1960.
- From 2001, trained associate nurses (3 specializations: general, dental, anesthesia) and midwives on a 3-year program.
- From 2007, added a 4-year Bachelor of Nursing program.
- Since 2010, HMTU has used a credit-based training system for doctors, nurses, and medical technicians.
- Enrolls roughly 700-800 students per year; approx. 3,000 undergraduates total (per search-result summary of an aggregator site — not independently re-verified from a primary document).
- Domestic tuition for the Medical program was cited (via a Vietnamese tuition-fee news aggregator) at approximately 4,789,400 VND/month for 2026-2027 — this is a Vietnamese-medium domestic fee figure, not something usable for an India-facing page, and was NOT included in the draft.

## Why this was not published (gate failure — honest omission, not fabrication)

The publish gate requires, among other things:
- `structuredFacts.programs` with **>=1** program, each with an **explicit courseSlug** in `{mbbs, medical-pg, bsc-nursing, pharmacy, bds}`, a title, an **officialProgramUrl**, a **medium** of instruction, and **durationYears**.
- 8 non-empty, non-fabricated narrative fields addressing an India-audience student (summary, campus lifestyle, city profile, clinical exposure, hostel overview, Indian food support, safety overview, student support).
- `bestFitFor` (>=3), `whyChoose` (>=3), `thingsToConsider` (>=3), `faq` (>=3).

None of these can be honestly filled because:
1. **No English-medium program was found.** The official site (hmtu.edu.vn) is entirely in Vietnamese. No `/en/` or equivalent English section could be located or fetched. A legacy site path (`www.hmtu.edu.vn/Desktop.aspx/Introduction/Introduction/`) returned HTTP 404.
2. **No international/foreign-student admissions track was found.** Search queries specifically targeting "international students", "foreign students admission", and "Indian students" for HMTU returned no confirmed results — only a generic recommendation to "contact the university directly."
3. **No courseSlug-eligible program has a verifiable officialProgramUrl + medium + duration.** While HMTU clearly runs nursing, medical-technology, and (per secondary listings) medical-doctor training domestically, none of it is confirmed to be offered in English to international applicants, so it cannot be mapped to `bsc-nursing`, `mbbs`, `medical-pg`, `pharmacy`, or `bds` for this catalog's purposes.
4. Given the above, all 8 narrative content fields, `bestFitFor`, `whyChoose`, `thingsToConsider`, and `faq` would require inventing India-specific student-life details (hostel, Indian food, safety framed for foreign students, etc.) for a program that isn't confirmed to exist — which the sourcing rules explicitly forbid ("never fabricate").

## What was corroborated (kept in the JSON's structuredFacts, non-narrative only)

- Name, city, type (Public), establishedYear (1960), officialWebsite — these are corroborated by 3+ independent sources (official site, MOET recognised-institutions list, and multiple secondary listings agreeing on the 1960 founding / 2007 university-status upgrade).

## Sources consulted

1. **HMTU official website (Vietnamese)** — https://hmtu.edu.vn/ — fetched via curl; homepage only, no English section found.
2. **HMTU legacy site (404)** — http://www.hmtu.edu.vn/Desktop.aspx/Introduction/Introduction/ — returned HTTP 404 Not Found on direct fetch.
3. **Vietnam MOET recognised higher-education institutions list** — https://en.moet.gov.vn/recognised-higher-education-institutions/Pages/Universities.aspx — lists HMTU among recognised institutions (government corroboration of legitimacy/public status).
4. **studyinvietnam.edu.vn HMTU profile** — http://studyinvietnam.edu.vn/detail-university/university-of-hai-duong-medical-technical-279.html — surfaced via search-result summary (direct fetch failed with a connection error); described the 1960 founding and 2007 university-status upgrade.
5. **university.me HMTU programs listing** — https://www.university.me/university/hai-duong-medical-technical-university/programs — fetched via curl; aggregator listing, no explicit English-medium/international program details found.
6. **WholeNurseCatalog HMTU listing** — https://wholenursecatalog.com/listings/hai-duong-vietnam-hai-duong-medical-and-technical-university-hmtu/ — surfaced via search; corroborates public/Ministry-of-Health status and nursing/medical-technology training mission.
7. Additional general WebSearch queries run (not separately fetched, used to triangulate/confirm absence of an international track): "Hai Duong Medical Technical University international students admission Indian"; "hmtu.edu.vn English site about us / international cooperation"; "Hai Duong Medical Technical University for foreign students / tuition fee international"; "Hai Duong Medical Technical University nursing bachelor faculties departments".

## Recommendation

Hold this university out of the auto-publish pipeline. Do not seed it via `scripts/seed-university-draft.ts`. Revisit only if a future check finds HMTU has launched an English-medium program with confirmed international/Indian-student admissions (would need a fresh officialProgramUrl, medium-of-instruction confirmation, and duration before this could pass the gate).
