# Content Seeding & Publishing Runbook

This is the canonical instruction for adding countries, universities and programs to Students Traffic.
Future agents must read this file before researching, drafting, importing or publishing study-abroad
content. Do not use historical country-specific seed scripts as templates.

## Non-negotiable content standard

Students Traffic publishes verified information, not generated opinions. The public page must be useful
without displaying a bibliography, but every material claim must be supported internally by an
appropriate source.

- Use primary sources first: government, regulator, university, official application portal and official fee/visa pages.
- Store source URLs, source type, claim evidence and verification date in the internal provenance record.
- Omit facts that cannot be verified. Never guess missing fees, deadlines, recognition, outcomes or visa rules.
- If authoritative sources conflict, record the conflict and hold the claim until resolved.
- Never promise admission, visa approval, employment, salary, migration or recognition outcomes.
- The catalogue serves a global audience. A legitimate university programme may be published even
  when it is unavailable to Indian applicants, international applicants, student-visa holders or a
  particular nationality/residency group. Store and display the restriction precisely; never imply
  that every reader is eligible.
- Do not write country pages around one program. Program-specific SEO belongs on program pages.
- Do not expose source URLs, research notes or citations in the public page unless product requirements change.

The public page may use strong design and clear labels, but “best”, “easy”, “affordable”, “safe”,
“highly ranked” and similar claims require explicit evidence and careful qualification.

## Canonical workflow

```text
Define scope → research official sources → build complete payload → validate everything
→ publish canonical records atomically → refresh search/cache → QA public URLs
```

### 1. Define scope before research

Create a scope record containing:

- country slug;
- target study levels;
- target streams and canonical course slugs;
- priority universities;
- whether the page is country-, university- or program-level;
- required optional sections;
- research owner and review date.

Do not begin with a free-form prompt such as “write everything about this country”.

### 1a. Claim the university in the shared publishing ledger

Before researching a university, every agent must read
`research/university-publishing-ledger.csv` and check both the canonical university slug and known
name aliases. If a row is already `claimed`, `researching`, `validated` or `published`, do not start
duplicate work unless the existing owner explicitly hands it over.

To claim new work, append or update one row with:

- canonical university slug and official name;
- country slug;
- `status=claimed`;
- the agent/thread identifier in `owner_agent_id`;
- an ISO-8601 `claimed_at` timestamp;
- intended payload path;
- a short scope note.

Allowed statuses are `claimed`, `researching`, `held`, `validated`, `published` and `abandoned`.
Update the same row as work progresses; never add a second row for the same institution. Historical
names, campuses and faculties must be checked so a renamed institution is not claimed twice.

Because CSV files do not provide transactional locking, the publishing agent must re-read the ledger
and query the live database immediately before publication. If another owner has published or claimed
the institution, stop and reconcile rather than overwriting it. After a successful transaction,
record `status=published`, `published_at`, the final programme count and payload path.

### 2. Use the canonical taxonomy

For every programme stream and qualification level, use the approved registry in
[`programme-taxonomy.md`](./programme-taxonomy.md) and `lib/data/program-taxonomy.ts`. Store the
university's exact official programme title separately from the global canonical programme
name. An agent must never create a new catalogue name while publishing a university.

Do not create one generic course called `engineering` when the source distinguishes Computer,
Mechanical, Civil or Electrical Engineering. Course rows should represent the decision students make.

Examples:

- `be-btech-computer-science-engineering`
- `be-btech-mechanical-engineering`
- `msc-computer-science`
- `me-mtech-civil-engineering`
- `msc-engineering-management`
- `msc-business-analytics`
- `mba`

Research the university's complete supported undergraduate and postgraduate portfolio. Master's
programmes are important catalogue records and must not be omitted simply because a bachelor's
programme has already been published. Publish only exact canonical matches and retain the official
award title separately; record unmatched specialisations in
`research/programme-taxonomy-gaps.md` with the university and official programme source, then hold
them for taxonomy review.

Before creating a course, check for an existing equivalent. Do not create duplicate slugs or two
course rows that mean the same thing. A program offering must map to exactly one canonical course.

### 3. Research in source bundles

For each university and program, collect separate source records for:

