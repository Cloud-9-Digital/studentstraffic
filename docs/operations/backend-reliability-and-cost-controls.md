# Backend Reliability and Database Cost Runbook

Last updated: July 2026

## Environment requirements

Production should have:

- `DATABASE_URL`
- `CRON_SECRET`
- `REVALIDATE_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- Sentry configuration if production error alerting is required

Sensitive endpoints intentionally return `503` when distributed rate limiting is not configured in production. This prevents authentication and lead endpoints from silently falling back to per-instance memory.

## Background job operations

Inspect jobs from the admin Lead Delivery page or directly in PostgreSQL:

```sql
SELECT status, kind, count(*)
FROM background_jobs
GROUP BY status, kind
ORDER BY status, kind;
```

Find jobs that have exceeded their normal processing lease:

```sql
SELECT id, kind, status, attempts, locked_at, last_error
FROM background_jobs
WHERE status = 'processing'
  AND locked_at < now() - interval '10 minutes'
ORDER BY locked_at;
```

The next processor run can reclaim these jobs. For a permanently failing job, inspect `last_error`, fix the destination/configuration, then use the admin retry action.

The cron endpoint requires:

```text
Authorization: Bearer $CRON_SECRET
```

Do not use query-string secrets.

## Database cost review

Review these weekly:

1. Neon compute hours and data transfer.
2. Slow queries (`[db-slow]`) and repeated hot queries.
3. Background job volume and retry rate.
4. Mobile session write volume.
5. Contact/analytics event write volume.
6. Cache hit rates for finder, catalog, blog, and guide pages.

Useful queries:

```sql
SELECT date_trunc('day', created_at) AS day, count(*)
FROM contact_click_events
GROUP BY 1
ORDER BY 1 DESC
LIMIT 30;
```

```sql
SELECT date_trunc('day', created_at) AS day, status, count(*)
FROM background_jobs
GROUP BY 1, status
ORDER BY 1 DESC, status;
```

Avoid adding a database query to every client navigation or polling loop. Prefer cache tags, bounded polling, and realtime events where the product already uses Ably.

## Webhook replay checks

WATI webhook processing is idempotent by message ID. To find suspicious duplicates or missing IDs:

```sql
SELECT wati_whatsapp_message_id, count(*)
FROM leads
WHERE wati_whatsapp_message_id IS NOT NULL
GROUP BY wati_whatsapp_message_id
HAVING count(*) > 1;
```

This should return no rows after migration `0055_wati_message_idempotency.sql`.

## Incident response

### Database usage spikes

1. Check slow-query logs and recent deployments.
2. Check whether a client is polling too frequently.
3. Check whether an authenticated read is writing on every request.
4. Check background job retries and webhook replay volume.
5. Temporarily reduce expensive public endpoint limits through the proxy.
6. Add or adjust an index only after confirming the query plan.

### Lead delivery failures

1. Inspect `background_jobs.last_error` and the lead sync status columns.
2. Verify CRM/WATI credentials and provider health.
3. Retry failed jobs from the admin interface.
4. Confirm the provider call is idempotent before increasing retry limits.
5. Do not manually duplicate leads to compensate for a delivery failure.
