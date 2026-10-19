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

## CRM transport migration

Set a server-side `CRM_API_KEY` made in the intended CRM organization with only
`leads.capture` scope to send leads to `POST /api/v1/leads/capture`. The endpoint
defaults to `https://app.marro.si/api/v1/leads/capture`; `CRM_API_URL` overrides
the base URL for local or staging work. Without the key CRM delivery is skipped.
Never put the key in a `NEXT_PUBLIC_` variable.

The new endpoint accepts `name`, `phone`, `email`, `source`, `notes`, `fields`,
`attribution`, and `externalId`, not the old flat payload. `lib/crm-capture-payload.ts`
adds the website lead ID as `externalId` and an
`Idempotency-Key` header, so a retry within 24 hours replays the first capture.
It stores lead and form context in timeline notes; the dedicated attribution
object carries page/referrer and UTM details. Set active CRM sources named
`Website`, `WATI`, `Seminar 2026`, and any campaign `sourceName` used by this
site. The scoped API uses an unknown source as `Website`; configure assignment
rules for these source names before switching keys. Existing leads keep
their owner and nonempty fields under the new API. No `fields` are sent until
the organization's active lead field definitions and dropdown options have
been read back and validated. A 422 response is terminal and recorded as
`rejected` for operator correction.

## CRM source name

The scoped capture API accepts an optional `source` name (1-60 chars). It uses
an active source in the key's organization with that name; an unknown name falls
back to `Website`. It does not create sources. Configure campaign sources in the
CRM before sending leads that should carry those labels.

This repo derives it in `getSourceName` in `lib/lead-handoff.ts`, from a per-path map:

| `sourcePath` | `sourceName` |
|---|---|
| `/free-mbbs-counselling-2026` | `MBBS in 10 Lakhs` |
| everything else | `Website`, unless WATI or seminar rules select their source |

Two rules when adding an entry:

- The value is a **label the sales team reads**, not a slug. A typo falls back
  to `Website`, so check the exact spelling against the organization's active
  sources before enabling a campaign.
- `lib/crm-capture-payload.ts` maps `sourceName` to `source` and selects `WATI`
  or `Seminar 2026` for those flows.

## Lead delivery routing

Which destinations a lead reaches is decided by its `sourcePath`, through the single routing table
in `lib/lead-delivery-routes.ts`. Add a new flow there rather than sprinkling
`sourcePath === "..."` checks across `lib/lead-sync.ts`, `lib/background-jobs.ts` and
`app/_actions/submit-lead.ts`.

| Flow | Matches | CRM | Pabbly | WhatsApp (WATI) |
|---|---|---|---|---|
| `neetPredictor` | `/neet-college-predictor` | yes | no | no |
| `seminar` | paths starting `/seminar-2026` | yes | no | yes |
| `crmOnly` | paths in `CRM_ONLY_SOURCE_PATHS` | yes | no | no |
| `default` | everything else | yes | no | yes |

Notes:

- Pabbly is off for every flow. Its automation scenario sent its own WhatsApp message on receipt
  regardless of the `whatsapp` flag, producing duplicate messages this codebase did not control.
  WhatsApp now goes through WATI directly; Google Sheets logging goes through `lib/google-sheets.ts`.
- The `neetPredictor` flow suppresses the WhatsApp confirmation because that page promises an
  emailed shortlist instead.
- Paid-traffic landing pages take the `crmOnly` flow: the Students Traffic CRM and nothing else.
  The counsellor callback is the entire promise on an ad landing page, so an automated WhatsApp
  message ahead of that call only competes with it. Add a new ad landing page's `sourcePath` to
  `CRM_ONLY_SOURCE_PATHS` rather than giving it its own flow.
- Google Sheets logging sits outside this table. `syncLeadDestinations` appends **every** website
  lead to the Master Sheet regardless of flow, so `crmOnly` leads are still logged there. That is
  the deliberate blanket policy from `025f3cb`, not an exception for this page.

## Meta Conversions API (ad measurement, not lead delivery)

Every lead submitted through `submitLeadAction` is also reported to Meta server-side, mirroring the
browser pixel. This exists because the pixel alone loses conversions to ad blockers, ITP/ATT and
people who leave before it loads — which matters most on paid landing pages.

- Sender: `lib/meta-capi.ts`, called from `syncLeadDestinations` in `lib/lead-sync.ts`.
- Config: `META_CAPI_ACCESS_TOKEN` (required — without it the send is skipped), `META_PIXEL_ID`
  (defaults to `metaPixelId` in `lib/constants.ts`), `META_CAPI_TEST_EVENT_CODE` (validation only —
  events sent with a test code are not counted as conversions).
- The pixel and the Conversions API must post to the **same** pixel id, so both read
  `metaPixelId` from `lib/constants.ts`. Do not fork that value.

### Deduplication — load-bearing

One submission produces two `Lead` events: one from the browser pixel on `/thank-you`, one from the
server. Meta collapses them only when they share an `event_id`:

1. `submitLeadAction` mints `metaEventId` (a UUID) per submission.
2. It travels to Meta server-side as `event_id`, inside the lead handoff payload.
3. It is forwarded to `/thank-you?...&eid=<id>`, which passes it to `ThankYouAnalytics`, which sends
   it to `fbq` as `eventID`.

Break any link in that chain and every conversion is counted twice. `sendMetaLeadEvent` therefore
refuses to send when `metaEventId` is absent, which is also why the seminar flows — they call
`syncLeadDestinations` without one — send only the browser event.

### Failure handling

A Conversions API failure logs and is swallowed. It must never fail the delivery job, because the
job retries, and a retry would re-POST the CRM lead and send Meta a third `Lead`. There are no
`meta*` sync-status columns on `leads` for the same reason: this is measurement, not a destination
we reconcile.

### Match quality

`lib/tracking.ts` captures `_fbc` and `_fbp`. When the pixel has not yet written `_fbc` (it loads
with `lazyOnload`, so fast submitters race it) the value is rebuilt from the raw `fbclid` as
`fb.1.<timestamp>.<fbclid>`. Email, phone, first/last name and state are SHA-256 hashed after
normalising (lowercased and trimmed; phone digits only; state with spaces stripped). `fbc`, `fbp`,
IP and user agent are sent unhashed, as Meta requires.

## Retired: LeadSquared

LeadSquared was a fourth destination and, at the end, the NEET predictor flow's only one — taking
just the leads that scored under 400. It was retired across every Aieraa repo in September 2026
(`0464c25`), and predictor leads now go to the primary CRM in full.

Nothing writes to LeadSquared any more. What deliberately remains is read-only history: the
`leadSquaredSyncStatus` / `leadSquaredSyncedAt` / `leadSquaredSyncError` / `leadSquaredExternalId`
columns on `leads`, the admin lead-detail panel that displays them, and the predictor CSV export
column. Existing leads carry real sync history there and it should stay readable. Do not reintroduce
LeadSquared as a destination; route new flows through `lib/lead-delivery-routes.ts` instead.
