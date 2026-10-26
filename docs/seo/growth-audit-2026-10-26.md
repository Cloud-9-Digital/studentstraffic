# Growth audit: SEO, AEO, credibility and leads (2026-10-26)

Read-only audit of https://www.studentstraffic.com plus the code in this repo. About 45 URLs were
fetched one at a time with curl on 2026-10-26 (home, 4 university pages, 4 university section
variants, 12 programme pages and variants, an India MBBS college page, country, landing, city,
Tamil Nadu, course, compare, finder, blog, guide, news, trust and contact pages), along with all
five sitemaps, `/llms.txt` and `/llms-full.txt`. One read-only `SELECT count(*)` was run on
`india_medical_colleges`. **PageSpeed Insights could not be run** because the keyless API returned
"Quota exceeded … Queries per day". Performance below is judged from HTML size, JS size and TTFB
instead. Re-run PSI with an API key, or check GSC → Core Web Vitals.

The audit takes into account work that is already done or decided: llms.txt, markdown views,
WebMCP, the robots policy, the JSON-LD contract, the no-catalogue-counts rule, the global home page
and the OG-image decision. It does not re-recommend them.

Catalogue at audit time (from `/llms-full.txt`): 873 universities and 9,032 programmes. India
accounts for 144 institutions and 4,630 programmes. The UK has 1,358 programmes, the US 780 and
Canada 497. Sitemaps list 707 static URLs, 4,054 university URLs (873 base pages plus about 3,100
section variants), 36,469 programme URLs (9,032 base pages plus about 27,400 variants) and 836
compare URLs.

---

## Top 15 actions (ranked by impact × confidence ÷ effort)

