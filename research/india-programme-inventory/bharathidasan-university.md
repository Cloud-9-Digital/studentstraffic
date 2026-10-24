# Bharathidasan University — regular programme inventory and publication scope

Checked 2026-10-24. Owner: `codex-tn-batch2-20261024`.
Migration: `0188-india-bharathidasan-university`; complete executable payload at
`content-migrations/0188-india-bharathidasan-university/payload.json`.
Mandatory media: `research/media-enrichment/india-tn-universities-bharathidasan-university.json`.
Builder: `research-drafts/india/bharathidasan-university-build.py`.

## Scope and identity

University departments and centres at Palkalaiperur and Khajamalai, Tiruchirappalli. UGC consolidated
register entry 792 establishes the Tamil Nadu state university identity and 1982 establishment.
UGC Section 12(B) state universities register entry 144 separately confirms its inclusion.
Affiliated colleges, distance/online study, Bharathidasan Institute of Management, and Ph.D. awards
are excluded from this regular taught-programme inventory. Bharathiar University is a separate institution.

## Inventory reconciliation

The 2026-27 regular prospectus contains 76 unique programme rows:

- 40 two-year PG programmes;
- 3 six-year integrated M.Tech programmes;
- 8 five-year integrated MA/MSc programmes;
- 2 undergraduate programmes (B.P.Ed and disability-specific BCA);
- 4 B.Voc programmes at DDU KAUSHAL Kendra;
- 5 PG diploma rows (one offers both full-time and part-time);
- 8 diploma rows;
- 6 certificate rows.

The website's PG heading of 41 includes B.P.Ed, which its own prospectus places under UG. B.P.Ed is
recorded once as a two-year bachelor-level programme requiring an existing degree; it is not a school-entry
three-year programme. Full/part-time delivery options are retained within the official inventory row.

Four supported offerings are packaged: MBA Financial Management, and English-medium options in
six-year integrated M.Tech Biotechnology, Computer Science & Engineering, and Geological Technology &
Geoinformatics. The other 72 programme rows remain held; the CSV gives their individual status.
The 3 Tamil-medium integrated options are also held: `tamil` is absent from controlled language facets.

## Sources and high-risk facts

1. Current regular admissions prospectus (2026-2027), downloaded and text-extracted successfully:
   https://oms.bdu.ac.in/admissions/assets/docs/bdu-regular-admissions-2026-2027-prospectus.pdf
   PDF pp. 6–10: fee tables and foreign tuition policy; pp. 11–13: other charges; pp. 14–20:
   programme-specific eligibility. It supplies fees, duration, awards, department allocation and eligibility.
2. International Students Cell (direct HTML downloaded successfully):
   https://www.bdu.ac.in/cells/international-students-cell/
   Defines foreign passport/NRI/NRI-sponsored categories, postgraduate and integrated study, and the
   usual May/June admission and July commencement pattern. July is a normal recurring intake, not a
   claimed 2027 deadline. University-level route coverage is not extrapolated to specialist BCA,
   vocational, diploma or certificate routes; these are `unknown` and held pending route verification.
3. MBA Financial Management curriculum/regulations, effective 2024-25 onward; PDF downloaded and inspected:
   https://www.bdu.ac.in/schools/business-studies/commerce-and-financial-studies/docs/syllabi/MBA-Financial-Management-2024-2025.pdf
   Explicitly full-time regular on-campus, two years, four semesters, English medium and 124 credits.
   Requires >=4 weeks institutional training after semester 2 and a final-semester project. Names
   Centre for Financial Markets association with NSE Academy Limited.
4. Centre for Engineering and Technology (direct HTML downloaded successfully):
   https://www.bdu.ac.in/centers/engineering-and-technology/
   Explicitly says integrated programmes are offered in Tamil and English medium. This is treated as
   alternative medium options, not mandatory bilingual teaching. Only the English-medium option is
   packaged, with a clear scope note and class-allocation confirmation at acceptance. Current programme
   names and subjects come from 2026-27 prospectus rather than the older centre history.
5. Current department programme list cross-check:
   https://www.bdu.ac.in/academics/programmes-offered.php
