# Research record: University of Saskatchewan (College of Dentistry)

**Status: HELD - not gate-passing.** This draft is NOT publish-ready. Saved as a local research
record so the overnight run does not re-research this school, and so a human can review the
reasoning below.

Note: A separate, already-published-ready draft exists in this same folder,
`university-of-saskatchewan.json`, covering USask's Nursing (B.S.N.) and Pharmacy (Pharm.D.)
programs. That draft explicitly states no medicine/dentistry program is included on it. This
record documents specifically why the College of Dentistry (dental surgeon / `bds`-slug) angle
was researched separately and could not pass the gate.

## Key facts (corroborated, multi-source)

- **Institution**: University of Saskatchewan, College of Dentistry
- **City**: Saskatoon, Saskatchewan, Canada
- **Type**: Public university (University of Saskatchewan founded 1907)
- **Official site**: https://dentistry.usask.ca/ (admissions pages at https://admissions.usask.ca/dentistry.php)
- **Flagship program**: Doctor of Dental Medicine (D.M.D.) — 4-year entry-level program (plus 3
  years of required pre-dentistry university coursework beforehand), CDA-accredited, ADA-recognized.
  Class size 36 students/year.
- **International Dental Degree Program (IDDP)**: A separate 2-year degree-completion program for
  internationally trained dentists, admitting up to 10 students/year, entering directly into Year 3
  of the D.M.D. clinical curriculum.
- **Other College of Dentistry programs** (not dental-surgeon degrees, so not gate-relevant):
  Dental Assisting (10-month certificate), Dental Therapy (BSc), Dental Hygiene (BSc), DMD/MBA
  dual track, plus graduate research programs (MSc/PhD in Precision Oral and Systemic Health,
  MSc Periodontology).

## Why this could not be published on this platform (India/NEET-audience gate)

This platform's course catalog for dentistry is `bds` — an **entry-level** Bachelor of Dental
Surgery-equivalent track for students who have not yet earned a dental degree (the NEET-UG
audience). The gate requires an honest, explicit `courseSlug` mapping for each program, and the
platform's audience is Indian students applying from India who do not already hold Canadian
citizenship or permanent residency.

Research into both of USask's actual dentistry admission pathways found:

1. **Entry-level D.M.D. (4-year professional program, following 3 years of prerequisite
   coursework)**: The College of Dentistry's own official 2027-2028 Admissions Information Guide
   states explicitly, in the "Categories of Applicants" section: *"The College of Dentistry admits
   36 students to the program each year. Applicants must designate their category on the online
   application form. **All applicants must be Canadian citizens or landed immigrants at the time
   of application.** If you are not a Canadian citizen or landed immigrant, please visit the ADEA
   AADSAS website to apply."* The AADSAS route referenced is the American Dental Education
   Association's application service, which the admissions page separately explains was adopted
   "to facilitate qualified applicants from the United States" (AADSAS covers US dental schools
   plus a handful of Canadian ones). There is no eligibility category, anywhere in the guide or the
   admissions webpage, for a general international applicant (e.g., an Indian student applying
   directly from India, with no US dental-school affiliation and no Canadian citizenship/PR
   status). The listed "categories of applicants" are: Saskatchewan resident, (other-province)
   Canadian applicant, Indigenous applicant, Special-case applicant, Transfer applicant (not
   accepted), and "International" (in practice, the AADSAS/US-facing route). An "International"
   Year-1 tuition line does appear in the tuition-estimate table (CAD 134,787 total for Year 1,
   versus CAD 63,478.66 for Saskatchewan residents and CAD 85,943.66 for out-of-province Canadians)
   — but this appears to be a legacy/contingency tuition tier rather than evidence of an active,
   described admission pathway for students who are neither Canadian citizens/PRs nor applying
   through the US-oriented AADSAS system. No page describes how an Indian citizen without US
   dental-school ties or Canadian status/PR could apply.
   Sources:
   https://admissions.usask.ca/dentistry.php
   https://admissions.usask.ca/documents/dentistry-admissions-information-guide.pdf (official PDF,
   "III. CATEGORIES OF APPLICANTS" section and tuition table)

2. **International Dental Degree Program (IDDP)**: This is the program most likely to be
   mistaken for an open "international" pathway based on its name, but its own official admissions
   guide is unambiguous: *"Applicants must be graduates of a dental degree program at a foreign
   institution which is not recognized by the Commission on Dental Accreditation of Canada (CDAC).
   Applicants must be citizens of Canada or have permanent residency status (landed immigrant) on
   the date of application... A maximum of one space is reserved for residents of the province of
   Saskatchewan, the remaining spaces are available to Canadian citizens or landed immigrants. All
   applicants must be Canadian citizens or landed immigrants at the time of application."* This
   confirms IDDP is:
   (a) closed to applicants who are not already Canadian citizens or permanent residents (so an
       Indian citizen applying from India, without Canadian PR status, is ineligible regardless of
       any dental qualification they hold), and
   (b) even for eligible Canadian citizens/PRs, a **degree-completion program for already-qualified
       dentists** (must already hold a foreign dental degree; enters directly into Year 3 of the
       D.M.D. clinical curriculum), not an entry-level BDS-equivalent program for NEET-stage
       students who have not yet earned any dental degree.
   Only up to 10 seats are offered per year, with a maximum of 1 reserved for Saskatchewan
   residents and the rest for other Canadian citizens/landed immigrants — no seats for applicants
   who are neither.
   Sources:
   https://admissions.usask.ca/international-dentistry.php
   https://admissions.usask.ca/documents/IDDP.pdf (official PDF, "Categories of applicants" section)
   https://programs.usask.ca/dentistry/iddp/index.php (academic catalogue entry, confirms Year-3
   entry / 2-year degree-completion structure)

