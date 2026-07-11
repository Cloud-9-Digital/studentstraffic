# University Page Publishing Flow

This document defines the intended workflow for creating **real university pages** from official regulatory sources-sourced institutions without publishing thin directory pages.

The goal is simple:

- official regulatory sources is used only as an internal source list
- the public website gets only fully written university pages
- each published university page must be useful, source-backed, and decision-ready

There should be **no public discovery pages**, **no placeholder pages**, and **no university pages created from name-only data**.

---

## Final Model

The system should work like this:

1. Import official regulatory sources schools into an internal queue.
2. Pick one university from that queue.
3. Research the university from official and primary sources.
4. Convert that research into structured facts.
5. Write the full university page content.
6. Validate the page quality and source coverage.
7. Publish only if it meets the quality bar.
8. Otherwise keep it internal and move on.

Public output:

- `/universities/[slug]`

Internal-only inputs:

- `official-directory_directory_entries`
- research queue
- research drafts

---

## Core Principle

official regulatory sources tells us that a school exists.

It does **not** by itself give enough information to justify a Students Traffic university page.

A university page should only go live when we can confidently explain:

- what the university is
- what medical program exists there
- what the academic structure looks like
- what the fee reality looks like
- what student life may look like
- what regulatory or India-return questions matter
- what students should verify before deciding

If we cannot do that well, the university stays unpublished.

---

## Public vs Internal Layers

### Public layer

Only one public artifact should exist:

- `universities`
- `program_offerings`
- `/universities/[slug]`

### Internal layer

The internal system should manage:

- raw official regulatory sources entries
- queue status
- source collection
- structured facts
- draft content
- review notes

This is important because not every official regulatory sources school deserves publication.

---

## Workflow Stages

### 1. Discovery

Input comes from official regulatory sources import.

Relevant code today:

- [scripts/import-official-directory-directory.ts](/Users/bharat/Documents/studentstraffic/scripts/import-official-directory-directory.ts)
- [lib/official-directory.ts](/Users/bharat/Documents/studentstraffic/lib/official-directory.ts)
- [lib/db/schema.ts](/Users/bharat/Documents/studentstraffic/lib/db/schema.ts)

official regulatory sources data should be treated as the initial backlog only.

At this stage we know:

- school name
- country
- city
- official regulatory sources school ID
- official regulatory sources detail URL
- some basic school metadata

We do **not** yet have enough to publish.

### 2. Queueing

Every official regulatory sources school enters an internal publishing queue.

Recommended statuses:

- `new`
- `researching`
- `draft_ready`
- `published`
- `hold`
- `rejected`

Recommended queue priorities:

- `high`
- `medium`
- `low`

The queue exists so work can be done university-by-university rather than country-by-country in one giant uncontrolled batch.

### 3. Research

For each university, collect a minimum research pack before writing.

Required sources:

- official university homepage
- official medical faculty or medicine program page
- official admissions page
- official tuition or fees source
- official regulatory sources entry

Preferred sources:

- hostel or accommodation page
- student services page
- teaching hospital or clinical training page
- official brochure or PDF
- official contact page
- regulatory or recognition references where relevant

If this research pack is incomplete, the university should not be published yet.

### 4. Fact Extraction

After sources are collected, convert them into structured facts.

The fact layer should include fields like:

- university name
- country
- city
- university type
- established year
- official website
- program name
- program duration
- medium of instruction
- intake months
- annual tuition
- total tuition
- hostel or accommodation note
- clinical training note
- admission requirements
- recognition links
- source URLs
- last verified date
- confidence level

This structured layer matters because it becomes the reusable source for:

- the university page
- comparisons
- filters
- AI-readable outputs
- future updates

### 5. Editorial Drafting

Only after the facts are structured should the long-form page be written.

The draft should cover:

- summary
- why students shortlist it
- things to consider
- city profile
- campus lifestyle
- hostel overview
- Indian food support if known
- safety overview
- student support
- clinical exposure
- admission process
- fee note
- recognition or regulatory note
- FAQs

This should read like a real Students Traffic university page, not like a stitched directory entry.

### 6. Review Gate

Before publishing, the page must pass a review gate.

A university page should be publishable only if:

