# Catalogue Content Framework

This is the operating standard for country, university and programme content.
It exists to make Students Traffic pages authoritative, useful and commercially effective without
turning them into editorial articles, source libraries or generic lead-generation pages.

Read this with `project-standards.md`, `content-seeding-runbook.md`,
`university-page-architecture.md` and `university-content-spec.md` before researching, writing or
publishing catalogue content.

## Product rule

Every public page is an admissions decision surface. It must help a visitor decide what to do next
and make the relevant Students Traffic service easy to start.

Public content follows this sequence:

```text
Verified fact -> practical implication -> relevant next action
```

Examples:

- A language requirement explains whether the applicant can enter now, then offers an eligibility
  assessment.
- A fee position explains the planning range, then offers a cost and funding plan.
- A scholarship explains who can apply and what it covers, then offers a scholarship-fit review.

Do not publish content as a detached article, a research report, or a collection of caveats asking
the visitor to verify the work themselves.

## Public voice and private evidence

Public pages are Students Traffic guidance. They do not display source URLs, citations, research
notes, confidence labels or instructions to "verify" information elsewhere.

Evidence stays private in the research bundle and provenance record. Every material claim must have:

- the exact claim and the public field it supports;
- one or more internal sources;
- source grade, checked date and review-by date;
- a content status: `verified`, `indicative`, or `omit`.

If a claim cannot meet the right evidence bar, omit it. Do not replace it with generic wording such
as "students should verify", "details are being checked" or "opportunities may be available".

### Source grades

| Grade | Permitted use |
|---|---|
| A - primary | University documents and portals, official PDFs, government, regulator and accreditor records. Required for high-stakes claims where available. |
| B - corroborated | Independent, credible sources that agree. May support an explicitly indicative cost range or practical context. |
| C - discovery | Search snippets, agency posts and unattributed lists. Use only to find stronger evidence; never publish their claim as fact. |

Evidence must fit the claim. For example, a university website may establish the programme title,
but a government source is required for a visa rule and a regulator/accreditor source is required
for a recognition claim.

## Fee policy

A missing fee must not force a programme to disappear, but it must never become a false zero,
placeholder amount or unsupported "starting from" claim.

| Fee status | Public treatment | Catalogue treatment |
|---|---|---|
| `confirmed` | Exact amount, currency, academic year and mandatory charges where known. | Eligible for fee comparisons and price filters. |
| `indicative` | A clearly labelled range with planning context. | May appear in general results, never as an exact cheapest-price claim. |
| `on_request` | The programme's current international fee is not publicly available; offer a current cost-plan request. | Excluded from price filters, fee rankings and low-cost claims. |

When tuition is unavailable, publish useful known cost components only: accommodation, insurance,
application fees, deposits, transport and realistic living costs. The relevant CTA is **Get a current
fee and full-cost plan**, which captures the intended intake, budget, accommodation preference and
funding need.

## Page ownership

```text
Country: destination suitability and shared government process
University: institutional credibility, programme choice and student environment
Programme: eligibility, cost, application, learning and outcome decision
```

University pages must not duplicate programme-level curriculum, eligibility, fee or licensing detail.
Programme pages must not repeat broad country essays or university history.

## Section publication contract

Sections are optional. A section is not a template obligation and must not be created merely because
a route exists in code.

Every section has one of these states:

```text
absent -> no public navigation, route or sitemap entry
research_ready -> private research/payload only
published -> complete, distinct and eligible for public navigation and indexing
```

An indexed section URL must stand on its own. It needs a distinct question, unique title, unique
decision content, internal evidence and a relevant CTA. A thin tab, placeholder, generic fallback or
duplicated overview is not publishable.

### Core programme sections

| Section | Publish only when it can answer |
|---|---|
| Decision summary | Who it fits, the main constraint, language reality, cost status and next intake. |
| Eligibility | Exact academic, language, test, work-experience and restriction rules. |
| Fees and budget | Fee status, currency/year where known, mandatory charges and usable planning range. |
| Academics and practical learning | Curriculum shape, named modules/facilities/partners, assessment or progression. |
| Admissions | Route, documents, steps, intake/deadline and selection stages. |
| Recognition and outcomes | Named authority and scope; only verified co-op, placement, licensing or progression facts. |
| FAQs | Programme-specific blockers that are not already answered above. |

### Evidence-earned optional sections

- **Scholarships:** named current opportunity, eligibility, coverage, deadline and application route.
- **Funding:** only a cost-planning CTA or a verified institutional arrangement. Do not imply loan
  approval or a university lender relationship.
