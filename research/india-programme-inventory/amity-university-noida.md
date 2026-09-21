# Amity University Noida — programme inventory (research only, 2026-09-21)

## Sources used

1. **Official site — full programme listing** (primary): https://noida.amity.edu/all-programs
   — Amity's own "Find Your Program" catalogue for the Noida campus. The listing loads via a
   client-side fetch after page load (`curl` returns only a "Loading..." placeholder), so it was
   read with a headless browser after the fetch resolved. It returned 422 distinct programme title
   strings spanning UG, PG, Integrated, Doctoral, Diploma and Certificate — the largest and most
   authoritative single source found for this institution; no pagination or "load more" control
   was present, so this is treated as Amity Noida's full current catalogue.
2. **Official site — international/NRI admissions**: https://amity.edu/admission-procedure-nri.aspx
   and https://amity.edu/noida/international-students.aspx. Corroborated via WebSearch: "the
   eligibility criteria remains the same for foreign applicants as applicable for Indian resident
   applicants" and "international students can apply to the same programmes available to Indian
   students" — i.e. Amity does not publish a programme-restricted international eligibility list;
   admission is university-wide subject to the same academic eligibility plus AIU equivalence,
   visa and document requirements.
3. **Existing published bundle**: `content-migrations/0092-india-amity-university-noida/payload.json`
   — 5 programmes already live on our site (B.Tech CSE, B.Tech AI, MBA, BA LLB Hons, B.Des Product
   Design).
4. **studyinindia.gov.in** — not separately queried per-programme for Amity in this pass (time
   budget prioritised the far larger official catalogue); Amity Noida is a known Study-in-India
   partner institution generally, but no institution-specific programme extract was pulled, so
   `other_sources` is left blank rather than guessed.
5. **AICTE / NIRF** — **unreachable** for the same reason as CHRIST: AICTE's facilities dashboard
   is a session-gated search UI with no stable per-institution deep link, and Amity Noida's NIRF
   submission PDF was not located within the time available via WebSearch or curl. Neither was
   used as a source for this pass.
6. **Aggregators (checklist only)** — not separately queried; the official catalogue already
   returned a very large superset of programmes, so no programme in this CSV was sourced from an
   aggregator only (no `aggregator_only_unconfirmed` rows).

## Counts

- **Total programme rows: 422** (deduplicated by exact title from the official listing; several
  titles repeat 2-3 times in the raw scrape, most plausibly campus/specialisation variants not
  separately labelled in plain text — flagged in `notes`).
- By level: UG 193, PG 191, Diploma 17, Integrated 13, Certificate 5, Doctoral 3 (Amity Noida's
  research-degree programmes are mostly listed as PhD-integrated masters or Psy.D. rather than a
  large standalone PhD block, unlike CHRIST).
- By intl_status: `open_to_international` 422, `not_open` 0, `unknown` 0 (see methodology note).
- Already on our site: **5** (amity-noida-btech-computer-science-engineering,
  amity-noida-btech-artificial-intelligence, amity-noida-mba, amity-noida-ba-llb-hons,
  amity-noida-bdes-product-design).
- Missing (open_to_international and not yet on site): **417**.
- GAP canonical courses: 417 rows tagged `GAP:amity-noida-*`. Top clusters by volume: BBA/MBA
  specialisation variants (~35 rows: FinTech, Business Analytics, Real Estate, Healthcare
  Management, Construction, Agribusiness, etc.), B.Tech/M.Tech engineering specialisations (~30
  rows: Aerospace, Avionics, VLSI, Nanotechnology, Space Science, Defence Technology, Mechatronics),
  MSc/BSc science specialisations across biotech/forensic/neuroscience/pharma/physics/chemistry
  (~90 rows), law LLM specialisations (~10 rows), design (B.Des/M.Des/BFA/MFA) variants (~15 rows),
  special-education / B.Ed integrated variants (~15 rows), and 15 explicit "(International)" /
  "3 Continent" cohort variants of otherwise-existing degrees (see below).

## Methodology notes / limitations

- **intl_status**: Amity's official position (per its NRI/international admission pages) is that
  the *same* eligibility and programme range applies to international applicants as to Indian
  applicants — there is no separate restricted list. All 422 rows are therefore marked
  `open_to_international` on that university-wide policy basis, the same approach used for CHRIST.
  A subset of 15 titles is explicitly tagged by Amity itself as international-cohort variants
  (e.g. "B.Tech(Computer Science Engg. - International)", "BBA(International)", "MBA(International)",
  "B.Sc. (Hons) - Biotechnology (International)", and several "3 Continent" titles for BBA/B.Tech/
  MBA/B.A. International Relations/B.A. Applied Psychology) — these get the strongest possible
  evidence (the listing page itself names them as international-track programmes) and are flagged
  in `notes`; before publishing, confirm whether these are separate admissions from the base
  programme (candidate GAP rows in their own right) or simply an international-delivery mode of
  the base programme already counted separately in the CSV.
- **Duplicates**: raw titles that repeated verbatim (e.g. "M.A. (Clinical Psychology)" appearing as
  both a 2-year and a "(1Yr)" variant, several MSc "(1Yr)" bridge programmes for non-cognate entry)
  were kept as distinct rows only when the title text differs (e.g. "M.Sc. (Biotechnology)" vs
  "M.Sc. (Biotechnology) (1Yr)" are two separate rows, correctly, since the (1Yr) variants are
  genuinely separate shorter programmes for students with a relevant bachelor's degree). Exact
  duplicate strings were deduplicated to one row with a count note.
- Pure-PhD rows: Amity Noida's catalogue does not expose a large flat PhD-by-subject block the way
  CHRIST's does; the closest analogues (Integrated MSc-PhD Biotechnology, Psy.D. Clinical
  Psychology) are kept as their own rows since they are UG/PG-adjacent professional-research
  degrees, not excluded.
