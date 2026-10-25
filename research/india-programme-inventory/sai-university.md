# Sai University, Paiyanur (OMR Chennai) — programme inventory

Checked 2026-10-25. Owner `claude-tn-sai-university-20261025`, batch `tn-group28-20261025`.
All work was offline against the public site and public registers; no database, upload or commit was
performed by the research run.

## Row counts

| Measure | Count |
| --- | --- |
| Current official programme pages on the live site | 51 |
| Inventory rows in `sai-university.csv` | 51 |
| Awards packaged in `0309-india-sai-university-chennai-rescue` | 47 |
| Awards held with a recorded blocking fact | 4 |
| Awards with a confirmed published tuition figure | 39 |
| Awards with tuition on request (page has no fee block) | 8 |

The previous 91-row file was a discovery crosswalk (42 menu pages plus application-selector rows plus
landing-only labels). It was replaced: 51 is the number of distinct programme pages in the current
official sitemap, and every row here maps to exactly one live page.

## Sources used

| Source | URL | Use |
| --- | --- | --- |
| Official programme sitemap | `https://www.saiuniversity.edu.in/dynamic-program-sitemap` (program collection) | Count and identity of the 51 live programme pages; all 51 returned HTTP 200 |
| Individual official programme pages | `https://www.saiuniversity.edu.in/program/<slug>` | Official award title, structured duration (`period`), eligibility text, fee block, curriculum summary |
| Official 2026-27 admissions registration page | `https://www.saiuniversity.edu.in/admissions-registration-2026-27` | Campus address, school list, UGC/BCI marketing claims, January-2026 programme additions |
| Official admission checklist | `https://www.saiuniversity.edu.in/checklist?filter=eligibility` | School-level undergraduate entry criteria used where a programme page publishes none |
| Official FAQ | `https://www.saiuniversity.edu.in/faq` | Residence arrangement, transport, class timings, scholarship conflict, application route |
| Official application portal | `https://apply.saiuniversity.edu.in/allforms` | Application route and programme selectors |
| The Sai University Act, 2018 | Tamil Nadu Gazette No. 256, 17 July 2018 (`aa5b8d_ad0afb8123ef4e82a9ad85c46980099e.pdf`) | Establishment year and degree-awarding power |
| UGC consolidated list of all universities | `https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf` | Recognition badge (private university, Navalur, Chennai, Tamil Nadu) |
| UGC consolidated list of private universities | `https://www.ugc.gov.in/oldpdf/Consolidated_List_Private_Universities.pdf` | Second UGC listing, Tamil Nadu, as on 17.01.2024 |

## Unreachable or unusable sources

- `https://www.ugc.gov.in/universitylists` redirects to the UGC 404 error page; the dynamic
  per-university detail page could not be reached, so UGC section 2(f)/12(B) status is **not** claimed.
- The Bar Council of India site serves a JavaScript application (`barcouncilofindia.org`) with no
  server-rendered approved-college list, so the university's B.A. LL.B. BCI-recognition claim was not
  verified against the regulator's own list and is not published as a badge.
- AICTE's approved-institution dashboard (`facilities.aicte-india.org`) refused the connection, so no
  AICTE approval claim is made for the B.Tech routes.
- NAAC's institutional accreditation register was not checked for this institution; no NAAC badge is used.
- `https://www.saiuniversity.edu.in/statutes` is a broken third-party template (links to
  `bennett.edu.in` PDFs and cites an unrelated 2016 Act) and is unusable as an official regulation source.
- No academic regulations or prospectus PDF is published on the site; only policy PDFs (anti-ragging,
  POSH) are hosted.
- `https://www.saiuniversity.edu.in/program/pg-diploma-ai-and-creativity` returns 404; the live page is
  reachable only through a double-encoded URL, which is the URL stored in the payload.
- `https://www.saiuniversity.edu.in/eligibility` and `/sai-university-fees` render navigation and
  headings without their body content; no fee or eligibility criteria were taken from them.

## Packaging decision: named awards under school canonical parents

The 2026 application form requires the applicant to choose a named programme, each award has its own
official page, title and duration, and fees differ by school (arts ₹2 lakh, media ₹1.5 lakh, B.Tech
₹2.5–3 lakh, MBA ₹3 lakh). That is the decision the catalogue has to represent. The legacy FAQ line
about choosing a major in year two is retained as a curriculum-structure fact, not used to collapse
distinct awards. Each named award maps to one approved canonical course (for example both BBA
specialisations map to `bba`, both law degrees to `llb`, and the allied-health awards to
`bsc-allied-health-sciences` or `bsc-medical-laboratory-science`), with the exact official title kept
on the offering.

Three taxonomy gaps were resolved in this batch rather than invented per programme:
`bsc-neuroscience`, `bachelor-ppe` and `pg-diploma-artificial-intelligence`.

## Held rows and their exact blocking facts

| Award | Blocking fact |
| --- | --- |
| Bachelor of Optometry (B.Optom.) | Same page states `4 Years` in the structured record and "comprehensive 5-year programme" in the description; the fee line mixes "total fee" with "per annum". |
| Bachelor of Physiotherapy (B.PT) | Same page states `4 Years` in the structured record and "4.5-year programme" in the description; Class 12 marks are given as both 45%/40% reserved and 50% in different sentences. |
| Bachelor of Medical Radiology and Imaging Technology (B.MRIT) | Page publishes only a title and a four-year duration: no eligibility, no fee block, no curriculum, no selection statement. Menu and application form say B.Sc.; the page heading says B.MRIT. |
| Ph.D. in Artificial Intelligence | Page publishes only a title and a five-year period: no eligibility, no fee, no research-area or supervision statement, and no approved doctorate canonical course matches an AI doctorate. |

## Deliberate omissions

- **Teaching language** is not published anywhere on the official site and the Act is silent, so every
  offering stores `medium: ""` with an omit-status evidence record. No English is assumed from the
  English-language website.
- **Intake months** are not published; the site advertises an open 2026-27 cycle. Every offering stores
  empty intake arrays with an omit-status evidence record and a `deadlinesNote`.
- **Fee academic year** is not printed in any programme fee block, so the payload records the figure with
  the `2026-27 cycle` label and states the limitation in the fee notes.
- **International availability** is unknown: there is no international/NRI page, fee category or
  eligibility statement, so every offering is `restricted` with that restriction stated.


## Integrator review — 25 October 2026

The pending 0309 payload is trimmed to 45 academic awards. BA LLB and BBA LLB remain held because current BCI approval is not verified on the regulator; UGC listing alone does not establish qualifying-law professional scope. The inherited checklist also carries age/entrance details that require current reconciliation. Other academic courses make no independent BCI/AICTE or professional-licence claim. Native tuition amounts are explicitly Rs per annum on current own programme pages; the pages do not state their fee cycle, so the unsupported 2026–27 fee-year label is replaced with an unstated-cycle/check-date record. The original researcher 47-row draft is retained separately; no applied migration is edited. Source URLs, exact amounts, quoted basis and verification dates remain intact.
