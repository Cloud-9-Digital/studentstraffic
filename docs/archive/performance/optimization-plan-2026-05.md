# Archived: Database & API Query Optimization Plan (May 2026)

> Superseded by [Backend Architecture](../../backend-architecture.md), [Backend Reliability and Cost Runbook](../../operations/backend-reliability-and-cost-controls.md), and the current code/migrations. Treat the recommendations below as historical context, not an active task list.

## Critical Priority (Do First)

### 1. Add Missing Database Indexes

```sql
-- Leads table
CREATE INDEX CONCURRENTLY leads_phone_created_at_idx ON leads(phone, created_at DESC);
CREATE INDEX CONCURRENTLY leads_visitor_id_idx ON leads(visitor_id);

-- Program offerings
CREATE INDEX CONCURRENTLY program_offerings_university_course_idx
  ON program_offerings(university_id, course_id);

-- India Medical Colleges
CREATE INDEX CONCURRENTLY india_medical_colleges_state_management_idx
  ON india_medical_colleges(state_name, management_type);
CREATE INDEX CONCURRENTLY india_medical_colleges_course_idx
  ON india_medical_colleges(course_name);

-- Student Peers
CREATE INDEX CONCURRENTLY student_peers_university_status_idx
  ON student_peers(university_id, status);

-- Rate Limits
CREATE UNIQUE INDEX CONCURRENTLY security_rate_limits_scope_identifier_idx
  ON security_rate_limits(scope, identifier);

-- Search Documents
CREATE INDEX CONCURRENTLY search_documents_type_featured_idx
  ON search_documents(document_type, featured);

-- Full-Text Search (ParadeDB)
-- Verify ParadeDB indexes exist on search_documents table
```

**Files Affected**:
- `lib/data/catalog.ts:199` (university lookups)
- `lib/data/india-mbbs.ts:67` (state/management filters)
- `lib/university-community.ts:78` (peer queries)
- `app/_actions/submit-lead.ts:143` (duplicate phone check)

---

### 2. Implement Transactions for Mutations

**File**: `app/_actions/submit-lead.ts:143`

Current:
```javascript
// Check for duplicate
const recentLead = await db.select(...);

// Insert new lead
const [lead] = await db.insert(leads).values({...}).returning();
```

Fix:
```javascript
const [lead] = await db.transaction(async (tx) => {
  // Check for duplicate
  const recentLead = await tx.select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.phone, data.phone), gte(leads.createdAt, minutesAgo(15))))
    .limit(1);

  if (recentLead.length > 0) {
    throw new Error("Duplicate lead within 15 minutes");
  }

  // Insert new lead
  return await tx.insert(leads).values({...}).returning();
});
```

**Apply to**:
- `app/_actions/submit-peer-request.ts`
- `app/_actions/submit-university-review.ts`
- `app/_actions/submit-peer-application.ts` (include file upload rollback)
- `app/_actions/manage-leads.ts` (bulk operations)

---

### 3. Fix In-Memory Pagination (Catalog)

**File**: `lib/data/catalog.ts:355`

Current:
```javascript
export function queryFinderCardProgramsPage(page: number, pageSize: number) {
  const allPrograms = listFinderPrograms(filters);
  const start = (page - 1) * pageSize;
  return allPrograms.slice(start, start + pageSize);
}
```

Fix - Add database-level pagination:
```javascript
// In catalog.ts, modify readCatalogFromDatabase to support pagination
const dbProgramsPage = await getDb().select()
  .from(programOfferings)
  .where(/* your filters */)
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

**File**: `lib/data/catalog.ts:199`

Remove hardcoded 1000 limit:
```javascript
const dbPrograms = await getDb()
  .select({
    id: indiaMedicalPrograms.id,
    collegeName: indiaMedicalColleges.collegeName,
    // ... rest of fields
  })
  .from(indiaMedicalPrograms)
  .innerJoin(
    indiaMedicalColleges,
    eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
  )
  .limit(1000); // <-- REMOVE THIS, add pagination parameters
```

---

### 4. Add Query Timeouts

**File**: `lib/db/core.ts:11`

Add timeout wrapper:
```javascript
import { AbortController } from 'node:abort-controller';

export function getDb() {
  if (!dbInstance) {
    const connection = neon(getDatabaseUrl());
    dbInstance = drizzle(connection);
  }
  return dbInstance;
}

// Add timeout utility
export async function queryWithTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs: number = 30_000
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Note: Neon HTTP doesn't support AbortSignal directly
    // You'll need to implement at application level
    const result = await Promise.race([
      queryFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      )
    ]);
    return result as T;
  } finally {
    clearTimeout(timeout);
  }
}
```

Usage:
```javascript
const catalog = await queryWithTimeout(
  () => readCatalogFromDatabase(),
  30_000
);
```

---

## High Priority

### 5. Add Retry Logic for External APIs

**File**: `lib/lead-sync.ts:45`

Add exponential backoff:
```javascript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8_000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Retry on 5xx errors (server errors)
      if (response.ok || response.status < 500) {
        return response;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) break;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
