# Students Traffic

Students Traffic is a study-abroad lead generation website focused on helping Indian students discover, compare, and enquire about universities, courses, and destinations across streams.

This codebase is the new greenfield version of the business, built fresh rather than migrated from the existing WordPress site. The long-term goal is to support thousands of university pages, high-intent country/course landing pages, strong SEO and pSEO, AI-readable structured content, and lead capture across the entire funnel.

## Business Context

The site is being built for:

- high-intent organic search traffic
- users comparing study-abroad options by country, course, fees, eligibility, hostel, and licensing fit
- lead capture on every important commercial page
- long-term scale across countries, courses, and universities

The long-term product scope is not limited to medical. The plan is to cover multiple streams and courses over time, including undergraduate, postgraduate, and professional programs across countries.

Phase 1 starts with medical education, especially MBBS-related destinations such as:

- Russia
- Vietnam
- Georgia
- Kyrgyzstan

India is intentionally delayed for later because of the volume and complexity of university data.

## Key Product Decisions

These decisions are intentional and should be treated as the current baseline unless business needs change.

### 1. No WordPress migration

The existing WordPress website is only a reference for business direction and content ideas. No legacy data is being migrated into this app.

### 2. Database-first architecture

University and program content is stored in the database, not in one file per university.

Reason:

- we need thousands of pages
- the finder needs real filters
- one university can have multiple programs and multiple attributes
- updates should roll across search, filters, and related pages from one source of truth

### 3. No CMS in phase 1

There is deliberately no CMS right now.

Current content workflow:

- structured university/program data lives in PostgreSQL
- curated editorial landing pages live in code/content files

If content operations become painful later, a CMS such as Payload can be added, but it is not part of v1.

### 4. Quality-first pSEO

The goal is not to mass-generate thin pages.

Indexable pages should have:

- unique commercial/search intent
- structured facts
- useful comparison content
- FAQs
- internal links
- lead capture

Filtered search pages should remain crawl-safe and not compete with curated destination pages.

### 5. Light-only design

The interface is intentionally light-only. The visual direction should stay modern, professional, and trustworthy, not dark-mode-first.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Neon Postgres
- Drizzle ORM
- ParadeDB `pg_search`
- PostgreSQL `pg_trgm`
- `react-phone-number-input`

## Current Architecture

### Rendering model

This is an App Router application using server components by default. Data access stays server-side. Search params and route params follow Next.js 16 async patterns.

### Data architecture

The current architecture is hybrid:

- PostgreSQL stores structured, reusable catalog and business data
- code/content files store curated editorial landing pages

This split is important:

- structured data scales better in DB form
- editorial pages are easier to control as handcrafted content

### Search architecture

Search is Postgres-native and currently does not depend on Algolia, Typesense, or Elasticsearch.

Current search stack:

- `pg_search` for BM25-style ranking
- ParadeDB query builders for exact and fuzzy matching
- `pg_trgm` fallback for similarity
- a denormalized `search_documents` table as the searchable index

This gives us:

- keyword search
- typo recovery
- structured filters
- one source of truth
- no external sync layer

The database has also been prepared with the `vector` extension for future semantic/AI retrieval, but embeddings are not implemented yet.

## Core Data Model

The main schema lives in `lib/db/schema.ts`.

### Current entities

- `countries`
- `courses`
- `universities`
- `program_offerings`
- `leads`
- `search_documents`

### Why `program_offerings` matters

Filtering is modeled at the program level, not only at the university level.

This matters because one university may have:

- different courses
- different fee structures
- different teaching language realities
- different intake months
- different licensing-fit signals

### Rich university content

University records are designed to support both human readers and AI/search retrieval.

Current university content structure includes fields such as:

- summary
- official website
- campus lifestyle
- city profile
- clinical exposure
- hostel overview
- Indian food support
- safety overview
- student support
- why choose
- things to consider
- best fit for
- teaching hospitals
- recognition badges
- recognition links
- FAQs
- references
- similar university slugs

### Rich program content

Program offerings currently include:

- title
- duration
- annual tuition
- total tuition
- hostel cost
- living cost
- official program URL
- medium of instruction
- teaching phases
- yearly cost breakdown
- NMC eligibility
- USMLE fit
- licensing notes
- hostel availability
- intake months

## Routes

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Brand homepage |
| `/universities` | University finder with filters |
| `/universities/[slug]` | University detail pages |
| `/{course}-in-{country}` | Curated landing pages such as `/mbbs-in-russia` |
| `/countries/[slug]` | Country hub pages |
| `/courses/[slug]` | Course hub pages |
| `/search` | Cross-catalog search |
| `/thank-you` | Lead submission confirmation |
| `/robots.txt` | Robots rules |
| `/sitemap.xml` | Sitemap index |
| `/universities/sitemap/[id].xml` | University sitemap slices |

### Route strategy

- curated landing pages are intended to rank
- university detail pages are intended to rank
- finder/search/filter pages are utility surfaces first

## SEO Strategy

This project is built for search engines, LLMs, and AI agents, not just traditional pageviews.

### Principles

- prefer source-backed content over generic brochure copy
- keep important facts structured and explicit
- include FAQ and breadcrumb schema
- give each destination page a clear commercial/search purpose
- use internal linking between countries, courses, universities, and landing pages