| # | What | Why (evidence) | Effort | Who | Measure |
|---|---|---|---|---|---|
| 1 | **Take the near-duplicate section variants out of the index.** For programme `-eligibility`, `-admissions` and `-recognition` (about 26,500 URLs) and university `-programs`, `-student-life`, `-hostel` and `-faq` (about 3,100 URLs), either set `noindex, follow` and drop them from the sitemaps, or canonicalise them to the main page with `#anchors`. Keep `-fees` only where a year-wise fee table exists. | Sibling programmes produce almost the same page. 5-word-shingle Jaccard between the same section of two different programmes: `/presidency-aece1-recognition` vs `/presidency-ahie1-recognition` = **0.87**, `-eligibility` = **0.89**, `-admissions` = **0.84**, and SRM `…-btech-civil-engineering-eligibility` vs `…-computer-science-engineering-eligibility` = **0.88**. Recognition is an institution-level fact, so every programme repeats it. University variants are mostly subsets of the main page: 60–80% of the text on `/university/presidency-college-chennai-faq`, `-hostel`, `-student-life` and `-programs` also appears on `/university/presidency-college-chennai`. Today about 74% of the programme sitemap is boilerplate competing with the 9,032 real pages for crawl budget and quality signals. | M | Code | GSC Pages report: fewer "Duplicate without user-selected canonical" and "Crawled – currently not indexed" URLs, and a higher indexed share of base programme and university URLs within 4–8 weeks. |
| 2 | **Make the India MBBS college pages real, linked and in the sitemap.** Remove the developer copy, give them readable slugs (301 from the current ones), link to them from the hub cards and search results, and add a sitemap. | The table has 823 colleges (78 in Tamil Nadu). The pages are indexable, but nothing links to them: `IndiaMbbsCardView` renders no `<a>`, `/api/suggestions?q=madras medical college` points to `/india-mbbs-colleges?q=…`, and there is no sitemap entry. Slugs are codes such as `/india-mbbs-colleges/tn-065-g-1-india-medical-college` (Stanley Medical College); 796 of 823 follow this pattern. The page shows internal instructions to the public (see Fix now). "<college> MBBS fees", "seats" and "cutoff" are among the highest-volume Indian education queries. | M (code) + L (data) | Code + content | Indexed count of `/india-mbbs-colleges/*`, GSC impressions for "<college> fees/cutoff", and leads with `sourcePath` under `/india-mbbs-colleges/`. |
| 3 | **Publish domestic (Indian-category) INR fees for private and deemed universities.** At present only NRI/international USD fees are shown. | `/srm-kattankulathur-btech-computer-science-engineering` shows "$12,500 /yr (NRI & international)" as the only fee, and the `Offer` is USD 12,500. VIT's programmes in `/llms-full.txt` also show only USD (`vit-vellore-btech-civil-engineering`: $9,000/year). Indian students search "SRM B.Tech CSE fees" and "VIT fees" for the domestic or category fee, which both universities publish. The fee-state model already supports multiple quotas (commit 22af57f5, "Label fees by seat quota"). | L | Content + data | Fee-query impressions and CTR in GSC (queries containing "fees" plus the university name), and leads from those pages. |
| 4 | **Fix the city template or noindex it, then rebuild it as "Colleges in <city>".** | `/cities/coimbatore` has the title "MBBS in Coimbatore, India 2026", the heading "Medical universities in Coimbatore", the copy "Application, documents, and visa — all done for you" and "NEET score, budget, and NExT pathway", and it lists Bharathiar University's M.A. English as a medical university at "$750/yr". That page is 3.2 MB of HTML. `/cities/chennai` returns 200 `index, follow` with no `<h1>` and no body (the page did not render). `/cities/*` is not in any sitemap and is not linked from the pages sampled. Rebuilt as "Arts and science colleges in Chennai" or "Engineering colleges in Coimbatore", it would target the large "<course> colleges in <city>" query family. | S (noindex) / M (rebuild) | Code | Noindex removes the bad pages from GSC; after the rebuild, track impressions for "colleges in <city>". |
| 5 | **Add university aliases and better Indian programme titles.** | There is no alias or short-name field on `universities` (`lib/db/schema.ts`; `aliases` exists only on `courses`). Students search "SRM", "SRMIST", "VIT", "PSG Tech" and "MCC". JSON-LD `alternateName` is only on the Organization. The rendered title `B.E./B.Tech CSE Fees at SRM Institute of Science and… \| Students Traffic` is cut off before the words that matter. Titles use the course-family label: "Bachelor's Economics at Presidency College", when students search "BA Economics". 29 institutions have 276 programmes whose titles repeat a sibling's (shift or medium differences). For example, `/presidency-aece1`, `/presidency-aect1` and `/presidency-aect2` all have the title and H1 "Bachelor's Economics at Presidency College" (Jaccard 0.95 between aece1 and aect1). The base programme title omits "Fees" even when a confirmed fee exists. | M | Code + data | CTR on university and programme queries in GSC; duplicate-title count in GSC or a crawler. |
| 6 | **Build a crawlable Tamil Nadu / India domestic hub cluster.** Examples: "Deemed universities in Tamil Nadu", "Government arts and science colleges in Chennai", "Engineering colleges in Chennai", "Autonomous colleges under University of Madras". Link the hubs from university pages and the footer. | The 144 Indian institutions have almost no crawlable entry point. `/countries/india` (1.35 MB) links to only **8** university pages; `/universities` links to 12, and its filter and pagination URLs are `noindex`. `/tamil-nadu` and the `/tamil-nadu/<city>` pages are "Best MBBS Abroad Consultant" pages with **0** university links. Project standards allow India-specific hubs as labelled specialist routes. | M | Code + content | Crawl depth to Indian university pages; impressions for "deemed universities in tamil nadu" and "colleges in chennai". |
| 7 | **Build data assets for cutoffs: TNEA college-wise cutoffs, the TN NEET state-quota cutoff, and a real NEET college predictor.** | `/neet-college-predictor` is titled "NEET College Predictor 2026" but is a form ("Share your NEET 2026 score … our counselling team will help"), and it has no page JSON-LD. The search intent is a tool, so the mismatch hurts rankings and trust. `/llms-full.txt` has "cutoff" 3 times and "TNEA" 15 times; the blog has no TNEA or Tamil Nadu cutoff posts. Cutoff tables are the most linked and cited asset type in Indian admissions. See Content gaps for sources. | L | Content + code | Backlinks to the cutoff pages, impressions for "TNEA cutoff <college>", and predictor-to-lead conversion rate. |
| 8 | **Fix fee display honesty and wording for AEO.** Always state the period and quota, and keep research-record language out of public copy. | `/university/presidency-college-chennai` lists "B.A. English … Approx. fees ₹1,295" twice with no period, quota or medium. `/presidency-aece1` shows "Fees ₹1,295", and the `.md` view shows "Fees: ₹1,295". An answer engine will quote "Presidency College fees ₹1,295" with no context. The FAQ copy on the same page reads "The page does not identify a current billing year or period, and tuition is a dash. Indicative native quotes are not annual tuition…", which is source-reporting language that `docs/project-standards.md` forbids. | S–M | Content + code | Spot-check 30 fee strings; correct citations of fee figures in AI answers. |
| 9 | **Rewrite university FAQs around the questions students actually ask** (entrance exam, category fees, hostel fee, placements, cutoff, recognition, scholarships). Bring medical-abroad pages up to the 10–13 FAQs the spec requires. | SRM's 12 FAQs are process questions ("Which SRM institution and campus are included?", "How are the academic Arts and Science programmes selected?"). None covers SRMJEEE, B.Tech fees, hostel fees or placements, yet the programme page already holds verified NIRF placement data (median INR 6.2 LPA, 4,210 of 4,552 placed) that would answer "SRM placements". `/university/kazan-state-medical-university` has 5 FAQs and `/countries/india` has 4. | M | Content | FAQ impressions and "People also ask" or AI Overview citations for the target questions. |
| 10 | **Make the trust signals honest and consistent.** Add a named byline and reviewer, back up or remove claims, publish an office address and company details, and add "How we earn money" and corrections pages. | The visible byline on programme and university pages is "Written by Students Traffic Research Team", but the `Article.author` JSON-LD is Bharat Vasireddy (`/author/bharat-vasireddy#person`), a mismatch. `/about` says "Award Winning counsellors" (no award named) and "500+ Universities Listed", a catalogue count the project standards ban, and "6+ Study destinations" while the catalogue covers about 80 countries. `/about` argues that "most consultancies show you only the universities that pay them the highest commissions" and the author bio says "commission-free", but no page says how Students Traffic earns money. `/editorial-policy` promises "We publish correction notices" and "a public record of major content updates", and no such page exists. There is no street address on `/contact`, `/about` or the Organization schema; the parent "Cloud 9 Digital" appears only in JSON-LD. The editorial policy and author bio are framed only around MBBS abroad, while the catalogue is mostly Indian non-medical programmes. | S–M | Owner + code | Brand-query CTR; presence in AI "is Students Traffic legit?" answers; lead-form completion rate. |
| 11 | **Owner off-site basics:** Bing Webmaster Tools, a Google Business Profile, linked social profiles in `sameAs`, and a Wikidata item. | DNS has two `google-site-verification` TXT records, so Search Console is verified. `MS=ms27363590` is Microsoft 365 verification, not Bing Webmaster; Bing feeds ChatGPT search and Copilot. The Organization `sameAs` contains only the Play Store URL, yet `/reviews` embeds YouTube testimonials (`watch?v=4hcVrDdOXVU`, `MouZc9AgDfI`, `m4mZLGvAyjI`) whose channel is not linked. With no address there is no Business Profile, and "MBBS abroad consultant in Chennai" (the target of `/tamil-nadu/chennai`) is a local-pack query. | S | Owner | Bing indexed pages; Business Profile calls and direction requests; Knowledge Panel for the brand. |
| 12 | **Run IndexNow automatically on publish.** | `lib/indexnow.ts` and `scripts/submit-indexnow.ts` exist, but the only trigger is `npm run seo:indexnow` (per `docs/discovery-rollout.md`). No publish or queue script calls it, and there is no `.indexnow/state.json` in the repo checkout, so changed-only runs have no baseline here. About 5,000 programme lastmods changed on 2026-10-25 and 2026-10-26 alone. | S | Code | Bing Webmaster → IndexNow submissions, and time from publish to Bing index. |
| 13 | **Render the header and footer once, outside the Suspense fallback.** Also shrink oversized pages. | Every page has 4 `<header>`, 2 `<footer>` and 2 `<main>` elements, because `AppChrome`'s fallback renders a full `StandardAppChrome` with a spinner `<main>` and then the real chrome streams in. The footer, with about 80 country links, ships twice. The H1 sits at byte 337 K on the home page and 415 K on the SRM page. Raw HTML: SRM 1.14 MB, `/countries/india` 1.35 MB, `/cities/coimbatore` 3.2 MB. JS is about 370 KB compressed per page. TTFB is fine (0.13–0.17 s, CDN `HIT`). | M | Code | HTML bytes per template; GSC Core Web Vitals (INP/LCP mobile); PSI once quota allows. |
| 14 | **Point comparison pages at real demand.** Add Indian institution pairs and put university-vs-university pages in the sitemap. | All 836 URLs in `/compare/sitemap/0.xml` are country-vs-country by course (e.g. `/compare/country-ba-history-canada-vs-india`), which have little search demand. The university-vs-university pages the hub and university pages link to (e.g. `/compare/altai-state-medical-university-vs-kazan-state-medical-university`) are not in any sitemap. There are no pages for high-demand pairs such as SRM vs VIT, PSG Tech vs CIT or Loyola vs MCC, and the `/compare` hub leads with "Acadia University vs Memorial University of Newfoundland". | M | Code + content | Impressions for "X vs Y" queries; leads from compare pages. |
| 15 | **Lead-capture tune-up.** Prefill WhatsApp messages with page context, load GA earlier, match the form to the visitor's intent, and fix overpromising CTA copy. | `wa.me/<number>` has no `?text=` anywhere (`components/site/mobile-sticky-bar.tsx`), so counsellors cannot tell which college the chat is about. GA loads with `strategy="lazyOnload"` and `trackEvent` drops events silently when `gtag` is not yet defined (no retry, unlike Meta), so early `lead_form_submit` and `contact_*_click` events are under-counted. The counselling form asks a domestic B.A. visitor for "Interested country" and requires email in the dialog, which adds friction for phone-first Indian parents. The CTA on `/presidency-aece1` says "Students Traffic verifies seat availability … and prepares your complete application for Presidency College", a hard promise for a government college admitted through the state portal. | S | Code | Form start→submit rate, WhatsApp chats tagged with a page, and GA4 `lead_form_success` marked as a key event. |

