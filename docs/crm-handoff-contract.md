# CRM Handoff Contract

## Purpose

This document defines what `studentstraffic` is responsible for when sending lead data to downstream systems such as the CRM.

This repo owns:

- payload preparation
- attribution capture
- interest and intent capture
- sync status tracking on the website lead

This repo does not own:

- downstream case management
- counselor workflow state
- admissions-stage updates after handoff

## Contract goals

- additive and backward-safe
- explicit enough for downstream routing and segmentation
- stable across multiple lead entry surfaces

## Required payload concepts

- `websiteLeadId`
- `submittedAt`
- `fullName`
- `phone`
- `sourcePath`
- `ctaVariant`

## Strongly recommended context

- `leadKind`
- `handoffVersion`
- `primaryInterestType`
- `primaryInterestValue`
- `sourceCategory`
- `acquisitionChannel`
- `utmSource`
- `utmMedium`
- `utmCampaign`

## Current entry surfaces

- general lead forms
- seminar enquiry forms
- seminar registration forms
- peer request and peer connect flows
- WATI inbound lead creation

## Backward compatibility rule

New fields added to the handoff payload should be additive. Existing fields should not be renamed or removed without coordinating with the CRM repository.

## Routing exception: NEET College Predictor leads

Leads with `sourcePath === "/neet-college-predictor"` do **not** go to the primary CRM (`crm.studentstraffic.com`). They route exclusively to LeadSquared instead. This is handled in `lib/lead-sync.ts`:

- `syncLeadToCrm` short-circuits (writes `crmSyncStatus: "skipped"`) whenever `sourcePath` matches the NEET predictor path.
- `syncLeadToLeadSquared` only fires for that same `sourcePath`; all other leads skip it.
- Config: `LEADSQUARED_ACCESS_KEY` / `LEADSQUARED_SECRET_KEY` env vars. API host is hardcoded (`https://api-in21.leadsquared.com/v2/`) since it's account-specific, not environment-specific.
- Field mapping: `FirstName`, `Phone`, `EmailAddress`, `mx_State`, `mx_City`, `mx_NEET_Score`, `mx_Category` (NEET category), `Source` (hardcoded `"Meta Ads"`).
- Sync status is tracked on the `leads` row via `leadSquaredSyncStatus` / `leadSquaredSyncedAt` / `leadSquaredSyncError` / `leadSquaredExternalId` (mirrors the `crmSync*` column pattern).

If another source path needs the same LeadSquared routing in the future, generalize the `NEET_PREDICTOR_SOURCE_PATH` check in `lib/lead-sync.ts` rather than hardcoding a second path inline.
