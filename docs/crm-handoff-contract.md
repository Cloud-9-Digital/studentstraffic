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
