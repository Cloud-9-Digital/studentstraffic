# CHRIST (Deemed to be University) — programme inventory (research only, 2026-09-21)

## Sources used

1. **Official site — full course index** (primary): https://christuniversity.in/our-programmes/All/1
   — the site's own "Course Index" (linked from every page footer/menu). Rendered via headless
   browser because the listing is client-side JS (the static HTML served to `curl` does not
   contain it — CHRIST does not expose the `ajax_course.php` / `get_common_content.php` style
   endpoint referenced in the task brief at any discoverable path; `/js/functions.js` and
   `/js/custom.js` were inspected and contain no course-fetch endpoint either). This page returned
   ~200+ distinct programme titles spanning UG, PG, Integrated, Diploma/Certificate and Doctoral
   in one unpaginated list — treated as CHRIST's authoritative current catalogue.
2. **Official site — international admissions**: https://christuniversity.in/center/C/IS/apply-tochrist
   and https://m.christuniversity.in/international-students/study-abroad-programmes-and-services
   — both state international admission (Foreign citizens / PIO / OCI) is open under one
   "International Student Category" process **without naming an excluded-programme list**, and the
   mobile international-students page explicitly says "Applications are open for all UG, PG and
   Doctoral programmes." No page was found that restricts eligibility to a subset of programmes.
3. **Existing published bundle**: `content-migrations/0100-india-christ-university/payload.json` —
   7 programmes already live on our site, each with a confirmed per-programme "Other Foreign
   Nationals" USD fee tier (used as the strongest per-programme evidence available).
4. **studyinindia.gov.in** — confirmed via WebSearch that CHRIST is a Study-in-India partner
   institution and reiterates the "open to all UG/PG/Doctoral" admission scope; the portal's own
   per-institution programme list page was not reachable without an authenticated session, so it
   was used only as a corroborating source (`other_sources = studyinindia`), not as a primary list.
5. **AICTE (facilities.aicte-india.org)** — **unreachable**: the AICTE dashboard is a
   JS/session-gated search form with no stable per-institution deep link; WebSearch and curl both
   failed to return CHRIST's approved-programme/intake extract. Not used.
6. **NIRF (nirfindia.org)** — **not retrieved**: CHRIST's NIRF data-submission PDF requires
   navigating a ranking-year picker with no direct URL found in the time available. Not used.
7. **Aggregators (checklist only)** — Shiksha/Collegedunia/Careers360 were not separately queried
   per-programme given the official Course Index already returned a very large superset; no
   programme was sourced from aggregators only, so no `aggregator_only_unconfirmed` rows appear
   for CHRIST.

## Counts

- **Total programme rows: 239** (202 non-PhD + 37 PhD subject lines, deduplicated by title from a
  raw scrape that contained several exact-duplicate titles — see note below).
- By level: UG 111, PG 79, Doctoral 38, Diploma 5, Integrated 4, Certificate 2.
- By intl_status: `open_to_international` 239 (see methodology note), `not_open` 0, `unknown` 0.
- Already on our site: **7** (christ-btech-computer-science-engineering, christ-btech-mechanical-engineering,
  christ-btech-electrical-electronics-engineering, christ-mba, christ-msc-data-science,
  christ-msc-clinical-psychology, christ-ma-media-communication-studies).
- Missing (open_to_international and not yet on site): **232**.
- GAP canonical courses (no existing canonical course slug fits): 232 rows are tagged `GAP:christ-*`
  (includes the 38 PhD rows tagged `GAP:christ-phd-*`). Top clusters by volume: BA/BSc Honours
  variants with double-major or minor combinations (~40 rows), BCom/BBA specialisation variants
  (~25 rows), MSc specialisation variants — Clinical Psychology, Data Science/AI, Counselling
  Psychology, Chemistry, Physics etc. (~30 rows), M.Tech specialisations (6 rows), dual/joint
  degrees with Steinbeis/THWS/Western Michigan/Virginia Commonwealth (6 rows), PhD subjects (38).

## Methodology note / limitation (intl_status)

CHRIST does not publish a single central list that names which specific programmes admit
international students; instead, every individual programme detail page it publishes (the
`/courses/<base64>` URL pattern, confirmed in the payload's `officialProgramUrl`s) that was
checked carries an explicit "Other Foreign Nationals" / SAARC-Africa-ASEAN USD fee tier, and the
university-wide international-admissions pages state eligibility is not programme-restricted.
Given ~200 programmes, checking each individual programme detail page for its own fee tier was not
feasible in this pass, so **all non-PhD rows are marked `open_to_international` on the strength of
the university-wide policy statement**, and PhD rows are marked the same way based on the explicit
"open for all UG, PG and Doctoral" wording, with a caveat note that PhD in practice usually needs
separate research-visa/supervisor sponsorship. Before publishing any specific new programme, its
own detail page should be re-checked for a live USD/international fee tier as the payload does for
the 7 already-published rows.

## Duplicate-title caveat

The raw Course Index scrape contained a number of exact-duplicate titles (e.g. "Master of Business
Administration (MBA)" appeared 5 times, several BA/BArch/BCA/Law titles appeared 2-3 times). These
almost certainly represent distinct campus or specialisation tabs that the rendered page does not
label distinctly in plain text. They were deduplicated to one CSV row per unique title, with a note
flagging the duplicate count so a follow-up pass can disambiguate campus/specialisation before this
becomes a GAP for publishing.
