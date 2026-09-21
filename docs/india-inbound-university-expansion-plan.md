# India Inbound University Expansion Plan

## Objective

Add India as a study destination for international students without turning the catalogue into an
India-only product or assuming that every applicant is eligible. The first release must help a
student from any origin country assess a verified, programme-specific route to an Indian university.

This is an **inbound India** initiative. It is separate from India-to-abroad and MBBS-specialist
pages, which remain useful but must not define the shared catalogue or eligibility rules.

## Launch principle

```text
Applicant origin + education profile + intended programme
→ verified India eligibility and restrictions
→ university and programme shortlist
→ application and immigration guidance
```

No page may imply that nationality, residency, qualification, visa, entrance-test, medical-council,
or scholarship eligibility is universal. Every material fact must meet the source and provenance
requirements in `content-seeding-runbook.md`.

## Phase 0 — product readiness (required before content research)

The existing catalogue stores programme-level audience restrictions, but the user journey does not
collect enough information to apply them. Define an applicant profile that can record:

- citizenship/passport country;
- current country of residence;
- country and system of prior education;
- completed or expected qualification and graduation year;
- intended level, discipline and intake;
- language-test status where a named programme requires it;
- budget currency and range; and
- destination preference.

Use this profile to label a programme as **eligible based on supplied information**, **needs
document review**, or **not currently eligible**. Do not present a definitive outcome when an
official rule requires transcript, exam, visa, or university review.

Before implementation, define the privacy notice, consent wording, retention policy, and whether
the first release offers application support, information-only guidance, or a combination by
university.

## Phase 1 — India destination foundation

Create one source-backed India country foundation before adding individual universities. It should
cover the national context relevant to international applicants, while keeping institution- and
programme-specific rules out of generic country copy.

Research must use the applicable official sources for:

- international-student admission and recognition pathways;
- immigration, student visa, registration and stay requirements;
- national higher-education and programme regulators;
- scholarship or exchange schemes; and
- restrictions that vary by nationality, residency, qualification, discipline, or institution.

The country page should describe what a prospective international student needs to verify, not make
unqualified claims about affordability, safety, recognition, placement, visa approval, or work
rights.

## Phase 2 — a small, multi-stream India pilot

Select 3–5 universities only after an evidence audit. The pilot should include a balanced mix of
institution types and programmes that actively publish international-admission information. Each
candidate must have:

1. a clear official international admissions route;
2. a complete programme inventory built per `docs/content-seeding-runbook.md` §1b
   (`research/india-programme-inventory/<university-slug>.csv` + `.md`), with every programme whose
   `intl_status` is `open_to_international` packaged — not a selected subset of UG/PG offerings —
   and any `GAP:` canonical-course row resolved before packaging;
3. current official fee information or an explicit on-request fee state, per programme;
4. verifiable institutional and programme recognition, checked against the regulator's own list
   (AICTE/UGC/NAAC/NBA/etc. as applicable), never the institution's site or an aggregator;
5. precise academic, language, entrance-test, nationality, and residency restrictions; and
6. a rights-safe logo and cover image, checked for legibility, hosted in Students Traffic Cloudinary
   and applied in the same publish as the content — a missing cover may be held only with a recorded
   reason.

Prioritise broad programmes with cross-border demand—such as computing, engineering, business,
sciences, design, public health, and selected health programmes—rather than starting with a
medical-only batch. Medical programmes are eligible only when their international route, regulator
requirements, and professional-recognition caveats are complete and specific.

Each university must be claimed in the shared publishing ledger, packaged as a numbered immutable
content migration, and pass offline validation. Research does not publish to the database; a user
controlled `content:migrate -- --apply` window remains required.

## Phase 3 — public experience

Launch the following in sequence:

1. `Study in India` country page with destination-level metadata.
2. India university and programme pages with exact public eligibility restrictions.
3. Finder filters for country, programme, teaching language, intake, fee state, and verified
   applicant-fit signals.
4. A shortlist flow that requests the minimum profile information needed to explain fit.
5. Clear CTAs that state the available support for that university and applicant route.

Do not create country-pair SEO pages such as “Study in India for [nationality]” until the
origin-specific rules, offer, and review workflow are genuinely supported. A generic pair page is
not an acceptable substitute for verified admissions guidance.

## Phase 4 — expansion gates

Expand to additional Indian universities only after the pilot demonstrates all of the following:

- every pilot programme has complete, current source evidence and no unresolved eligibility hold;
- the applicant profile can represent the restrictions encountered in the pilot;
- counsellors can explain the supported application route without relying on India-only assumptions;
- search, sitemap, canonical metadata, and social previews work for the new country and programme
  URLs; and
- a spot audit confirms that public content matches official sources and the internal evidence record.

Then expand by programme cluster and international-admission maturity, not by an unsourced ranking
or a blanket “top Indian universities” list.

## Decisions required before research begins

- Which applicant origins are the first commercial focus?
- Is the first release information-only, assisted application, or partner referral for each pilot
  university?
- Which levels and disciplines are in scope for the pilot?
- What is the support boundary for visa, accommodation, scholarship, and post-arrival guidance?
- Who owns admission-policy and source freshness reviews after publication?

## Delivery order

1. Approve the commercial and support boundaries above.
2. Design and implement the applicant-origin profile and fit labels.
3. Research and package the India destination foundation.
4. Select and evidence-audit the 3–5 university pilot.
5. Package validated content migrations; review them before the controlled publish window.
6. Run public-page and eligibility QA, then decide whether to expand.
