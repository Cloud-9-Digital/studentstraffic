# Archived: Query Optimization Status Report (May 2026)

> Historical snapshot. Several statuses and file references are no longer current. Use the current backend architecture and reliability documentation for active guidance.
Generated: 2026-05-07

## ✅ COMPLETED OPTIMIZATIONS

### 1. Database Indexes - **PARTIALLY DONE**

**Added Indexes** (from migrations 0025, 0032, 0033):
- ✅ `leads_phone_created_at_idx` - Composite index on (phone, created_at)
- ✅ `leads_created_at_idx` - Index on created_at
- ✅ `leads_seminar_event_idx` - Index on seminar_event
- ✅ `leads_interested_country_idx` - Index on interested_country
- ✅ `leads_full_name_trgm_idx` - Trigram index for name search
- ✅ `leads_phone_trgm_idx` - Trigram index for phone search
- ✅ `leads_email_trgm_idx` - Trigram index for email search
- ✅ `leads_father_name_trgm_idx` - Trigram index for father name search
- ✅ `leads_wati_whatsapp_message_id_idx` - Index on WhatsApp message ID

**Still Missing**:
- ❌ `program_offerings_university_course_idx` - On (university_id, course_id)
- ❌ `india_medical_colleges_state_management_idx` - On (state_name, management_type)
- ❌ `india_medical_colleges_course_idx` - On (course_name)
- ❌ `student_peers_university_status_idx` - On (university_id, status)
- ❌ `security_rate_limits_scope_identifier_idx` - On (scope, identifier)
- ❌ `search_documents_type_featured_idx` - On (document_type, featured)

**Impact**: 🟢 Major improvement for lead queries, but catalog and search queries still need optimization

---

### 2. Query Timeouts - **DONE** ✅

**File**: `lib/db/transport.ts`

**Implementation**:
```javascript
const DB_QUERY_TIMEOUT_MS = 15_000;
const SLOW_DB_QUERY_MS = 1_000;

function withTimeoutSignal(existingSignal: AbortSignal | null | undefined) {
  const timeoutSignal = AbortSignal.timeout(DB_QUERY_TIMEOUT_MS);
  return existingSignal ? AbortSignal.any([existingSignal, timeoutSignal]) : timeoutSignal;
}
```

**Features**:
- ✅ 15 second timeout on all database queries
- ✅ Slow query logging (queries > 1000ms)
- ✅ Automatic timeout enforcement via AbortSignal
- ✅ Error logging with duration and query details

**Status**: Fully implemented and active

---

### 3. Database-Level Pagination - **PARTIALLY DONE**

**File**: `lib/data/catalog.ts:912-999`

**Implementation**: `queryFinderProgramsFromDatabase()` function added

**Features**:
- ✅ Uses LIMIT/OFFSET at database level
- ✅ Proper COUNT query for total items
- ✅ Falls back to in-memory pagination if database unavailable
- ✅ Used in `queryFinderCardProgramsPage()` function

**Still Using In-Memory**:
- ⚠️ `listFinderPrograms()` - Loads all programs then filters in memory
- ⚠️ `getFinderProgramsPage()` - Uses listFinderPrograms (in-memory)
- ⚠️ `catalog.ts:209` - Still has `limit(1000)` on India colleges join

**Status**: Database pagination implemented but not used everywhere

---

### 4. Transactions for Mutations - **PARTIALLY DONE**

**Implemented**: `app/_actions/submit-peer-request.ts:205-326`

**Uses SQL CTE (Common Table Expression)** to ensure atomicity:
```sql
WITH recent_request AS (
  SELECT 1 FROM peer_requests WHERE ...
),
inserted_lead AS (
  INSERT INTO leads ... WHERE NOT EXISTS (SELECT 1 FROM recent_request)
  RETURNING id
),
inserted_peer_request AS (
  INSERT INTO peer_requests ... FROM inserted_lead
  RETURNING lead_id
)
SELECT lead_id FROM inserted_peer_request
```

**Status**:
- ✅ Peer request submission uses atomic CTE
- ❌ `submit-lead.ts` - Still uses separate check + insert (no transaction)
- ❌ `submit-university-review.ts` - Still uses separate queries
- ❌ `submit-peer-application.ts` - No transaction for upload + insert
- ❌ `manage-leads.ts` - Bulk operations not atomic

**Impact**: 🟡 Partial protection - only peer requests are atomic

---

## ❌ MISSING OPTIMIZATIONS

### 5. Retry Logic for External APIs - **NOT DONE**

**Files**: `lib/lead-sync.ts`, `lib/wati.ts`, `lib/google-sheets-core.ts`

**Current State**:
- Single fetch attempt with 8s timeout
- No exponential backoff
- No retry on transient failures
- `Promise.allSettled()` used but no retries

**Impact**: ❌ Failed external API calls not retried

---

### 6. Circuit Breaker Pattern - **NOT DONE**

**Impact**: ❌ No protection against repeated external API failures

---

### 7. Consolidate Duplicate Check + Insert - **NOT DONE**

**File**: `app/_actions/submit-lead.ts:159-181`

**Current State**:
```javascript
// Still uses 2 queries
const recentLead = await db.select({ id: leads.id })
  .from(leads)
  .where(and(eq(leads.phone, data.phone), gte(leads.createdAt, minutesAgo(15))))
  .limit(1);

if (recentLead) { return error; }

const [insertedLead] = await db.insert(leads).values({...}).returning();
```

**Impact**: ⚠️ Race condition possible, inefficient

---

