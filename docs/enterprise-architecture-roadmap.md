# Enterprise Architecture Roadmap

## Product role of this repo

`studentstraffic` is the acquisition, discovery, comparison, and conversion frontend.

It is not the downstream CRM.

This repository should own:

- the public catalog and program experience
- landing pages and conversion flows
- search, finder, compare, saved choices, and recommendation surfaces
- lead capture, attribution, and handoff preparation
- bot-safe and scalable public delivery

This repository should not own:

- counselor workflow management
- admissions-stage CRM operations
- agent task queues for counselor users
- downstream lead lifecycle after handoff

Those belong in `/Users/bharat/Documents/students-traffic-crm`.

## Goal

Build Students Traffic into a high-scale admissions acquisition platform that can:

- present thousands of colleges and many more programs
- help students compare options and enquire confidently
- capture high-context leads with attribution and intent
- hand leads off cleanly to the CRM
- stay fast and cost-stable under search and crawler traffic

## Core system layers

### 1. Source-of-truth catalog

Neon/Postgres remains the operational source of truth for:

- countries
- courses
- universities
- program offerings
- supporting evidence and content fields
- lead capture records and sync telemetry

### 2. Published discovery artifacts

Public delivery should increasingly rely on prepared artifacts, not request-time composition.

These artifacts should power:

- finder
- search
- compare helpers
- suggestions
- sitemap inputs
- bot-facing route outputs

### 3. Conversion and handoff layer

This repo should produce clean, versioned, well-attributed lead handoff payloads for the CRM and other downstream destinations.

It should own:

- lead capture validation
- attribution capture
- intent shaping
- payload normalization
- retry-safe outbound sync state

## Engineering principles

### Catalog-first, not content-first

The primary product asset is the admissions catalog and the conversion UX around it.

### Read models for scale

Normalized tables should not double as the public read model once the catalog grows materially.

### Additive handoff contracts

CRM handoff payloads should evolve through additive, versioned fields so this app and the CRM can move independently.

### Conversion context is product data

Source path, CTA variant, interest, city, budget, seminar context, peer intent, and attribution are not incidental metadata. They are part of the product.

### Static where possible, cached where necessary

Public bot-heavy and browse-heavy routes should default to prebuilt or cache-backed delivery.

## Phase plan

## Phase 1: Scale-safe public discovery

Objective: keep the catalog fast and inexpensive as traffic grows.

Work:

- remove avoidable request-time DB work from public routes
- use shared catalog indexes and prepared discovery artifacts
- harden finder, search, suggestions, sitemap, feed, and bot-facing routes
- instrument the public routes that can burn compute or transfer

Exit criteria:

- public discovery no longer depends on broad request-time catalog composition
- expensive bot traffic is controlled and measurable

## Phase 2: Discovery product depth

Objective: increase conversion power of the public frontend.

Work:

- build saved-choice journeys and compare journeys as first-class user journeys
- add recommendation helpers from budget, country, course, and intake signals
- add richer decision support such as eligibility, fee fit, and licensing-fit views
- generate high-intent landing surfaces from structured catalog data

Exit criteria:

- the site helps students move from browse to evaluation to enquiry with context

## Phase 3: Lead handoff maturity

Objective: make captured leads more valuable downstream.

Work:

- standardize lead handoff payloads
- add versioned handoff metadata
- capture richer attribution and intent summaries
- ensure sync state is observable and retry-safe
- keep this repo responsible for payload preparation, not CRM lifecycle logic

Exit criteria:

- CRM receives consistent, high-context lead payloads
- this app can evolve capture UX without breaking downstream processing

## Phase 4: Catalog operating model

Objective: support thousands of colleges and many programs safely.

Work:

- introduce stronger publication/build steps for discovery artifacts
- support bulk imports and validations
- separate normalized catalog editing from public discovery projections
- add explicit provenance and refresh workflows for fees and admissions fields

Exit criteria:

- catalog growth does not force query complexity into public request paths

## Phase 5: Platform operations

Objective: run the acquisition frontend as a durable platform.

Work:

- monitor route latency, cache hit rate, and DB pressure
- alert on crawler spikes and usage anomalies
- document rollback and redeploy procedures for discovery artifacts
- track lead capture and handoff health as first-class platform signals

Exit criteria:

- traffic growth and search visibility no longer create surprise bills or unclear failure modes

## Immediate implementation track

1. Strengthen catalog indexing and discovery artifact builders.
2. Strengthen lead handoff payload contracts and sync observability.
3. Expand conversion-oriented discovery surfaces like compare, saved choices, and recommendation.
4. Move remaining heavy public reads onto prepared artifacts.

## Near-term non-goals in this repo

- counselor dashboards
- admissions case management
- counselor reminders and notes
- CRM-stage ownership logic

Those should stay in the CRM repository.
