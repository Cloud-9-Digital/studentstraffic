# Country, University & Program Page Architecture

Page structure and content budgets for destination and program expansion.
This document is the contract for research agents, content agents and frontend implementation.

## Product principle

These pages should help a student answer one question at a time:

1. **Country:** Is this destination right for my study goal and budget?
2. **University:** Is this institution credible and a good fit for me?
3. **Program:** Can I realistically apply, afford and benefit from this specific course?

Do not use a long article as the default layout. Each page is a decision surface made of short,
scannable modules. Every section must earn its place with a decision, comparison or next action.

## Global content rules

- Write to the stated limit. Do not fill unused space with generic advice.
- Every factual claim needs a source or must be omitted.
- Prefer numbers, dates, named facilities, named regulators and exact application routes.
- Never promise admission, employment, visa approval, salary, migration or recognition outcomes.
- Use Indian-student context only where a source supports it; do not make the page India-only.
- Country pages, titles, descriptions and structured content must describe the destination across its supported programs, not target one course by default.
- Use short paragraphs of 2–4 sentences, bullets of 5–12 words and tables for comparisons.
- The first screen must communicate identity, fit and the primary action in under 8 seconds.
- Mobile is the primary reading experience: no wide tables, no horizontal scrolling and no dense card walls.

### Content limits for AI agents

The recommended size is the normal editorial target. The hard maximum is a validator ceiling,
not a writing target. If research only supports 90 words, write 90 words. Headings, labels,
buttons, source notes and repeated metadata do not count toward narrative limits.

| Content unit | Maximum |
|---|---:|
| Hero title | 8 words |
| Hero supporting copy | 35 words |
| Section introduction | 45 words |
| Standard paragraph | 70 words |
| Compact insight card | 22 words |
| Bullet | 18 words |
| FAQ answer | 75 words / 3 sentences |
| Decision-point array item | 24 words |
| Internal evidence note | Not rendered publicly |
| Country page narrative copy | 900–1,400 recommended / 1,800 hard maximum |
| University page narrative copy | 1,300–1,900 recommended / 2,400 hard maximum |
| Program page narrative copy | 800–1,300 recommended / 1,700 hard maximum |

The validator should measure rendered narrative text after trimming whitespace and excluding repeated
labels. A page may exceed the recommended range when optional, evidence-rich sections are enabled,
but it must never exceed the hard maximum without an editorial override.

## Optional section model

Additional sections are expected. They must be declared in page configuration, not introduced through
page-specific conditionals or unrestricted AI prose. An optional section is enabled only when the
research bundle contains enough verified, useful information to justify it.

```ts
type PageSectionConfig<Key extends string> = {
  enabled: boolean;
  order?: number;
  variant?: string;
  maxWords?: number;
  sourceRequired?: boolean;
};

type PageSections<Key extends string> = Partial<
  Record<Key, PageSectionConfig<Key>>
>;
```

The renderer should merge page configuration with safe defaults, sort by `order`, omit disabled or
empty sections, and never render a heading without content. `maxWords` may reduce a default budget,
but should not increase it unless an editorial override is recorded.

### Optional country sections

| Section | Enable when | Recommended / hard limit |
|---|---|---:|
| Scholarships | Named scholarships, eligibility and deadlines are verified | 120 / 220 words |
| City guide | The country page covers materially different student cities | 150 / 260 words |
| Application calendar | Intakes and deadlines are reliable and current | 100 / 180 words |
| Student budget examples | Costs can be sourced for at least two cities | 120 / 220 words |
| Field spotlight | One field has meaningful destination-specific advantages | 140 / 240 words |

### Optional university sections

| Section | Enable when | Recommended / hard limit |
|---|---|---:|
| Scholarships and funding | The university publishes named funding options | 120 / 220 words |
| Rankings and reputation | A current, named ranking source is available | 100 / 180 words |
| Research strengths | Named labs, centres or externally verifiable research areas exist | 140 / 240 words |
| Co-op or placement model | A formal, documented structure exists | 140 / 240 words |
| International student journey | The institution documents arrival, housing and registration support | 140 / 240 words |
| Field-specific facilities | Facilities materially affect the selected course | 120 / 220 words |

### Optional program sections

| Section | Enable when | Recommended / hard limit |
|---|---|---:|
| Specializations | The official curriculum lists selectable tracks | 120 / 220 words |
| Professional accreditation | A named body accredits this exact qualification | 120 / 220 words |
| Placement or co-op | A formal, program-level placement structure is documented | 140 / 240 words |
| Licensing or exam pathway | The qualification leads to a regulated profession | 160 / 280 words |
| Portfolio or entrance test | A verified assessment is part of selection | 100 / 180 words |
| Scholarships | Program-specific funding is available and current | 100 / 180 words |
| Study-abroad or exchange | The program publishes a formal mobility option | 120 / 220 words |

Do not enable every optional section by default. A page should normally have no more than two
optional sections enabled. A third or later optional section needs a strong student decision benefit
and must stay within the page hard maximum.

Long-form source notes, raw evidence and unused research belong in the research draft, not the public page.