6. Application FAQ:
   https://oms.bdu.ac.in/admissions/faq.php
   The general MBA/Logistics/International Business programmes use Tamil Nadu MBA/MCA counselling;
   Financial Management remains the separate department route. A guessed `/admissions/programmes.php`
   returned 404 and was excluded.
7. UGC identity and Section 12(B):
   https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf
   https://www.ugc.gov.in/oldpdf/State%20University/List%20of%20State%20Universities%20which%20are%20included%20under%20Section%2012_B_%20of%20the%20UGC%20Act%2C%201956%20_As%20on%2011-09-2015.pdf
   These historical official registers substantiate stable status; no NAAC grade is included because
   the accreditor's own current listing could not be retrieved.

## Eligibility revision and cost interpretation

The MBA Financial Management 2024-25 academic regulation has a stricter old formulation: two
accountancy courses and one computer course. The current 2026-27 admission prospectus explicitly
includes BBA/Bank Management/Corporate Secretaryship with one accountancy course and 50% Part III.
The dated current admission prospectus controls the 2026-27 selection criterion in this payload;
academic regulations remain the source for language, curriculum and training. This is a dated policy
revision rather than silently merging both thresholds. Individual transcripts still need department
assessment. No claim is made about a 2027-28 eligibility relaxation.

Tuition is INR 20,000 per semester for the four packaged programmes: INR 40,000 across two semesters.
The admission-table totals are first-semester admission payments, not annual totals. Additional charges
have one-time, annual and semester frequencies in Annexures A/B. No total-degree tuition is asserted.
The `outside India` qualification category is not a foreign-national tuition quote: the prospectus
separately sets foreign tuition in USD with a developed/other-country distinction and ambiguous conversion
wording. Exact foreign tuition is held and applicants are directed to a category-specific quotation.
All numeric packaged fees are labelled domestic.

## Exact holds and taxonomy

- All remaining degree rows: programme-specific regular teaching-language evidence absent. CDOE
  (distance/online) tables explicitly label English/Tamil but cannot establish regular-programme medium.
  English-titled syllabi and English entrance papers also do not establish teaching language.
- M.Ed/B.P.Ed/M.P.Ed: medium unconfirmed; current programme-specific NCTE status needs confirmation.
  A historical NCTE list names university physical-education programmes, but no current professional
  recognition badge is published.
- Disability-specific BCA and accessible diploma/certificate routes: international route and accessible
  instructional medium require programme-specific verification.
- DDU KAUSHAL Kendra B.Voc and other diplomas/certificates: current international route and medium unconfirmed.
- Genuinely unmatched held courses retain `GAP:` labels in the inventory; these are not silently mapped
  to broad unrelated degrees. No held GAP is packaged. Three distinct `integrated-masters` M.Tech families are added to registry/docs;
  reusable university-neutral records are in `research/india-bdu-canonical-courses.json`. School-entry
  integrated awards do not map to graduate-entry two-year M.Tech families. The held two-year
  geoinformatics awards retain a `GAP:` label pending that separate canonical family.
- Tamil-medium integrated routes are held as separate options until controlled language support exists.
- Medical Physics maps to parent MSc Physics; specialised biology rows map to MSc Biological Sciences;
  Environmental Science maps to existing singular `msc-environmental-science`.

## Media and validation

Logo: official downloadable emblem, HTTP 200 image/png, 480x406, visually checked legible on white.
Cover: CC0 photograph by deadrat.in, 26 January 2018, Wikimedia Commons licence and FlickreviewR
verification checked; direct 1280x960 JPEG returned HTTP 200 and was visually inspected. It shows the
Centre of Excellence in Life Sciences building and campus garden gate; no unverifiable panorama supplied.
The complete manifest carries direct URLs, rights basis, source pages, checked date and cover alt text.

Scoped offline validation: `npm run content:validate -- --id 0188-india-bharathidasan-university`
passed, 0 expired review-by warnings. No database connection, media upload or publication was performed
by this worker. Parent performs controlled application and post-publication media/URL QA.