```

**Apply to**:
- `lib/lead-sync.ts` (CRM, Pabbly, Google Sheets)
- `lib/wati.ts` (WhatsApp API)

---

### 6. Consolidate Duplicate Check + Insert

**File**: `app/_actions/submit-lead.ts:143`

Use INSERT with RETURNING instead of separate SELECT:
```javascript
// Instead of checking then inserting, use database constraint
// Add unique partial index on (phone, created_at) where created_at is recent

// Then simplify to:
try {
  const [lead] = await db.insert(leads)
    .values({...})
    .onConflictDoNothing() // If recent duplicate exists
    .returning();

  if (!lead) {
    return { success: false, error: "Duplicate submission" };
  }

  return { success: true, id: lead.id };
} catch (error) {
  // Handle constraint violations
}
```

---

### 7. Optimize Search Queries

**File**: `lib/search/search.ts:157`

Add full-text search index:
```sql
-- Create text search configuration
CREATE INDEX CONCURRENTLY search_documents_fts_idx
  ON search_documents
  USING GIN(to_tsvector('english', search_text));

-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram index
CREATE INDEX CONCURRENTLY search_documents_trigram_idx
  ON search_documents
  USING GIN(search_text gin_trgm_ops);
```

Update query to use indexes:
```javascript
// Use PostgreSQL FTS instead of ParadeDB for fallback
const results = await getDb()
  .select()
  .from(searchDocuments)
  .where(
    sql`to_tsvector('english', search_text) @@ plainto_tsquery('english', ${query})`
  )
  .orderBy(
    sql`ts_rank(to_tsvector('english', search_text), plainto_tsquery('english', ${query})) DESC`
  );
```

---

## Medium Priority

### 8. Implement Circuit Breaker Pattern

Create `lib/circuit-breaker.ts`:
```javascript
export class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private resetTimeout: number = 60_000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage in lead-sync.ts
const crmCircuitBreaker = new CircuitBreaker(5, 60_000);

await crmCircuitBreaker.execute(() =>
  fetch(env.crmLeadIntakeUrl, {...})
);
```

---

### 9. Add Query Performance Monitoring

**File**: `lib/db/core.ts`

```javascript
// Add slow query logging
export async function monitorQuery<T>(
  name: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`[SLOW QUERY] ${name} took ${duration}ms`);
      // Optional: Send to monitoring service
    }

    return result;
  } catch (error) {
    console.error(`[QUERY ERROR] ${name}:`, error);
    throw error;
  }
}

// Usage
const catalog = await monitorQuery(
  'readCatalogFromDatabase',
  () => readCatalogFromDatabase()
);
```

---

### 10. Fix Over-Fetching in Catalog

**File**: `lib/data/catalog.ts:155`

Current query selects large JSONB fields unnecessarily:
```javascript
const dbUniversities = await getDb().select().from(universities).where(...);
// This loads: whyChoose, thingsToConsider, bestFitFor, recognitionLinks, faq, etc.
```

Fix - Only select fields needed for catalog:
```javascript
const dbUniversities = await getDb()
  .select({
    id: universities.id,
    name: universities.name,
    slug: universities.slug,
    countryId: universities.countryId,
    // Exclude large JSONB fields unless needed
  })
  .from(universities)
  .where(eq(universities.published, true));
```

Load full university details only when needed (individual university page).

---

## Implementation Order

1. **Week 1**: Add database indexes (item #1) - Immediate performance boost
2. **Week 2**: Implement transactions (item #2) - Critical data integrity
3. **Week 2**: Add query timeouts (item #4) - Prevent hangs
4. **Week 3**: Fix pagination (item #3) - Memory efficiency
5. **Week 3**: Add retry logic (item #5) - External API resilience
6. **Week 4**: Optimize search (item #7) - User-facing performance
7. **Week 4**: Circuit breakers (item #8) - System stability
8. **Ongoing**: Monitoring (item #9) - Observability

---

## Performance Impact Estimates

| Fix | Expected Impact | Affected Users |
|-----|----------------|----------------|
| Database indexes | 10-100x faster queries | All |
| Pagination fix | 90% memory reduction | High-traffic pages |
| Query timeouts | Prevent infinite hangs | All (reliability) |
| Transactions | Data consistency | Form submissions |
| Retry logic | 80% fewer failed syncs | Lead generation |
| Search optimization | 5-10x faster search | Search users |

---

## Monitoring Checklist

After implementing fixes, monitor:
- [ ] Query execution times (p50, p95, p99)
- [ ] Database connection pool usage
- [ ] External API success rates
- [ ] Memory usage (Node.js heap)
- [ ] Cache hit rates
- [ ] Transaction rollback rates
- [ ] Circuit breaker state changes

---

## Notes

- Use `CREATE INDEX CONCURRENTLY` to avoid table locks
- Test transaction rollback behavior in staging
- Implement retry logic with jitter to prevent thundering herd
- Consider adding database read replicas for read-heavy workloads
- Monitor Neon serverless auto-scaling behavior
- Set up alerts for slow queries (>1s) and failed external API calls
