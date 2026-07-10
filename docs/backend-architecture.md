# Backend Architecture and Operating Principles

Last updated: July 2026

This document explains how the backend is structured and the rules to follow when adding features. The application is intentionally a server-first Next.js monolith. The goal is to keep the database as the source of truth while avoiding unnecessary reads, writes, retries, and long-running work inside user requests.

## Request flow

```text
Browser / mobile app / external provider
        |
        v
Next.js proxy.ts
  - dashboard redirect
  - distributed rate limiting for sensitive routes
        |
        +--> Server Component reads (web pages)
        +--> Server Actions (web mutations)
        +--> Route Handlers (mobile API, webhooks, cache/cron APIs)
                     |
                     v
             Domain modules in lib/
                     |
          +----------+-----------+
          |                      |
     Neon Postgres          External services
     via Drizzle            CRM, WATI, email,
                            Cloudinary, calls, search
```

## Layering rules

1. Server Components should read directly from domain/data modules. Do not add an internal HTTP round trip for a server-rendered page.
2. Server Actions are for mutations initiated by the website. Validate input, authenticate the caller, then call a domain function.
3. Route Handlers are for mobile clients, public HTTP APIs, webhooks, and cache/cron endpoints.
4. Database queries belong in `lib/data`, `lib/db`, or a domain module. Keep SQL out of presentational components.
5. External side effects that must complete should run through the background job system. Fire-and-forget is acceptable only for non-critical best-effort telemetry.
6. Every externally supplied identifier must be validated and every object lookup must verify ownership or authorization.

## Database-cost principles

- Prefer cached Server Component reads and indexed, bounded queries.
- Select only the columns needed by the caller; avoid `select().from(table)` in hot paths.
- Use `Promise.all` for independent reads, but do not duplicate the same query in multiple layers.
- Add indexes only for measured access patterns. Review unused indexes periodically because every index increases write cost.
- Avoid write-on-read behavior. Mobile session heartbeats are throttled to one write per session per five minutes.
- Keep database queries under the 15-second transport timeout and investigate `[db-slow]` logs.
- Use asynchronous jobs for CRM, WhatsApp, email, and other integrations so user requests do not wait on third parties.
- Use `revalidateTag`/`revalidatePath` after content mutations instead of forcing uncached database reads everywhere.

## Background jobs

Jobs are stored in `background_jobs` and processed by `/api/jobs/process` from Vercel Cron.

Operational guarantees:

- Jobs are claimed atomically by changing their state from `pending` to `processing`.
- Processing leases older than ten minutes are reclaimable, protecting against killed serverless invocations.
- Failed destination deliveries are not treated as successful jobs.
- Retries use exponential backoff up to the job's `maxAttempts`.
- A completed job clears its lock; a failed job records a bounded error message.

When adding a job kind:

1. Define a validated payload guard.
2. Make the handler idempotent.
3. Persist enough status to diagnose partial failures.
4. Ensure external calls have timeouts.
5. Add a retry and dead-letter/retry-admin story.
6. Update this document and the relevant operational runbook.

## Webhook idempotency

Webhook providers may retry or deliver events concurrently. Every webhook handler must:

- authenticate the provider with a secret or signature;
- identify a stable provider event/message ID;
- enforce uniqueness in the database where possible;
- use `ON CONFLICT DO NOTHING` or an equivalent atomic operation;
- return a successful response for an already-processed event.

WATI inbound messages use `wati_whatsapp_message_id` as the idempotency key. Migration `0055_wati_message_idempotency.sql` cleans historical duplicates and adds a partial unique index.

## Authentication and rate limiting

- Web/admin browser sessions use NextAuth JWTs and re-check active admin records for protected admin operations.
- Mobile clients use random bearer tokens; only SHA-256 token hashes are stored.
- Mobile session activity updates are throttled to reduce database writes.
- Upstash Redis is required in production for sensitive authentication, lead, webhook, cron, and cache endpoints.
- Public read endpoints may use the local fallback during development only.
- Secrets are accepted through `Authorization: Bearer ...`; do not put secrets in query strings.

## Adding a new endpoint checklist

- Is this a Server Component read, Server Action mutation, or Route Handler use case?
- Is the request body/query validated with Zod or an equivalent schema?
- Is authentication required? If so, is ownership checked after authentication?
- Is the endpoint rate-limited appropriately?
- Is the query bounded and covered by the right index?
- Can the response be cached or tagged?
- Are external side effects asynchronous and retryable?
- Are duplicate requests safe?
- Is the failure mode visible in Sentry/logs and documented here?

## Production checks

Before deployment:

1. Confirm `DATABASE_URL`, `CRON_SECRET`, `REVALIDATE_SECRET`, and Upstash credentials are configured.
2. Apply pending Drizzle migrations.
3. Confirm `/api/jobs/process` rejects requests without a bearer token.
4. Inspect pending, processing, and failed background jobs.
5. Review slow-query logs and database compute/transfer usage.
6. Confirm cache invalidation is invoked after content publishing/imports.