- official identity and location;
- recognition/accreditation;
- official program page;
- admission and eligibility;
- language requirements;
- tuition and mandatory fees;
- intake and deadline;
- accommodation and living costs;
- visa and immigration;
- scholarships;
- work, placement or professional progression.

A university website alone is not enough for visa rules, national recognition or post-study work
claims. Add the relevant government or regulator source for those claims.

Audience eligibility is programme data, not a global publication gate. Research citizenship,
residency, nationality, prior-qualification, location and visa restrictions explicitly. A local-only
programme can still have a factual catalogue page when its restriction is prominent.

### 4. Build the complete publishing payload

AI agents must return one complete structured payload matching the destination schema and page
architecture. They must not return a long article for an agent to split later, and they must not
publish section-by-section.

Each material claim must carry internal provenance:

```json
{
  "text": "The program is taught in English.",
  "sourceUrl": "https://official.example/program",
  "sourceType": "university",
  "verifiedAt": "2026-07-11",
  "confidence": "high"
}
```

Public copy limits and page order are defined in
[`university-page-architecture.md`](./university-page-architecture.md). Field-level depth and
research quality rules are defined in [`university-content-spec.md`](./university-content-spec.md).

University media is part of the payload. Prefer an official logo and a high-quality campus/location
cover from an official media kit, a clearly reusable licensed source, a user-supplied asset or an
original generated image. Store the source URL, rights basis, verification date and cover alt text.
Never copy an arbitrary search-result image or publish an asset with unclear usage rights.

Student-living media is optional and section-specific. When rights-safe assets exist, provide at most
one image each for campus environment, accommodation, daily living and safety/support through
`mediaAttribution.studentLife`. Do not reuse one image across all four sections merely to fill space.
Upload every selected asset to Cloudinary and retain its original source, rights basis, checked date
and alt text. If no suitable image exists, omit it; imagery must never delay otherwise valid content.

### University media hosting — mandatory

All public university logos and cover images must be copied into the Students Traffic Cloudinary
account before publication. Never save an external university, CDN, stock-site or search-result URL
in `universities.logo_url` or `universities.cover_image_url`.

Required order:

1. verify that the source asset is official, reusable, user-supplied or an approved original;
2. upload it to Cloudinary under `studentstraffic/universities/<university-slug>/`;
3. store only the resulting `https://res.cloudinary.com/...` URL in the public logo/cover field;
4. preserve the original source URL, rights basis, checked date and cover alt text in
   `media_attribution`;
5. confirm the Cloudinary asset returns HTTP 200 before publishing the university;
6. revalidate the university cache after assigning or replacing media.

Do not use a favicon as a university logo when an approved SVG or high-resolution brand asset is not
available. Leave the logo empty until a suitable asset is obtained. Do not hotlink external images,
even when the external source is the university's official website.

### 5. Validate before writing anything

Validation runs against the complete payload in memory. The framework must reject the entire payload
if any required section, optional enabled section, metadata field or program offering fails validation.
No public database row is written until validation completes successfully.

At minimum, validation checks:

- every section stays within its hard word/character limit;
- enabled optional sections contain approved content;
- disabled sections are not accidentally populated as public content;
- title and description length limits are respected;
- the focus keyword appears naturally in the meta title and meta description;
- the focus keyword matches the page level and target intent;
- no metadata or page copy targets an unrelated page type;
- sources, fees, deadlines and visa information pass freshness rules;
- all university/course relationships are valid and unique.

### 6. Apply section configuration

Optional sections must be explicitly enabled by structured configuration. Never add a section because
the model found extra text.

```ts
{
  sections: {
    scholarships: { enabled: true, variant: "named-options" },
    studentCities: { enabled: false },
    visa: { enabled: true, variant: "stepper" }
  }
}
```

Rules:

- empty sections are omitted;
- a heading is never rendered without approved content;
- `maxWords` may reduce a default limit, never silently increase it;
- normally enable no more than two optional sections per page;
- visa is country-level by default, university/program-specific only where the institution or course changes the process.

### 7. Publish atomically

After validation passes, publish the complete payload in one transaction. The transaction must either
write the complete country/university/program content or write nothing.

The publish operation must:

