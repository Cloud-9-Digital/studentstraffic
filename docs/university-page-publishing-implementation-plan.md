# University Page Publishing Implementation Plan

This document turns the publishing flow in
[docs/university-page-publishing-flow.md](/Users/bharat/Documents/studentstraffic/docs/university-page-publishing-flow.md)
into a concrete implementation plan for this repo.

The target outcome is:

- WDOMS stays internal
- only high-quality `/universities/[slug]` pages go public
- the agent can handle most of the work end-to-end

---

## Scope

This plan covers:

1. internal queue design
2. draft storage design
3. research and drafting pipeline
4. publish gate
5. publish action into existing `universities` and `program_offerings`
6. first rollout order

This plan does **not** introduce public WDOMS pages.

---

## Existing Foundations In The Repo

These parts already exist and should be reused:

- WDOMS ingestion:
  [scripts/import-wdoms-directory.ts](/Users/bharat/Documents/studentstraffic/scripts/import-wdoms-directory.ts)
- WDOMS scraping and matching helpers:
  [lib/wdoms.ts](/Users/bharat/Documents/studentstraffic/lib/wdoms.ts)
- raw WDOMS table:
  [lib/db/schema.ts](/Users/bharat/Documents/studentstraffic/lib/db/schema.ts)
- current public university model:
  [lib/db/schema.ts](/Users/bharat/Documents/studentstraffic/lib/db/schema.ts)
- current catalog readers:
  [lib/data/catalog.ts](/Users/bharat/Documents/studentstraffic/lib/data/catalog.ts)
- prior draft-import pattern:
  [scripts/import-university-guide-drafts.ts](/Users/bharat/Documents/studentstraffic/scripts/import-university-guide-drafts.ts)

This means we do not need to invent a brand-new architecture. We need to add an internal publishing workflow around the existing catalog model.

---

## Final System Shape

The system should have 4 layers.

### 1. Raw source layer

Purpose:

- store the imported universe of schools from WDOMS

Primary source:

- `wdoms_directory_entries`

### 2. Queue layer

Purpose:

- track which WDOMS schools should be researched and published

New table:

- `university_research_queue`

### 3. Draft layer

Purpose:

- store sources, structured facts, and generated draft content before publishing

New table:

- `university_research_drafts`

### 4. Public catalog layer

Purpose:

- power the actual `/universities/[slug]` pages

Existing tables:

- `universities`
- `program_offerings`

---

## Required New Tables

## 1. `university_research_queue`

Purpose:

- one row per WDOMS school that we may want to turn into a public university page

Suggested columns:

- `id`
- `wdoms_school_id`
- `country_slug`
- `school_name`
- `city_name`
- `priority`
- `status`
- `matched_university_id`
- `published_university_slug`
- `notes`
- `last_attempted_at`
- `created_at`
- `updated_at`

Recommended enums:

- `priority`: `high`, `medium`, `low`
- `status`: `new`, `researching`, `draft_ready`, `published`, `hold`, `rejected`

Rules:

- `wdoms_school_id` should be unique
- `status = published` means a corresponding public university row exists

## 2. `university_research_drafts`

Purpose:

- store source collection, extracted facts, and generated page draft

Suggested columns:

- `id`
- `queue_id`
- `wdoms_school_id`
- `official_website`
- `program_url`
- `fees_url`
- `hostel_url`
- `admission_url`
- `wdoms_url`
- `source_bundle`
- `structured_facts`
- `draft_content`
- `quality_score`
- `review_notes`
- `verified_at`
- `created_at`
- `updated_at`

Recommended JSON fields:

- `source_bundle`
  Stores all source links, snippets, and verification notes
- `structured_facts`
  Stores normalized data before it is moved into `universities`
- `draft_content`
  Stores generated narrative content blocks

Rules:

- one active draft per queue item is enough for v1
- `quality_score` is internal only

---

## Structured Facts Shape

The `structured_facts` JSON should match the eventual public university model closely enough that publishing becomes mapping, not rewriting.

Recommended fields:

- `name`
- `countrySlug`
- `city`
- `type`
- `establishedYear`
- `officialWebsite`
- `summary`
- `programs`
- `campusLifestyle`
- `cityProfile`
- `clinicalExposure`
- `hostelOverview`
- `indianFoodSupport`
- `safetyOverview`
- `studentSupport`
- `whyChoose`
- `thingsToConsider`
- `bestFitFor`
- `teachingHospitals`
- `recognitionBadges`
- `recognitionLinks`
- `faq`
- `researchSources`
- `researchNotes`
- `lastVerifiedAt`

Each program inside `programs` should support:

- `slug`
- `title`
- `courseSlug`
- `durationYears`
- `annualTuitionUsd`
- `totalTuitionUsd`
- `livingUsd`
- `officialFeeCurrency`
- `officialAnnualTuitionAmount`
- `officialTotalTuitionAmount`
- `officialProgramUrl`
- `medium`
- `intakeMonths`
- `teachingPhases`
- `yearlyCostBreakdown`
- `licenseExamSupport`
- `feeVerifiedAt`
- `feeNotes`
- `sourceUrls`

---

## Draft Content Shape

The `draft_content` JSON should hold page-ready editorial fields, not one giant markdown blob.

Recommended fields:

- `summary`
- `campusLifestyle`
- `cityProfile`
- `clinicalExposure`
- `hostelOverview`
- `indianFoodSupport`
- `safetyOverview`
- `studentSupport`
- `whyChoose`
- `thingsToConsider`
- `bestFitFor`
- `faq`
- `researchNotes`

