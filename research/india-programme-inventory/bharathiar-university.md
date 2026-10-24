# Bharathiar University — resumed 24 October 2026

Completed executable migration: `0187-india-bharathiar-university`; `content-migrations/0187-india-bharathiar-university/payload.json`. Shared ledger: validated, 44 postgraduate offerings. Scoped offline validation passed, no database access, 0 expired evidence warnings. This supersedes earlier interim hold notes in the ledger.

## Scope and inventory

60 current university-department entries inventoried from the official 2026-27 prospectus, with 44 supported regular English-medium PG offerings packaged. Undergraduate, PG diploma, Tamil and professional-education programmes remain held individually. Affiliated-college and distance/online offerings are separate scopes, never attributed to the Coimbatore departments. Existing-site state is unverified offline.

## Sources and decisions

- Admissions: https://b-u.ac.in/146/pg-admission . Separate registration INR400 standard / INR200 SC/ST; programme-specific merit/entrance/TANCET routes. Current original deadline 7 May 2026 has later programme-specific extensions; no current availability promise.
- Official 2026-27 prospectus linked there: https://drive.google.com/file/d/1OyL4YCOQzPqUzpcbYpK3LgJ3-ZdJRvzD/view . Programme text layer on pages 7-15 is scanned; rendered/OCR eligibility retained locally. Source headings and numerical indices drive the CSV order.
- Official regular PG CBCS regulations: https://cdn.b-u.ac.in/cbcs/academic_regulations.pdf . July odd semester; English except Tamil-language curricula. Corroborating department reopening: https://b-u.ac.in/sites/b-u.ac.in/files/circular/2025/circular_vac_2025.PDF (1 July 2025). Historical timing is explicit in admissions deadlinesNote. No January/July CDOE or PhD schedule reused.
- Official calendar 2026-27: https://drive.google.com/file/d/19grcvrWLEVmZIX6UZPO4sEa8AGy9JyVa/view linked by https://b-u.ac.in/academic-calendar-2026-27 . Page51 explicitly labels international PG USD750 tuition per annum, USD50 admission, USD100 exam, plus international hostel USD1,210 annually and USD200 refundable deposit. Current calendar resolves the old webpage periodicity gap. One-year Career Guidance lateral route remains fee on_request because generic fee scope is not explicit for it.
- International support: https://b-u.ac.in/148/about-us-centre-international-affairs . SII/ICCR route verified; no blanket programme eligibility or entrance exemption asserted. Published audience restrictions tell foreign applicants to confirm equivalence and entrance treatment.
- UGC consolidated university register 25 January 2023, Tamil Nadu entry791: https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf . Section12B list 11 September 2015, entry143: https://www.ugc.gov.in/oldpdf/State%20University/List%20of%20State%20Universities%20which%20are%20included%20under%20Section%2012_B_%20of%20the%20UGC%20Act%2C%201956%20_As%20on%2011-09-2015.pdf . Both checked, dates retained in badges. NAAC certificate found on university site, omitted pending regulator-owned verification.
- Wider education sources were cross-checked; tentative/conflicting calendar claims and fabricated CUET/CSAS routes on small education sites were rejected.

## Media

`research/media-enrichment/bharathiar-university-2026-10-24.json`: official logo300x300 and gate photograph1920x850, both HTTP200 with image content type. Logo visually checked legible on white. Full white wordmark logo2.png rejected. Assets require controlled Cloudinary upload and media apply in same publication session.

## Remaining individual holds

- B.Voc., blended B.Sc. and PG diplomas: exact intake-month scope not established by PG-only regulations; separate programme language/timing check required.
- M.A. Tamil: English exception known, but exact instructional-language source must be verified before adding.
- B.P.Ed., M.P.Ed., M.Ed.: need programme-level NCTE verification and relevant timing/language scope.
- No programmes are silently advertised as open or entrance-exempt for every nationality.

## Taxonomy

Six generic entries added, recorded in docs/programme-taxonomy.md. Biology, physics and statistics specialisations use genuine existing parent families while retaining the exact official title. New canonical summaries are university-neutral.