## Shared visual system

Use a **quiet editorial catalogue** direction: warm white canvas, brand ink, restrained brand accent,
strong type hierarchy, thin rules, compact data cards and one clear action color. Do not introduce
new palette colors or use orange text on green backgrounds.

### Layout rules

- Desktop: one centered reading rail, maximum 1,200px; use a two-column grid only when the second column is genuinely useful.
- Mobile: single column with 16px side padding; cards become full-width rows; secondary metadata moves below the title.
- Use section anchors as a horizontal scroll rail on mobile and a compact sticky section index on desktop.
- Use an editorial hero, not a giant banner: title, one-line positioning statement, 3–5 facts and one CTA.
- Use progressive disclosure for FAQs, cost details and long source lists.
- Use sticky mobile CTA only for the page’s primary action, not multiple competing buttons.
- Use `content-visibility: auto` for long below-fold sections and lazy-load non-critical media.
- All interactive controls need keyboard focus, labels, visible focus state and reduced-motion support.

## 1. Country page

### Page job

Help a student decide whether to shortlist a country before comparing universities and programs.

### Section order

| Order | Section | Content | Limit | Mobile treatment |
|---:|---|---|---:|---|
| 1 | Destination hero | Country name, honest positioning line, flag/image, 4 key facts, primary CTA | 35-word copy + 4 facts | Compact hero; facts in a 2×2 grid |
| 2 | Quick decision strip | Best for, language reality, budget level, strongest fields | 4 items × 24 words | Horizontal snap cards |
| 3 | Why students consider it | 3–5 evidence-backed reasons with caveats | 180 words total | Stacked numbered cards |
| 4 | Study fields | Engineering, business, computing and other supported fields; link to course pages | 8 fields maximum | Two-column list, no dense cards |
| 5 | Cost of studying | Tuition, living, deposits/fees and a low–high range with year/currency | 220 words + 1 table | Cost cards; table becomes labelled rows |
| 6 | Admissions route | Qualification, language tests, application route, intake and timeline | 220 words | Stepper with 4–6 steps |
| 7 | Visa and arrival route | Visa type, documents, funds, insurance, application sequence and arrival steps | 220 words | 5–7 stepper items; verification date remains internal |
| 8 | Work and post-study reality | Work rules, eligibility conditions and uncertainty dates | 180 words | Caveat-first cards; no guarantees |
| 9 | Universities to compare | 6–12 curated universities with one fit signal each | 12 × 22 words | Vertical list with filters |
| 10 | Student life | City types, housing, transport, language, support and safety | 180 words | 4 expandable topics |
| 11 | Country FAQs | Highest-intent questions only | 6–8 × 75 words | Accordion; one open at a time |
| 12 | Next step | Compare universities or request guidance | 35 words | Sticky CTA on mobile |

### Country page must not contain

- An encyclopaedia-style history section.
- Unverified rankings or “best country” claims.
- A university directory dump.
- Visa advice without an official source and verification date.
- Exact program eligibility presented as a country-wide rule.
- A country meta title, meta description or hero written around one program when multiple programs are available.
- More than one primary CTA.

## 2. University page

### Page job

Help a student decide whether to shortlist the institution and which programs deserve deeper review.

### Section order

| Order | Section | Content | Limit | Mobile treatment |
|---:|---|---|---:|---|
| 1 | University hero | Name, city/country, type, concise fit statement, recognition signals, CTA | 45-word copy + 4–6 facts | Name wraps naturally; facts become a swipe row |
| 2 | At-a-glance | Established, institution type, language, intake, tuition signal, international route | 6–8 facts | Label/value list, not tiles |
| 3 | Is it a fit? | Best for, consider carefully, strongest fields | 3 arrays × 3 items | Three stacked groups with short rows |
| 4 | Programs at this university | Published programs grouped by level/field, fee and duration | 12 visible; paginate the rest | Search/filter drawer; no giant card grid |
| 5 | Academic experience | Teaching model, labs, projects, placements/industry or practical training | 220 words | 3 evidence cards + short narrative |
| 6 | Recognition and credibility | Named regulator/accreditor, designation, scope and verification date | 3–6 badges; 160 words | Badge list with “what this means” expansion |
| 7 | Fees and living costs | Tuition, mandatory fees, housing and monthly living estimate | 240 words + labelled rows | Stacked cost rows with native currency first |
| 8 | Admissions | Eligibility, subject prerequisites, tests, documents, deadlines and application route | 260 words | 5–7 step timeline |
| 9 | Visa impact | Only institution/program-specific visa documents or conditions | 120 words | Dated caveat panel; link to country visa section |
| 10 | Campus and city | Campus, accommodation, transport, food, safety and student support | 300 words total | Topic tabs or accordions; no wall of text |
| 11 | Student outcomes | Only sourced placement, internship, employer or graduate-support facts | 160 words | Proof-point cards; omit if unsupported |
| 12 | FAQs | Questions that unblock application decisions | 8–10 × 75 words | Accordion with category labels |
| 13 | Final comparison CTA | Shortlist, compare programs or request guidance | 35 words | Sticky bottom action |