---

## Fix now (broken or wrong today)

1. **Internal developer instructions published on 823 indexable pages.**
   `/india-mbbs-colleges/tn-065-g-1-india-medical-college` (`index, follow`) shows the H2 "How to manage
   real content" with "Store only verified copy in the editorial content JSON for this college…", and
   the H2 "College Snapshot" with "This page combines imported NMC-linked facts with your editorial
   content layer…". There is also a "View source file" link. The meta description is 244 characters and
   the title 98. Either noindex the template until it is rewritten, or remove those blocks now.
2. **The city template calls non-medical colleges "medical universities"**, for example
   `/cities/coimbatore` ("MBBS in Coimbatore", Bharathiar University M.A. English listed as a medical
   university, "visa"). **`/cities/chennai` returns an empty page** (200, `index, follow`, no H1, no
   body). Noindex `/cities/*` for Indian cities, or all of them, until the template is fixed.
3. **The programme recognition template uses study-abroad copy for Indian colleges.**
   `/presidency-aece1-recognition` says "Recognition is the key check for any international student
   considering Bachelor's Economics abroad… visa credibility… the India -specific accreditation body
   that governs the degree's validity in the country of study". This is wrong for a Chennai government
   college and repeats across all Indian `-recognition` pages.
4. **Research-record language in public fee FAQs** (Presidency): "The page does not identify a current
   billing year or period, and tuition is a dash."
