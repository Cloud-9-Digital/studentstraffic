# Database Monitoring

Comprehensive database query monitoring for performance optimization and debugging.

## 🎯 Overview

Automatic monitoring of all database queries with:
- ✅ Slow query detection (>1s)
- ✅ Query timeout protection (15s)
- ✅ Automatic retry on transient failures
- ✅ Detailed error logging

**Implementation**: Transport layer wrapper for Neon

**File**: `/lib/db/transport.ts`

---

## 📊 What's Monitored

### Every Query Tracked

```json
{
  "durationMs": 45,
  "status": 200,
  "attempts": 1,
  "kind": "single",
  "sampleQuery": "SELECT * FROM universities WHERE slug = $1"
}
```

### Slow Queries (>1s in production)

```json
{
  "durationMs": 1250,
  "thresholdMs": 1000,
  "status": 200,
  "attempts": 1,
  "kind": "batch",
  "queryCount": 5,
  "sampleQuery": "SELECT u.*, p.* FROM universities u..."
}
```

### Errors

```json
{
  "durationMs": 245,
  "timeoutMs": 15000,
  "attempts": 3,
  "error": "Connection timeout",
  "kind": "single",
  "sampleQuery": "INSERT INTO leads..."
}
```

---

## 🔧 Configuration

### Timeouts

```typescript
// lib/db/transport.ts
const DB_QUERY_TIMEOUT_MS = 15_000; // 15 seconds

// All queries automatically timeout after 15s
// Prevents hanging connections
```

### Slow Query Thresholds

```typescript
// Production: 1 second
const DEFAULT_SLOW_DB_QUERY_MS = 1_000;

// Build time: 5 seconds (slower is ok)
const BUILD_SLOW_DB_QUERY_MS = 5_000;
```

### Retry Logic

```typescript
// Retry transient errors with exponential backoff
const DB_FETCH_RETRY_DELAYS_MS = [250, 750];

// Max 3 attempts total:
// 1. Initial attempt
// 2. Retry after 250ms
// 3. Retry after 750ms
```

---

## 📈 Monitoring in Production

### View Logs in Vercel

1. Go to Vercel dashboard
2. Select your project
3. Click "Functions" → "Logs"
4. Search for:
   - `[db-query]` - All queries
   - `[db-slow]` - Slow queries
   - `[db-error]` - Errors

### Example Log Search

```
[db-slow]
```

Returns:
```json
[db-slow] {
  "durationMs": 1456,
  "thresholdMs": 1000,
  "sampleQuery": "SELECT * FROM program_offerings WHERE..."
}
```

---

## 🎯 Optimization Workflow

### 1. Identify Slow Queries

Check Vercel logs for `[db-slow]`:

```json
{
  "durationMs": 2100,
  "sampleQuery": "SELECT * FROM universities u JOIN program_offerings p ON..."
}
```

### 2. Analyze Query

Copy query to Neon console and run `EXPLAIN ANALYZE`:

```sql
EXPLAIN ANALYZE
SELECT * FROM universities u
JOIN program_offerings p ON p.university_id = u.id
WHERE u.country_id = 5;
```

### 3. Check Indexes

Look in `lib/db/schema.ts`:

```typescript
export const universities = pgTable(
  "universities",
  {
    // ...fields
  },
  (table) => [
    uniqueIndex("universities_slug_idx").on(table.slug),
    index("universities_country_idx").on(table.countryId), // ✅ Good!
  ]
);
```

### 4. Add Missing Index

If index missing, add to schema:

```typescript
export const programOfferings = pgTable(
  "program_offerings",
  {
    // ...fields
  },
  (table) => [
    // Add index for JOIN performance
    index("program_offerings_university_idx").on(table.universityId),
  ]
);
```

### 5. Apply Migration

```bash
npm run db:generate
npm run db:push
```

### 6. Verify Improvement

Check logs after deployment - query should be faster!

---

## 🔍 Common Slow Query Patterns

### Missing JOIN Index

**Symptom**:
```sql
JOIN program_offerings p ON p.university_id = u.id
```

**Slow**: 2000ms

**Fix**: Add index on `university_id`

**Fast**: 50ms

### N+1 Query Problem

**Symptom**: Many identical queries

```
SELECT * FROM universities WHERE id = 1
SELECT * FROM universities WHERE id = 2
SELECT * FROM universities WHERE id = 3
...
```

**Fix**: Use `IN` query instead

```sql
SELECT * FROM universities WHERE id IN (1, 2, 3, ...)
```

### Missing WHERE Index

**Symptom**:
```sql
WHERE published = true AND featured = true
```

**Slow**: 1500ms

**Fix**: Add composite index

```typescript
index("universities_published_featured_idx")
  .on(table.published, table.featured)
```

**Fast**: 30ms

---

## 🚨 Error Handling

### Transient Errors (Auto-Retry)

These errors automatically retry:
- `fetch failed`
- `error connecting to database`
- `ECONNRESET`
- `ETIMEDOUT`

**Example**:
```json
{
  "attempts": 2,
  "error": "Connection timeout",
  "note": "Retried and succeeded"
}
```

### Permanent Errors (Fail Fast)

These errors don't retry:
- SQL syntax errors
- Constraint violations
- Permission errors

**Example**:
```json
{
  "attempts": 1,
  "error": "syntax error at or near...",
  "note": "Failed immediately - fix query"
}
```

---

## 📊 Performance Metrics

### Query Distribution

**Target**:
- 95% < 100ms
- 99% < 500ms
- 100% < 1000ms

**Monitor in Neon**:
1. Go to Neon dashboard
2. Select project
3. Click "Monitoring"
4. Check query distribution

### Connection Pool

**Neon Pooler Settings**:
- Max connections: 100
- Idle timeout: 10s
- Connection timeout: 15s

**Monitor**:
- Active connections
- Pool saturation
- Connection errors

---

## 🎯 Best Practices

### ✅ DO

- Add indexes for all JOINs
- Use WHERE clause indexes
- Limit result sets
- Use connection pooling
- Monitor slow queries

### ❌ DON'T

- SELECT * (use specific columns)
- N+1 queries (use batch queries)
- Missing indexes on foreign keys
- Long-running transactions
- Ignore slow query warnings

---

## 🔗 Related

- [Caching Strategy](./caching.md)
- [Scaling Guide](../guides/scaling.md)
- [Environment Variables](../reference/environment-variables.md)

---

**Last Updated**: May 2026