This aligns with the current `universities` table shape and keeps publishing simple.

---

## Scripts To Build

## 1. Queue seeding script

Suggested file:

- `scripts/seed-university-research-queue.ts`

Purpose:

- read `wdoms_directory_entries`
- create queue rows for schools not already queued
- apply initial priority rules

Priority rules for v1:

- `high`: countries already important to MBBS traffic
- `medium`: relevant but lower-volume schools
- `low`: weak or unclear schools

## 2. Research runner

Suggested file:

- `scripts/run-university-research.ts`

Purpose:

- take one `new` or `researching` queue item
- collect official sources
- store `source_bundle`
- extract `structured_facts`
- generate `draft_content`
- update queue status to `draft_ready` or `hold`

This is the main agent-driven workflow.

## 3. Publish script

Suggested file:

- `scripts/publish-university-draft.ts`

Purpose:

- read one approved draft
- create or update `universities`
- create or update `program_offerings`
- mark queue row as `published`

## 4. Refresh script

Suggested file:

- `scripts/refresh-university-research.ts`

Purpose:

- revisit already-published universities
- refresh fees, links, or risk-sensitive facts

---

## Admin Workflow

V1 can work without a full polished CMS, but it should still support an internal review loop.

Recommended admin screens:

### 1. Research queue page

Suggested route:

- `/admin/university-research`

Show:

- school name
- country
- city
- priority
- status
- last attempted time
- published slug if any

### 2. Draft detail page

Suggested route:

- `/admin/university-research/[id]`

Show:

- source links
- structured facts
- draft content
- quality score
- review notes

Actions:

- mark `draft_ready`
- mark `hold`
- mark `rejected`
- publish

### 3. Publish action

Suggested server action:

- `publishUniversityDraftAction`

This should map draft fields into the public catalog schema.

---

## Publish Gate Rules

Do not publish unless all required checks pass.

Required checks:

- official website found
- medical program page found
- WDOMS identity is clear
- enough facts exist to write a useful page
- fee information is sourced or clearly qualified
- no major unresolved contradictions

Recommended checks:

- hostel data found
- student support data found
- city profile meaningful
- recognition links captured
- FAQ quality acceptable

Hard fail conditions:

- school identity unclear
- official site not found
- program unclear
- university too thin to write about honestly
- conflicting sources without a resolved explanation

---

## Publish Mapping

Publishing should be a deterministic mapping from `structured_facts` and `draft_content` into the existing catalog schema.

### Map into `universities`

Fields:

- `slug`
- `countryId`
- `name`
- `city`
- `type`
- `establishedYear`
- `summary`
- `published`
- `officialWebsite`
- `campusLifestyle`
- `cityProfile`
- `clinicalExposure`
- `hostelOverview`
- `indianFoodSupport`
- `safetyOverview`
- `studentSupport`
- `whyChoose`
- `thingsToConsider`
- `bestFitFor`
- `teachingHospitals`
- `recognitionBadges`
- `recognitionLinks`
- `faq`
- `lastVerifiedAt`
- `researchSources`
- `researchNotes`

### Map into `program_offerings`

Fields:

- `slug`
- `universityId`
- `courseId`
- `title`
- `durationYears`
- `annualTuitionUsd`
- `totalTuitionUsd`
- `livingUsd`
- `officialFeeCurrency`
- `officialAnnualTuitionAmount`
- `officialTotalTuitionAmount`
- `officialProgramUrl`
- `medium`
- `teachingPhases`
- `intakeMonths`
- `yearlyCostBreakdown`
- `licenseExamSupport`
- `feeVerifiedAt`
- `feeNotes`
- `sourceUrls`

---

## Best First Rollout

Build in this order.

### Phase 1: queue + draft storage

Deliverables:

- DB tables
- queue seeding script
- basic admin list page

### Phase 2: one-university research pipeline

Deliverables:

- research runner script
- source bundle format
- structured fact extraction
- draft generation

### Phase 3: publish action

Deliverables:

- publish script or server action
- mapping into `universities` and `program_offerings`
- queue status updates

### Phase 4: review tooling

Deliverables:

- admin detail page
- draft inspection
- publish/hold/reject controls

### Phase 5: refresh workflow

Deliverables:

- re-verification script
- stale-date logic

---

## Suggested First Country

Start with one country already configured in WDOMS and already relevant to your MBBS business.

Best starting choices:

1. Georgia
2. Kyrgyzstan
3. Uzbekistan
4. Russia
5. Vietnam

Recommendation:

- start with `Georgia`

Reason:

- manageable size
- strong commercial relevance
- easier to standardize profile quality

---

## Example End-To-End

Example:

- WDOMS school: `Alte University`
- country: `georgia`

### Step 1

Queue row created:

- `status = new`
- `priority = high`

### Step 2

Research runner collects:

- official homepage
- medicine page
- admissions page
- tuition source
- WDOMS source

Queue becomes:

- `status = researching`

### Step 3

Research runner stores:

- `source_bundle`
- `structured_facts`
- `draft_content`

Queue becomes:

- `status = draft_ready`

### Step 4

Reviewer checks:

- facts make sense
- narrative is useful
- fees are not hallucinated
- uncertainties are stated honestly

### Step 5

Publish action creates:

- `universities` row
- `program_offerings` row

Queue becomes:

- `status = published`

Public page:

- `/universities/alte-university`

---

## Definition Of Done

This implementation is considered done when:

- WDOMS schools can be queued internally
- one queued school can be researched into a draft
- one reviewed draft can be published into the public catalog
- the process can be repeated reliably without creating public placeholder pages

That is the real finish line for v1.