5. **Duplicate titles and H1s for sibling programmes**: `/presidency-aece1`, `-aect1` and `-aect2` all
   read "Bachelor's Economics at Presidency College". Add the medium and shift to the title and H1.
6. **Opaque slugs**: `/presidency-aece1` and 796 India MBBS college slugs like
   `tn-065-g-1-india-medical-college`. Slugs are hard to change later, so fix them with 301s before
   these pages earn links.
7. **The apex domain redirects with 307 (temporary)**: `https://studentstraffic.com/` → www returns
   `HTTP/2 307`, while `http://www` → https returns 308. Set the apex redirect to permanent (308/301) in
   Vercel → Domains.
8. **Missing H1**: `/news`, `/methodology` and `/reviews`. **Two H1s in the server HTML** (fallback plus
   content): `/universities`, `/india-mbbs-colleges` and blog posts (e.g.
   `/blog/mbbs-in-romania-vs-bulgaria-for-indian-students-2026`).
9. **Empty `/news` and news sitemap**: `/news` has no H1, no article links and no page JSON-LD.
   `/news-sitemap.xml` has 0 URLs but is listed in robots.txt, and `/sitemap.xml` gives `/news`
   `changefreq: hourly` with lastmod 2026-03-27. Either publish news or noindex `/news` and drop the
   news sitemap.