Because both the entry-level D.M.D. and the IDDP require Canadian citizenship or permanent
residency (IDDP explicitly; D.M.D. explicitly, with only a US-facing AADSAS carve-out that does
not extend to India-based applicants), mapping either to the `bds` course slug would misrepresent
the offering to Indian students who are looking for a first dental degree with a viable
application path from India. This is the same structural situation independently found and HELD
for both the University of Manitoba's Dr. Gerald Niznick College of Dentistry (see
`university-of-manitoba-dr-gerald-niznick-college-of-dentistry.md` in this same folder) and
Western University's Schulich School of Medicine & Dentistry (see
`western-university-schulich-school-of-medicine-dentistry.md`) — Canadian dental schools generally
reserve entry-level DMD/DDS seats for citizens/permanent residents, and only offer
degree-completion/upgrading pathways (IDDP-style) to internationally trained dentists who are
already Canadian citizens or PRs.

No other program at the College of Dentistry (Dental Assisting, Dental Therapy, Dental Hygiene,
DMD/MBA, or the graduate research degrees) is a dental-surgeon degree comparable to India's BDS, so
none was a candidate for the `bds` slug or any other course slug on this platform (no MBBS,
Nursing, or Pharmacy programs exist at the College of Dentistry — it is a dentistry-only college).

## What was omitted and why

- **Tuition/fees for a gate-passing program**: Not applicable — no gate-eligible program was found,
  so no fee content was drafted. (The Year-1 tuition figures above are cited only to document the
  research trail, not as content for a would-be published page.)
- **Regulator framing (NMC/PCI/INC)**: None applies here since no entry-level, India-accessible
  program pathway was found; correctly omitted rather than asserted.
- **Narrative content fields** (campus life, hostel, Indian food support, safety, student support,
  whyChoose, thingsToConsider, FAQ, etc.): Not drafted. Publishing narrative/marketing content
  around a program that Indian students cannot actually gain admission to would be misleading, even
  if grounded in real Saskatoon city facts.

## Full source list

1. University of Saskatchewan - College of Dentistry (official college homepage)
   https://dentistry.usask.ca/
2. USask Admissions - Dentistry (D.M.D.) program page (official; quick facts, tuition estimates,
   "Categories of applicants" section, citizenship/PR requirement, AADSAS pathway)
   https://admissions.usask.ca/dentistry.php
3. USask Admissions - College of Dentistry 2027-2028 Admissions Information Guide (official PDF;
   Section III "Categories of Applicants" contains the explicit "All applicants must be Canadian
   citizens or landed immigrants at the time of application" requirement, plus the Year-1 tuition
   table showing SK-resident/out-of-province/international tiers)
   https://admissions.usask.ca/documents/dentistry-admissions-information-guide.pdf
4. USask Admissions - International Dentistry (IDDP) page (official; program overview, eligibility
   summary)
   https://admissions.usask.ca/international-dentistry.php
5. USask Admissions - College of Dentistry IDDP Admissions Information Guide (official PDF;
   "Categories of applicants" section with the explicit citizenship/PR requirement and the
   1-Saskatchewan-seat / remaining-seats-for-citizens-or-landed-immigrants breakdown)
   https://admissions.usask.ca/documents/IDDP.pdf
6. University Catalogue - International Dental Degree Program (IDDP) entry (official academic
   catalogue; confirms Year-3 entry, 2-year degree-completion structure, NDEB exam eligibility on
   completion)
   https://programs.usask.ca/dentistry/iddp/index.php
7. College of Dentistry - Programs overview page (official; confirms full program list -
   Dental Assisting, Dental Therapy, Dental Hygiene, DMD/MBA, IDDP, graduate research degrees -
   none of which is an alternative entry-level dental-surgeon degree)
   https://dentistry.usask.ca/programs.php

## Recommendation

Hold this school/program. Do not publish a page for USask's College of Dentistry under the `bds`
course slug. The existing `university-of-saskatchewan.json` draft (Nursing + Pharmacy) remains the
correct, gate-passing page for this university; no separate Dentistry-specific page should be
published unless USask's admission policy changes to open a route for applicants who are neither
Canadian citizens/permanent residents nor applying through the US-facing AADSAS system. If the
platform later adds a course slug/category for "foreign-trained dentist upgrading/licensure
programs," IDDP could be revisited as a legitimate (but niche, citizens/PR-only, post-qualification)
offering — but even then it would not serve the India/NEET-stage audience this platform targets.