- upsert the canonical country, university, course and program records;
- write optional section configuration with the page payload;
- preserve internal source/provenance data;
- update search documents;
- revalidate only affected cache tags;
- recalculate sitemap promotion from the published record's actual content depth;
- write a publish audit record.

If any database, search or cache step fails, report the failure clearly and do not mark the payload as
published.

### 8. Publish/hold rules

Reject the complete payload when any of these is true:

- a material claim has no source record;
- a fee has no currency, academic year or verification date;
- a deadline or intake is stale or unsupported;
- a recognition badge does not name a real body/designation;
- a visa/work claim lacks an official government source;
- a program has no official program URL;
- a programme has an eligibility restriction that is omitted, softened or contradicted by the page;
- country metadata targets one program;
- content exceeds the hard page or field limit;
- the copy contains guarantees, invented rankings, placeholder text or generic filler.

### 9. Use the validation framework

No new content may be inserted directly with SQL, Drizzle or an ad-hoc script. Use one atomic,
validated publishing path:

- the content publishing framework for country, university and program payloads;
- the authenticated blog publishing workflow for blog posts;
- `/api/revalidate` or the approved cache workflow for country/university/program changes.

Database-only content publication does not require a Vercel build. It does require the approved
post-commit search sync and cache/path revalidation before the payload is considered published.
Never use a deployment as a substitute for cache invalidation.

The old draft importer and one-off seed scripts are retired. A failed validation must abort the whole
publish operation; partial or silently skipped content is not considered published.

The framework must perform these checks before a public row is written:

- canonical slug and course mapping;
- required field and section limits;
- authoritative source/provenance records;
- fee, intake, eligibility and visa freshness rules;
- page-level focus keyword and metadata relevance;
- duplicate university/course protection;
- safe optional-section configuration;
- publish status and cache/search revalidation.

Do not create `seed-<country>-batch<N>.mjs`, `seed-<university>.mjs` or one-off enrichment scripts.

### 8. Verify the public result

After publication:

1. Check country, university and program URLs return 200.
2. Check the page is destination/program appropriate and contains no medical-only assumptions.
3. Check title and description are level-appropriate.
4. Check mobile at 320px, 375px and 430px widths.
5. Check optional sections show or hide correctly.
6. Check search documents and sitemap entries are refreshed.
7. Revalidate only affected cache tags.
8. Record the publish and verification result in a run report.

Sitemap inclusion is a quality signal, not a completeness dump. Base country, university and
programme pages remain eligible when published. A programme or university section URL is promoted
only when its corresponding verified fields meet the sitemap policy documented in
`docs/university-pipeline-architecture.md`. A section that does not qualify remains accessible to
users; withholding it from the sitemap must not turn it into a 404, redirect it, or change its
canonical as part of an automated publishing batch.

## Metadata rules

### Country metadata

Country metadata must target the country page and its destination-level search intent:

```text
Focus keyword: study in {Country}
Meta title: Study in {Country} | Universities, Programs & Fees
Meta description: Compare universities and programs in {Country} by tuition, admissions, student life, and visa process.
```

Do not make a country page target one program when the page covers multiple programs. Program-specific
keywords belong to course and program pages.

### University metadata

University metadata must use the university name as the focus keyword and accurately describe the
institution and its published program breadth. It must not claim an unsupported specialization,
ranking or outcome.

### Program metadata

Program metadata must use the exact official program title, university and/or country as the focus
keyword set because that is the purpose of the page. It must match the official program title and
current availability.

## Database rules

- Countries, universities and courses use stable slugs.
- Every published university must have a country.
- Every published program must reference a university and canonical course.
- A programme offering is identified by its globally unique programme slug. Multiple distinct
  offerings at one university may map to the same canonical course; never overwrite one merely
  because the canonical course matches.
- Do not add columns for one country or one profession; use neutral fields or structured content.
- Do not store raw research prose in public fields when a structured field is available.
- Preserve source bundles and review notes for auditability.

## What belongs in this runbook

Update this document when the schema, page architecture, validation rules, content limits, publishing
workflow or source-quality standard changes. Historical scripts, old prompts and one-off country
decisions do not belong here; record those in run reports or the archive instead.
