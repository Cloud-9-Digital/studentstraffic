# SRM Institute of Science and Technology — Kattankulathur — programme inventory (research only, 2026-09-21)

## Sources used

1. **Official site — WordPress `program` custom-post-type sitemap** (primary):
   https://www.srmist.edu.in/program_cpt-sitemap.xml — discovered via the site's sitemap index
   (https://www.srmist.edu.in/sitemap_index.xml). This returned 428 individual programme-page URLs
   across SRM's group campuses (srmist.edu.in is the Kattankulathur-anchored group domain; other
   campuses — Ramapuram, Vadapalani, Sonepat, Amaravati, Sikkim, Trichy, Delhi-NCR — largely run on
   their own sub-domains per the site's own "Campuses" nav menu). Each programme page carries a
   labelled "Campus" field (`jet-listing-dynamic-field` widget pairs, e.g.
   `Campus → Kattankulathur (KTR)`), which was fetched and parsed for all 428 URLs and used to
   filter to Kattankulathur-only rows: **365 of 428** URLs are tagged Kattankulathur (KTR); the
   other 33 are tagged to a different SRM group campus (e.g. Baburayanpettai/Chengalpattu,
   Ramapuram) and were excluded. Programme title was taken from each page's `<h1>` (the `<title>`
   tag carries SEO marketing text, e.g. "B.Tech Civil Engineering Course | Infrastructure Studies",
   and was not used for row titles). Duration and Sanctioned Intake were pulled from the same
   labelled-field pattern where present. A handful of "Minor Degree in ..." pages (add-on minors
   layered onto an existing degree, not standalone admissions) were excluded per the task's "one
   row per distinct programme with separate admissions" rule.
2. **Official site — international admissions**: https://www.srmist.edu.in/admission-international/
   (found via https://www.srmist.edu.in/admissions/ → "International" link cluster; the URL pattern
   guessed from the task brief, `/admissions/international-students/`, 404s). The page's own nav
   lists "All Programs" under the international-admission flow and does not name a restricted
   subset, so — as with CHRIST and Amity — no programme-level international restriction is
   published; all rows are marked `open_to_international` on that university-wide basis.
3. **Existing published bundle**:
   `content-migrations/0095-india-srm-institute-of-science-and-technology/payload.json` — 10
   programmes already live on our site, matched by exact (entity-decoded, punctuation-normalised)
   title equality against the official H1s: B.Tech Civil/Mechanical/Aerospace/Electronics &
   Communication/Computer Science and Engineering, B.Arch. Architecture, MBA. Business
   Administration, M.B.A. Business Analytics, M.Sc. Applied Data Science, B.Com. General.
4. **studyinindia.gov.in / AICTE / NIRF** — **not separately queried** in this pass; SRM's own
   program-page sitemap already returned a full, campus-disambiguated catalogue with per-programme
   sanctioned-intake figures (a stronger per-programme signal than AICTE's session-gated dashboard
   or NIRF's PDF submissions would give), so the time budget was spent validating that source
   instead. Flagged as a follow-up source if a specific programme's intake needs independent
   corroboration.
5. **Aggregators (checklist only)** — not separately queried; no programme in this CSV was sourced
   from an aggregator only (no `aggregator_only_unconfirmed` rows).

## Counts

- **Total programme rows: 365** (Kattankulathur campus only, deduplicated by exact H1 title).
- By level: PG 165, UG 144, Doctoral 39, Diploma 8, Integrated 8, Certificate 1.
- By intl_status: `open_to_international` 365, `not_open` 0, `unknown` 0 (see methodology note).
- Already on our site: **10** (all 10 rows from the existing bundle payload matched cleanly by
  title).
- Missing (open_to_international and not yet on site): **355**.
- GAP canonical courses: 355 rows tagged `GAP:srm-ktr-*`. Top clusters by volume: MBBS + MPH/public
  health/biostatistics cluster (~10 rows, regulator-governed — see note), M.Tech specialisation
  variants across engineering disciplines (~45 rows), MSc/BSc science and agriculture
  specialisations (~70 rows, SRM has a full School of Agricultural Sciences with Agronomy,
  Horticulture, Entomology, Plant Pathology, Genetics & Plant Breeding etc.), B.Com/BBA/MBA
  specialisation variants (~30 rows), LLM specialisations (~5 rows), and a large PhD-by-department
  block (39 rows).

## Methodology notes / limitations

- **intl_status**: same university-wide-policy approach as CHRIST and Amity — SRM's international
  admissions page lists "All Programs" without naming a restricted subset, so all rows are marked
  `open_to_international`. **MBBS and other NMC/regulator-governed programmes are flagged in
  `notes`** as regulator-capped — SRM's MBBS page states a sanctioned intake of "250 (Including 3
  NRI)", i.e. international/NRI seats are a small regulator-fixed sub-quota within the sanctioned
  intake, not a separately admitted international cohort the way a B.Tech or MBA is. This should be
  re-verified against the current NMC information bulletin before any MBBS/BDS-type row is
  published.
- **Campus disambiguation**: unlike CHRIST and Amity (single primary campus in this task's scope),
  SRM operates many campuses on one brand; this inventory is scoped strictly to programmes whose
  own official page names Kattankulathur (KTR) as the campus, which should match the existing
  bundle's Kattankulathur-only scope.
- **Sanctioned intake**: carried into `notes` where SRM's page published it — useful as a proxy
  for how substantial/active a programme is, and as an aid in prioritising which GAP rows to
  research first for publishing.
- 39 PhD rows are included (one per department name shown, e.g. "PhD. Electronics and Communication
  Engineering") since they were trivial to list from the same source; SRM's PhD admission for
  international candidates typically also needs supervisor/department pre-approval, not verified
  per subject here.
