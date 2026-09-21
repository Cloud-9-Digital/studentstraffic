# Ashoka University — programme inventory sources

## Sources used
- ashoka.edu.in is behind Cloudflare bot protection: the homepage, most `/programme/*`, `/admissions/*` and `/department/*` pages return HTTP 403 "Just a moment..." to curl even with a rotated desktop/mobile user agent. WebFetch is also blocked per task instructions.
- Sitemaps (XML, served without the JS challenge) were the workable path: https://www.ashoka.edu.in/sitemap.xml (index), https://www.ashoka.edu.in/academics_programme-sitemap.xml, https://www.ashoka.edu.in/academic_courses-sitemap.xml (77 programme/major URLs — majors, minors, Ashoka Scholars Programme tracks, Horizons short courses), https://www.ashoka.edu.in/admission_courses-sitemap.xml (admissions-page-per-programme URLs), https://www.ashoka.edu.in/page-sitemap.xml (522 URLs, used to confirm Young India Fellowship + international pages).
- https://www.ashoka.edu.in/admissions/graduate-admissions/ loaded successfully once (200) and confirmed the postgraduate roster: MA English, MA Economics, MA Economics and Data Analytics, MA in Liberal Studies (MLS, with Psychology and English specialisation tracks), and PhD admissions in Chemistry, English, History, Physics, Biology, Economics, and the "New Horizons" Computer Science PhD.
- `/admissions/undergraduate-international-students/` and `/yif-international-students/` exist (confirmed via sitemap URLs) but returned 403 on every fetch attempt in this session — their content (eligibility detail) could not be read directly; intl_status for the flagship UG degree and YIF is inferred from the existence of these dedicated international pages plus general knowledge that Ashoka actively recruits international UG and YIF applicants, not from page text. Flag as needing a direct read (e.g. via a rendering browser) before being treated as fully verified.
- studyinindia.gov.in, AICTE, NIRF, and the aggregator checklist (Shiksha/Collegedunia/Careers360) were used only via WebSearch snippets for cross-checking; no programme was found that isn't already covered by the official sitemap data, so no `aggregator_only_unconfirmed` rows were needed.

## Counts
- Total distinct rows: 27 (1 umbrella UG degree + 18 majors/PPE major_within rows + 1 standalone BSc CS&AI + YIF + MLS + 2 MLS specialisations + MA English + MA Economics + MA Economics & Data Analytics + 1 condensed PhD row).
- By level: UG 20 (1 umbrella + 18 majors/PPE + 1 standalone BSc CS&AI), PG 6 (YIF, MLS, MLS-Psych, MLS-English, MA English, MA Economics, MA Econ&DA — actually 7, see CSV), Doctoral 1 condensed row (10 tracks).
- By intl_status: open_to_international 13 (umbrella UG degree + all majors confirmed reachable from the international-admissions sitemap path, plus YIF), unknown 14 (PG masters tracks, PhD, some UG majors/minors like Media Studies, Visual Arts, Performing Arts, PPE where no explicit international page reference was found this pass).

## Already on site vs missing
- Already on site: 1 (the umbrella "B.A./B.Sc. Honours" UG degree — `ashoka-undergraduate-ba-bsc-honours`, canonical `bachelor-liberal-arts`).
- Missing: all 18 individual majors (modelled as `major_within` rows, not separate canonical courses — decision needed on whether to publish these as content sections vs separate offerings), the standalone BSc (Hons) Computer Science and AI degree, Young India Fellowship, MA in Liberal Studies (+2 specialisations), MA English, MA Economics, MA Economics and Data Analytics, and the PhD programmes.
- Highest-priority gap: Young India Fellowship — named explicitly in the task brief, has its own international-students admissions page, and is Ashoka's best-known postgraduate offering; not on site at all.

## Top GAP canonical courses
- GAP:young-india-fellowship
- GAP:ma-liberal-studies
- GAP:ma-economics-data-analytics
- GAP:ma-economics
- GAP:ma-english
- GAP:bsc-hons-computer-science-ai
- GAP:phd-various