10. **`/reviews` has no server-rendered content** (no H1, no reviews in the HTML, no page JSON-LD),
    even though it embeds real YouTube testimonials.
11. **JSON-LD author does not match the visible byline** on university and programme pages (see #10
    above).
12. **The catalogue-count rule is broken on `/about`**: "500+ Universities Listed" and "6+ Study
    destinations".
13. **Titles over budget on landing and hub pages** (rendered length including " | Students Traffic"):
    `/guides/neet-2026-expected-cut-off` 98, `/mbbs-in-georgia` 96, `/india-mbbs-colleges` 94,
    `/courses/mbbs` 93 ("MBBS: Compare Entry and Fees | Countries, Universities, Fees & Eligibility"
    repeats "Fees"), `/tamil-nadu/chennai` 89. Meta descriptions over 160 characters:
    `/mbbs-in-georgia-admission` 201, `/tamil-nadu/chennai` 206, `/countries/india` 169,
    `/countries/georgia` 171. These pages are outside the `lib/university-metadata.ts` budget logic.
14. **`/mbbs-in-georgia-admission`** (an ad landing page rendered without the site chrome) is in the
    sitemap and `index, follow`, with an H1 that competes with `/mbbs-in-georgia`, and has **no tel:
    or WhatsApp link** in its HTML. Noindex the paid-traffic variants (`/mbbs-in-{russia,vietnam,georgia}-admission`)
    or canonicalise them to the organic pages, and add the call and WhatsApp links.

---

## Supporting findings by area

### Technical SEO

- **Canonicals and robots**: every sampled indexable page has a self-referencing `https://www.`
  canonical. Finder filter URLs (`/universities?country=india`, `…&course=mbbs&page=2`) are
  `noindex, follow` with a canonical to `/universities`, which is correct for bloat control.
  Missing slugs return `noindex` via `MissingPage` (checked on `/india-mbbs-colleges/madras-medical-college`).
  There is no hreflang, and none is needed because the site is English-only.
- **Sitemaps**: the five sitemaps in robots.txt resolve, but `/sitemap.xml` is a `urlset`, not a
  sitemap index. That is fine as long as all five are submitted in GSC. `programs/sitemap/0.xml` is
  7.35 MB with 36,469 URLs, which is 73% of the 50,000 limit; `generateSitemaps` will split it, but
  removing the variants (#1) solves this as well. Programme lastmods vary (8,974 on 2026-10-25 and
  7,610 on 2026-07-12), which looks like real data. Compare-page lastmods all use `catalogReviewedAt`.
- **Not in any sitemap**: `/india-mbbs-colleges/*` (823), `/cities/*`, university-vs-university
  compare pages and `/budget/*` guides (check).
- **Internal linking**: Indian institutions are reached only through the sitemap, programme pages and
  "related" blocks (a university page has about 17 university links). The home page links to 0
  university pages, `/countries/india` to 8, `/tamil-nadu` to 0. The finder's 12 cards per page sit
  behind noindexed pagination.
- **Performance proxies**: TTFB 0.13–0.17 s with CDN hits. HTML: home 486 KB raw / 35 KB compressed,
  SRM university 1.14 MB / 77 KB, programme page about 460 KB / 41 KB. JS: 20–23 scripts, about
  330–377 KB compressed. The LCP image is the Cloudinary cover through `next/image`, preloaded with
  `sizes`. Fonts are `next/font` (Plus Jakarta Sans with 5 weights, Fraunces with 2) using
  `display: swap`; consider trimming Jakarta to 3 weights. The home page preloads a 180 px
  `russia.jpg` card image, which is not the LCP element.
- **Server HTML order**: catalogue content streams into `<div hidden id="S:n">` after a spinner
  `<main>`, so for a non-JS reader the first `<main>` is a loading state. This is a known issue
  (`docs/seo/ai-discovery.md`, mitigated by the markdown views); #13 reduces the duplicated chrome
  around it.

### Structured data

- No parse errors in any sampled JSON-LD block. University, programme, country and guide graphs
  match `structured-data-contract.md`: one page graph, `CollegeOrUniversity` with `sameAs` to
  regulator URLs, `Course` + `EducationalOccupationalProgram`, `Offer` only for confirmed fees, and
  `FAQPage` matching visible FAQs.