### University page must not contain

- Generic “modern campus” copy without named evidence.
- Recognition badges that are merely marketing claims.
- Medical fields or labels on non-medical university pages.
- Program details duplicated in full from the program page.
- Unsupported employment, salary or visa outcomes.

## 3. Program page

### Page job

Help a student determine eligibility, cost, application steps and fit for one specific program.

### Section order

| Order | Section | Content | Limit | Mobile treatment |
|---:|---|---|---:|---|
| 1 | Program hero | Degree, university, country, duration, medium, intake and primary CTA | 30-word copy + 6 facts | Facts in a compact horizontal rail |
| 2 | Decision summary | Best for, academic level, main constraint, cost band | 4 × 24 words | Four labelled rows |
| 3 | Course snapshot | Curriculum shape, specializations, assessment and practical component | 220 words | 4–6 expandable curriculum groups |
| 4 | Eligibility | Academic subjects/grades, language, exams, work experience and exceptions | 240 words | Checklist; separate “required” and “may be required” |
| 5 | Fees and budget | Tuition, mandatory fees, deposits, living estimate and total planning range | 220 words + rows | Budget calculator-style stack |
| 6 | Application process | Exact route, documents, deadlines, selection steps and offer stage | 240 words | Numbered stepper with dates |
| 7 | Outcomes and fit | Practical training, placements, progression or professional recognition | 180 words | Evidence-led cards; no promises |
| 8 | Visa and work context | Only program-relevant, sourced conditions and limitations | 140 words | Warning/caveat panel, dated |
| 9 | Compare alternatives | 2–4 closely related programs with one differentiator each | 4 × 30 words | Swipe comparison cards |
| 10 | FAQs | Program-specific blockers only | 6–8 × 75 words | Accordion |
| 11 | Apply/guide CTA | Clear next action and counselling option | 30 words | Sticky mobile CTA |

### Program page must not contain

- A broad country essay.
- University history that belongs on the university page.
- A curriculum invented from the course title.
- “Guaranteed jobs”, “easy visa” or similar claims.
- A fee without currency, academic year or source date.

## Visa section rules

Visa belongs on the country page because the destination usually determines the visa family,
application authority and broad process. It must be a practical overview, not legal advice.

### Country page visa content

Show only the shared destination process:

1. Visa or study-permit name
2. Who normally applies for it
3. When to start after receiving an offer
4. Core documents
5. Proof-of-funds or financial evidence category
6. Insurance, biometrics or medical requirements where applicable
7. Application authority and official application link
8. Arrival, registration or residence-permit step
9. Work and post-study link, without guarantees
10. Internal verification date and policy-change handling

Use a compact stepper or timeline. Do not place exact program eligibility, university-specific
documents or course-level visa exceptions here.

### University page visa content

Show only institution-specific help:

- Admission letter format or portal used
- University-issued documents
- Deposit or enrolment proof, if officially required
- International office support
- Arrival and registration support

Link back to the country visa section for the shared government process.

### Program page visa content

Show only what this specific program changes:

- Program duration and visa-length implications
- Full-time or attendance requirements
- Placement, co-op or internship conditions
- Work restrictions tied to the program type
- Any program-specific financial or academic condition

Every visa claim must have an official government or university source and a `lastVerifiedAt` date.

## AI content contract

Every agent output must return structured fields, not free-form prose. Each field should include:

```json
{
  "content": "…",
  "facts": ["…"],
  "sourceUrls": ["https://…"],
  "verifiedAt": "2026-07-11",
  "confidence": "high|medium|low",
  "omitReason": null
}
```

The validator should reject or hold content when:

- a field exceeds its character/word limit by more than 10%;
- a factual field has no source URL;
- a fee has no currency and verification date;
- an accreditation claim has no named body;
- a program has no official program URL;
- a paragraph repeats a fact already used in an earlier section;
- the content uses guarantees, invented rankings or generic filler.

## Public presentation of authority

Public country, university and program pages should not show citation links, source labels, research
notes or “sourced from” blocks. The information should read as clear, useful product content.

Authority is enforced behind the page:

- `sourceUrls`, claim evidence, source type and verification dates remain in the research/database layer;
- publishing validators check that material claims are supported before content becomes public;
- volatile claims are rechecked internally before their freshness window expires;
- conflicting or weakly sourced facts are held, softened or omitted;
- structured data contains only facts that are already visible and approved on the page.

Do not expose internal source URLs through visible page copy, citation widgets or unnecessary JSON-LD
properties. Keep the public page factual without turning it into a bibliography.

## Publishing checklist

Before publishing any page:

1. Confirm every section has a defined purpose and populated/explicitly omitted state.
2. Check all word limits and remove repetition.
3. Validate source URLs internally and confirm they match the claim.
4. Check mobile layout at 320px, 375px and 430px widths.
5. Check keyboard navigation, focus states, headings and image dimensions.
6. Check empty states for missing programs, fees, recognition or outcomes.
7. Revalidate only the affected country, university, program and sitemap/search tags.
8. Record `lastVerifiedAt` for volatile data such as fees, intakes and visa rules.