- **Placements/outcomes:** formal co-op, named employer/partner, verified outcome data or a documented
  professional pathway. Medical pages use clinical learning and licensing, not generic placements.
- **Rankings:** current, relevant ranking with internal evidence and decision value.
- **Student perspective:** only where a genuine peer, review or approved experience exists.

## No-filler standard

Every sentence must do at least one of the following:

- state a decision-relevant fact;
- explain an eligibility, cost, timing or process implication;
- name a facility, partner, module, award, portal or requirement;
- identify a concrete trade-off;
- direct the visitor to an appropriate next action.

Delete text that does none of these. Banned filler includes unsupported variants of: "world-class",
"modern facilities", "excellent exposure", "great opportunity", "affordable option", "students
should verify", "details are being checked", and generic licensing or career boilerplate.

Depth is measured by decision completeness and fact density, not a word target. A concise fee page
with a complete cost position is stronger than a long generic fee article. A section may be long only
when each additional fact resolves a real applicant decision.

## Conversion contract

Commercial intent is part of the page, but follows the visitor's immediate question.

| Decision point | CTA | Minimum capture |
|---|---|---|
| Overall fit | Get my shortlist verdict | Programme/country interest and contact method |
| Eligibility | Check my eligibility | Current qualification, grades and language/test status |
| Fees | Build my cost and funding plan | Intake, budget and funding need |
| Scholarships | Check scholarship fit | Academic profile and intended intake |
| Admissions | Start my application review | Document readiness and intended intake |
| Recognition/outcomes | Plan my professional pathway | Intended career destination |
| General support | Speak to an admissions advisor | Preferred contact time and language |

Use progressive profiling. Do not repeatedly request the same full form. Preserve earlier lead data,
add only the information required for the next service, and give counsellors a useful internal brief.

Internal lead readiness may be classified as `ready_now`, `needs_preparation`,
`funding_needed`, `later_intake`, or `not_currently_eligible`. Never expose this score as a public
judgement.

## Quality and freshness gate

Before a page or section becomes public, deterministic validation must check:

- required decision fields for that section;
- internal evidence coverage for every material claim;
- source grade appropriate to the claim;
- current review date for fees, intake, eligibility, scholarships, recognition and visa claims;
- fee status and prohibited price behaviour;
- unique section content with no generic fallback or duplicated narrative;
- banned filler and unsupported guarantee checks;
- title/metadata that match the section's real content;
- correct contextual CTA.

Suggested freshness windows:

| Claim type | Review window |
|---|---:|
| Fees, intake, admissions, scholarships | 60-90 days during the active cycle |
| Recognition and licensing | 90-180 days |
| Housing and living costs | 6-12 months |
| Stable campus/institution facts | 12 months |

When a high-stakes claim expires, hide that claim or move the relevant page/section to review. Do
not leave stale content public and ask visitors to validate it themselves.

## Token-efficient research workflow

Avoid multi-agent research, writing and review loops for every programme.

```text
Reusable country fact pack
  -> one university/programme evidence packet
  -> local validation without database access
  -> one structured payload-writing pass
  -> targeted repair only for named validation gaps
```

- Reuse country-level facts only at country scope; never use them as a programme-specific fallback.
- Research high-risk claims first: eligibility, admissions, fees, recognition and restrictions.
- Use a limited, strong source set rather than open-ended browsing.
- Agents produce structured facts and internal evidence once; reusable UI modules supply the shared
  labels, layouts and CTAs.
- Use code for completeness, freshness, duplicate and filler checks. Reserve further agent work for
  a specific missing fact or conflict.
- Prefer high-demand programmes with accessible evidence. Hold difficult candidates instead of
  spending repeated turns manufacturing a complete-looking page.

## Publishing states

```text
researching -> research_ready -> decision_ready -> published -> needs_refresh -> held
```

Only `decision_ready` content may receive a public, indexable page. `overview_only` may be used for
an institution where the identity is useful but a programme is not yet decision-ready; it must not
masquerade as a complete admissions or fee guide.

## Implementation direction

The existing numbered content-migration process remains the delivery and audit mechanism. This
framework adds the publication-quality layer above it:

```text
content migration = immutable delivery
content framework = evidence, usefulness, freshness and conversion eligibility
```

Implement the framework first for a small benchmark batch of high-demand programmes. Use those
pages to calibrate research effort, conversion performance and validation rules before applying the
standard to legacy catalogue pages.