- Many provider stubs: the SRM page emits 74 `CollegeOrUniversity` nodes (one full node plus a
  provider stub with the same `@id` inside each of 73 `ItemList` courses). This is valid (same
  `@id`, consistent names), but replacing the stub with a bare `{"@id"}` would save bytes.
- **Rich-result reality check**: Google limited FAQ rich results to government and health sites in
  2023 and phased out Course Info rich results in 2025, so `FAQPage` and `Course` now matter for
  understanding and for AI answers, not for SERP features. The remaining opportunities are
  BreadcrumbList (present), Organization (add `address`, `sameAs` socials and `foundingDate`),
  **VideoObject** for the YouTube testimonials on `/reviews` and university pages, and possibly
  **Dataset** markup for downloadable fee and cutoff tables (#7).
- Pages without a page graph: `/news`, `/reviews`, `/neet-college-predictor`.
- The article dates are the same governance date on all pages (`datePublished` = `dateModified` =
  2026-10-25 on SRM and Presidency). Make sure `dateModified` follows real content changes, not
  republish runs.

### AEO / AI-answer readiness

- **Strong**: `/llms.txt`, `/llms-full.txt` (2.7 MB), `.md` views, the agent-skills index, the
  WebMCP tools, AI crawlers allowed, FAQs in native `<details>`. The `.md` view for `/presidency-aece1`
  is clearer than the HTML (it names the shift and English medium).
- **Gaps**:
  - Fee strings without a period or quota (#8).
  - University FAQs that answer process questions instead of the questions students ask (#9).
  - No acronym or alias entity data (#5): an assistant asked about "SRMIST fees" has to resolve the
    name itself.
  - The first ~100 words of the programme HTML after the H1 are UI chrome ("Written by … Plan my
    application Plan my application Explore programmes Shortlist Compare Academics Admissions…")
    before any fact. Move a one-sentence answer ("B.A. Economics at Presidency College, Chennai is a
    3-year, English-medium, Shift I programme; fee ₹X per year for …") directly under the H1.
  - On Indian programme pages, empty-state filler such as "Teaching phases 1", "Year-wise cost data
    is not currently published for this program" and "Estimated hostel fee with food: Check with
    university" lowers quotability. Hide empty blocks.
- Comparison and "best X in Y" content that AI answers cite is entirely abroad-focused. There are no
  "best arts colleges in Chennai", "deemed universities in Tamil Nadu" or "SRM vs VIT" pages (#6,
  #14).

### Credibility / E-E-A-T

- **Present**: `/editorial-policy`, `/methodology`, an author page with `ProfilePage`, an "Updated On"
  date on every catalogue page, "Fee data last verified: 2026-08-22" on fee sections, regulator links
  (UGC, NAAC, NIRF) in `sameAs` and visible recognition, privacy and terms pages, and phone, email and
  WhatsApp.
- **Missing or weak** (details in #10):
  - No office address or registered company name visible, and no GSTIN or CIN.
  - The service-volume claims ("2,000+ students enrolled") and the "award winning" claim have no
    evidence.
  - No disclosure of how the free service is paid for.
  - No corrections page, though the editorial policy promises one.
  - The editorial policy (reviewed 27 Mar 2026) covers only "MBBS abroad", while most pages are now
    Indian non-medical programmes.
  - Reviews: university pages show a "Student reviews" heading, but SRM, Presidency and Kazan emit no
    `Review` nodes, which is correct if there are none. Make sure the empty state does not look like
    a broken feature.
- "Approx." fees are labelled visibly ("Approx. fees ₹1,25,000–₹1,50,000" on SRM), which is honest.
  The label still needs to say per year/semester and which quota it applies to.

### Lead conversion

- **What works**:
  - A mobile sticky bar (`md:hidden`) with "Request counselling", Call and WhatsApp, all tracked
    through `TrackedContactLink` and a server-side `contact_click_events` record.
  - CTAs inside the page body: "Plan my application", "Call us", "Compare colleges".
  - A brochure download that fires `trackLeadFormSuccess`.
  - A `/thank-you` page that fires GA `lead_form_success`, Meta `Lead`, and Meta CAPI with event-ID
    dedupe.
  - GA4 (`G-D7WE61F5SM`), the Meta Pixel and Clarity are wired in the root layout.
- **Friction**: the counselling form asks for name, phone, email (required in the dialog), residence
  country, state, course, country, plus NEET score and category for MBBS. That is 7–9 fields in one
  step. Test a 2-step form: name and phone first, the rest optional on the thank-you step.
- **Intent mismatch**: on Indian programme pages the CTA describes an application service for a
  government college; for domestic colleges, offer "shortlist colleges by your marks/cutoff" or
  "TNEA/TNGASA choice-filling help" instead.
- The OG image is the same site image on every page. This was decided for cost reasons, but leads
  spread on WhatsApp in India. Pointing `og:image` at the existing static Cloudinary cover adds no
  function cost and gives shared links a college-specific preview.

### Off-site / "everywhere" (owner)

1. **Bing Webmaster Tools**: import from GSC and submit the five sitemaps. Bing feeds ChatGPT search
   and Copilot; IndexNow (#12) needs it.
2. **Google Business Profile**: only if there is a real, staffed office (the 2026 seminar was at
   Hilton Chennai, which is not an office). Then add the address to `/contact` and the Organization
   schema.
3. **Profiles for `sameAs`**: the YouTube channel (videos exist), LinkedIn company page, Instagram,
   and Cloud 9 Digital's site if public.
4. **Wikidata**: a modest item for Students Traffic (instance of "educational consultancy" or
   "website", parent Cloud 9 Digital, official website, social IDs) is feasible with references. A
   Wikipedia article is **not** realistic without independent press coverage, so do not attempt it.
5. **Citations and directories**: Justdial, Sulekha and IndiaMART education-consultant listings with
   the same name, address and phone (NAP) as the site; Shiksha, Collegedunia and CollegeDekho
   "counsellor" or partner listings where offered.
6. **Digital PR and linkable assets** specific to this niche:
   - A "Tamil Nadu private and deemed university fee tracker 2026" (CSV download plus a methodology
     note), pitched to The Hindu, DT Next, Times of India Chennai and education reporters during
     TNEA season (July–August).
   - TNEA college-wise cutoff explorer (from TNEA's published cutoff PDFs).
   - A NEET TN state-quota cutoff page by college and category.
   - An annual "MBBS abroad: real cost vs advertised cost" data piece (the site already has verified
     abroad fee data).
7. **Community**: answer Quora and Reddit (r/Indian_Academia, r/JEENEETards, r/NEET) questions on
   fees and cutoffs with links to the data pages. Use YouTube Shorts for "fees of X college in 60
   seconds", built from the catalogue.

### Content gaps vs demand

| Demand (query family) | What exists | Template that would capture it | Data needed and authoritative source |
|---|---|---|---|
| "<college> fees" (SRM, VIT, Amrita, Sathyabama) | USD NRI/intl fees only | Existing programme `-fees` page with quota rows | Domestic category fee notices on each university's site |
| "<college> cutoff", "TNEA cutoff" | None | `/tnea-cutoff/<college>` plus college-page block | TNEA (tneaonline.org) yearly college- and branch-wise cutoff PDFs; DoTE Tamil Nadu |
| "NEET cutoff for TN private/govt colleges", "MBBS fees in Tamil Nadu private colleges" | 823 unlinked NMC stub pages | Rewritten `/india-mbbs-colleges/<slug>` plus a state hub | TN Health & Family Welfare Selection Committee (tnmedicalselection.net) prospectus, fee and cutoff lists; MCC (mcc.nic.in) AIQ allotments; NMC college list |
| "<college> placements" | Data held only in programme prose (SRM NIRF) | Placement block plus FAQ on the university page | NIRF data submissions (nirfindia.org), which give median salary and placed counts per programme level |
| "<course> colleges in <city>" | Broken MBBS city template | `/cities/<city>` rebuilt per stream | Existing catalogue |
| "deemed universities in Tamil Nadu", "autonomous colleges in Chennai" | None | India hub pages (#6) | UGC deemed university list, UGC autonomous college list (both already used as `sameAs`) |
| "SRM vs VIT", "PSG Tech vs CIT" | None | `/compare/<a>-vs-<b>` for Indian pairs | Existing catalogue plus NIRF ranks |
| "TNGASA admission", government arts college admission | Programme pages only | Guide plus hub | TNGASA portal (tngasa.in) notices |

Data the site does not have yet: cutoffs (TNEA, TN NEET, MCC), domestic category fees for
private/deemed universities, and placements beyond the NIRF figures. All of these come from public
official sources and should go through `docs/content-seeding-runbook.md` evidence records.