### Current implementation

- route-level metadata
- sitemap generation
- robots generation
- breadcrumb JSON-LD
- FAQ JSON-LD
- university structured data

### Important SEO rule

Do not turn arbitrary filter combinations into indexable thin pages.

## Search Strategy

The search logic lives in `lib/search/search.ts`.

### Current behavior

Search ranking combines:

- BM25 relevance from ParadeDB
- fuzzy matching from ParadeDB query builders
- trigram similarity fallback
- small business-aware boosts for featured or curated result types

This is tuned so that:

- exact university-name searches rank the university first
- typo searches still recover useful results
- broad commercial queries such as `mbbs russia` prefer the curated landing page

### Search index source

The `search_documents` table is built from:

- countries
- courses
- universities
- program offerings
- curated landing pages

The document builder lives in `lib/search/documents.ts`.

## Lead Capture

Lead capture is a first-class feature, not an afterthought.

### Current behavior

All forms are normalized into one lead pipeline.

Captured data includes:

- name
- phone
- email
- notes
- course slug
- country slug
- university slug
- source path
- CTA variant
- UTM parameters
- referrer

### Relevant files

- `app/_actions/submit-lead.ts`
- `components/site/lead-form.tsx`
- `proxy.ts`

### Important implementation note

UTM capture happens at the proxy layer and is persisted into cookies for later form submission attribution.

## UI System

The project uses shadcn/ui as the base component system.

### Current UI principles

- light-only
- semantic design tokens
- trustworthy and professional visual direction
- reusable components over page-specific hacks

### Current shadcn components in use

- badge
- button
- card
- input
- label
- textarea
- separator
- accordion
- table

Custom UI should stay aligned with this system unless there is a strong reason not to.

## Content Strategy

### What goes in the database

Use the database for scalable structured content such as:

- university facts
- program facts
- hostel/fee/licensing details
- FAQs
- references
- search documents
- leads

### What stays in code/files

Use code/content files for curated editorial pages such as:

- homepage messaging
- country-course landing pages (`lib/data/landing-pages.ts`)
- special campaign or comparison pages

### Why this split exists

Thousands of university pages are easier to scale from structured data. High-value editorial pages are easier to keep sharp and differentiated in code.

## Environment Variables

Create an `.env` or `.env.local` with:

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
MEDIA_HOSTNAMES=cdn.example.com,res.cloudinary.com
```

Important:

- never expose `DATABASE_URL` to client-side code
- database access must stay server-only
- `MEDIA_HOSTNAMES` should list any external image/CDN hosts used for university media

## Local Development

### Install

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

### Database workflow

```bash
npm run db:generate   # generate Drizzle migration files
npm run db:push       # push schema changes to the database
npm run db:seed       # rebuild the search_documents index from live DB data
npm run db:studio     # open Drizzle Studio
```

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Important Files

| File | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage |
| `app/universities/page.tsx` | Finder page |
| `app/universities/[slug]/page.tsx` | Rich university page template |
| `app/[slug]/page.tsx` | Curated landing pages |
| `app/search/page.tsx` | Search UI |
| `lib/db/schema.ts` | Drizzle schema |
| `lib/data/catalog.ts` | Catalog access and transformations |
| `lib/data/landing-pages.ts` | Curated landing page content |
| `lib/search/documents.ts` | Search document builder |
| `lib/search/search.ts` | Search ranking/query logic |
| `scripts/seed.ts` | Database seed script |
| `proxy.ts` | UTM/referrer cookie capture |

## Current Status

The site is live in production on Neon PostgreSQL with real university data.

What is implemented:

- Next.js 16 App Router foundation
- Neon + Drizzle integration with production data
- normalized database schema
- university finder with filters
- country/course/university routes
- medical-first curated landing pages (`lib/data/landing-pages.ts`)
- lead capture and UTM attribution
- sitemap and robots support
- Postgres-backed search with BM25 + trigram fallback
- rich university detail template
- live currency converter (INR ↔ local currency via fawazahmed0 API)
- recognition badge filtering (NMC, WHO, WFME, FAIMER only)
- `db:seed` now rebuilds the search index from live DB data — it does not touch the main tables

## What Is Not Implemented Yet

These are expected future steps, not regressions.

- real large-scale university imports
- CMS/admin interface
- CRM sync
- notification fan-out
- semantic/vector search
- India-scale university coverage
- broader multi-stream and multi-course rollout beyond the medical-first launch slice

## Recommended Next Steps

1. create a repeatable import pipeline for adding new universities and programs to the DB
2. expand landing pages in `lib/data/landing-pages.ts` with deeper source-backed editorial content
3. add more country destinations after the medical-first template quality is proven
4. expand into other streams and course families using the same architecture
5. add admin/CMS capabilities only when manual content operations become a bottleneck

## Notes for Future Contributors

- respect the database-first architecture
- do not move scalable university content into one-off static files
- do not expose server credentials to client code
- keep search/filter pages crawl-safe
- prefer structured fields over giant unstructured text blobs
- maintain light-mode-only design unless the product decision changes
- use shadcn/ui components where possible
- if content volume grows, improve import and ops workflows before adding more manual editing burden

This README should be treated as the current product and architecture reference for the Students Traffic project.