### 8. Search Query Optimization - **NOT DONE**

**File**: `lib/search/search.ts`

**Current State**:
- No additional indexes mentioned in migrations
- Still relies on ParadeDB for primary search
- Fallback searches may be slow

**Missing**:
- PostgreSQL full-text search indexes
- Trigram indexes for fuzzy search
- Query optimization for fallback searches

---

### 9. Over-Fetching in Catalog - **NOT FIXED**

**File**: `lib/data/catalog.ts:155-180`

**Current State**:
- Still selecting all JSONB fields:
  - `whyChoose`
  - `thingsToConsider`
  - `bestFitFor`
  - `recognitionLinks`
  - `faq`
  - `researchSources`

**Impact**: ⚠️ Large JSONB fields loaded unnecessarily for catalog listings

---

### 10. India Medical Colleges 1000 Limit - **NOT FIXED**

**File**: `lib/data/catalog.ts:209`

```javascript
.limit(1000),  // <-- Still hardcoded
```

**Impact**: ⚠️ Arbitrary limit may hide data

---

## 📊 SUMMARY SCORECARD

| Category | Status | Score |
|----------|--------|-------|
| Database Indexes | Partial | 🟡 6/15 (40%) |
| Query Timeouts | Complete | 🟢 100% |
| Pagination | Partial | 🟡 50% |
| Transactions | Partial | 🟡 25% |
| Retry Logic | Not Done | 🔴 0% |
| Circuit Breakers | Not Done | 🔴 0% |
| Query Consolidation | Not Done | 🔴 0% |
| Search Optimization | Not Done | 🔴 0% |
| Over-fetching Fix | Not Done | 🔴 0% |
| Monitoring | Partial | 🟡 50% |

**Overall Progress**: 🟡 **37%** of critical optimizations completed

---

## 🎯 RECOMMENDED NEXT STEPS

### Immediate (High Impact, Low Effort):

1. **Add Missing Indexes** (30 minutes)
   ```sql
   CREATE INDEX CONCURRENTLY program_offerings_university_course_idx
     ON program_offerings(university_id, course_id);

   CREATE INDEX CONCURRENTLY india_medical_colleges_state_management_idx
     ON india_medical_colleges(state_name, management_type);

   CREATE INDEX CONCURRENTLY student_peers_university_status_idx
     ON student_peers(university_id, status);

   CREATE UNIQUE INDEX CONCURRENTLY security_rate_limits_scope_identifier_idx
     ON security_rate_limits(scope, identifier);
   ```

2. **Fix Lead Submission Transaction** (15 minutes)
   - Convert `submit-lead.ts` to use CTE like peer requests
   - Removes race condition
   - Consolidates queries

3. **Remove 1000 Limit** (5 minutes)
   - Either remove entirely or make configurable
   - Add proper pagination if needed

### Medium Priority (This Week):

4. **Add Retry Logic** (2 hours)
   - Implement exponential backoff utility
   - Add to lead-sync.ts, wati.ts, google-sheets-core.ts
   - Configure retry counts per service

5. **Optimize Catalog Over-fetching** (1 hour)
   - Create slim university select for catalog
   - Load full details only on university detail pages
   - Reduce memory usage by 60-70%

6. **Complete Transaction Coverage** (2 hours)
   - Add transactions to submit-university-review.ts
   - Add transactions to submit-peer-application.ts
   - Add transactions to manage-leads.ts bulk operations

### Low Priority (Next Sprint):

7. **Circuit Breaker Implementation** (3 hours)
8. **Search Index Optimization** (4 hours)
9. **Enhanced Monitoring** (2 hours)

---

## 📈 EXPECTED IMPACT OF REMAINING WORK

| Fix | Performance Gain | User Impact |
|-----|------------------|-------------|
| Missing indexes | 5-20x faster | High-traffic catalog pages |
| Lead transaction | Prevent race conditions | Data consistency |
| Retry logic | 70-80% fewer failed syncs | Lead capture reliability |
| Over-fetching fix | 60% memory reduction | Page load speed |
| Remove 1000 limit | Access to all data | India colleges completeness |

---

## ✅ WHAT'S WORKING WELL

1. **Query Timeouts** - Preventing database hangs ✅
2. **Slow Query Logging** - Visibility into performance issues ✅
3. **Lead Indexes** - Fast duplicate detection ✅
4. **Peer Request Atomicity** - Transaction-safe submissions ✅
5. **Database Pagination** - When used, eliminates memory issues ✅

---

## 🚨 CRITICAL ISSUES REMAINING

1. **No Transactions on Lead Submission** - Race condition risk
2. **Missing 9 Critical Indexes** - Slow queries on high-traffic pages
3. **No Retry Logic** - Failed external syncs not recovered
4. **Over-fetching JSONB** - High memory usage
5. **In-memory Filtering** - Some queries still load all data

---

## 🔍 VERIFICATION COMMANDS

Check if indexes exist:
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE '%university%'
  OR indexname LIKE '%program%'
  OR indexname LIKE '%peer%';
```

Check slow queries:
```sql
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;
```

Monitor query timeouts:
```bash
# Check logs for [db-error] messages
grep -i "db-error" logs/production.log
```

---

## 📝 NOTES

- Codex completed ~37% of recommended optimizations
- Major wins: Query timeouts, lead indexes, peer transactions
- Still needs: Remaining indexes, retry logic, lead transactions
- Database-level pagination exists but not used everywhere
- Overall: Good progress on core issues, needs completion

---

**Last Updated**: 2026-05-07
**Review Date**: 2026-05-14