- the official website is identified
- the medicine program is clearly identified
- the fee information is sourced or clearly qualified
- major claims are evidence-backed
- unresolved ambiguities are called out honestly
- the page is genuinely useful for students

If the page is not strong enough:

- mark `hold` if it may become publishable later
- mark `rejected` if it is too weak, irrelevant, or unverifiable

### 7. Publish

Once the page passes review:

- create or update the `universities` row
- create or update the `program_offerings` row
- populate rich editorial fields
- publish the page at `/universities/[slug]`

After publish, the queue item becomes:

- `published`

### 8. Refresh

Published pages should not be treated as permanent.

They should be refreshed periodically for:

- fees
- admissions requirements
- intake details
- hostel details
- official links
- regulatory relevance

Recommended refresh rule:

- high-intent universities: every 3 to 6 months
- low-traffic universities: every 6 to 12 months
- regulation-sensitive destinations: faster as needed

---

## Minimum Publish Standard

A university page should not go live unless it satisfies this minimum bar:

- university identity is clear
- official website is found
- medicine program is identified
- page has enough facts to write a real overview
- tuition information is reasonably sourced or qualified
- there is enough material to explain campus, location, admissions, and training at a useful level

If a university only has a official regulatory sources row and a homepage, that is not enough.

---

## Example Flow

Example university:

- `Alte University`
- country: Georgia

### Step 1: official regulatory sources discovery

The official regulatory sources import finds the school and stores:

- school name
- country
- city
- official regulatory sources school ID
- official regulatory sources detail URL

Queue status:

- `new`

### Step 2: research

Collect:

- official university homepage
- official medicine or MD program page
- tuition page
- admission page
- hostel or student life page if available
- official regulatory sources entry

Queue status:

- `researching`

### Step 3: facts

Extract:

- city: Tbilisi
- program: medicine / MD
- duration
- medium
- tuition structure
- admissions information
- accommodation notes
- clinical training notes
- source links

### Step 4: draft

Write:

- overview
- why students consider it
- what to verify carefully
- living and city context
- hostel and food notes
- clinical exposure
- fee note
- FAQ

Queue status:

- `draft_ready`

### Step 5: review

Ask:

- is the program clearly sourced?
- are the fee claims defensible?
- are we being honest about uncertainty?
- is the page useful enough to help a student decide whether to shortlist?

If yes:

- publish to `/universities/alte-university`
- status becomes `published`

If no:

- status becomes `hold` or `rejected`

---

## Recommended Internal Schema

The current repo already has:

- `official-directory_directory_entries`
- `universities`
- `program_offerings`

To support this workflow cleanly, add two internal tables.

### 1. `university_research_queue`

Purpose:

- track which official regulatory sources schools are waiting for research or publication

Suggested fields:

- `id`
- `official-directory_school_id`
- `country_slug`
- `school_name`
- `priority`
- `status`
- `published_university_id`
- `notes`
- `last_attempted_at`
- `created_at`
- `updated_at`

### 2. `university_research_drafts`

Purpose:

- store source bundle, structured facts, and generated draft content before publish

Suggested fields:

- `id`
- `official-directory_school_id`
- `official_website`
- `program_url`
- `fees_url`
- `hostel_url`
- `admission_url`
- `source_bundle`
- `structured_facts`
- `draft_content`
- `quality_score`
- `review_notes`
- `verified_at`
- `created_at`
- `updated_at`

---

## Operating Rules

These rules should remain true unless the product strategy changes:

- do not publish official regulatory sources directory pages publicly
- do not create placeholder university pages
- do not treat official regulatory verification as equal to NMC approval or full regulatory safety
- do not auto-publish every imported school
- do publish only when the page is good enough to help a student make a real decision

---

## Recommended Rollout

The safest rollout is:

1. choose one country already covered by official regulatory sources configs
2. create queue items for all schools in that country
3. prioritize the most relevant universities first
4. publish only the strongest pages
5. repeat with the next batch

This creates scale without sacrificing quality.

---

## Definition of Done

A university is considered complete only when:

- it exists in `universities`
- it has at least one usable `program_offerings` record
- its rich editorial fields are filled
- its `/universities/[slug]` page is live
- its sources were verified recently enough to trust the page

Until then, it remains internal work in progress.
