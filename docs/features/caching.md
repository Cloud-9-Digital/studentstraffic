# Caching Strategy

> **Historical reference:** the ISR tables, Redis references and one-hour examples below predate the
> current Next.js 16 Cache Components implementation. The live catalogue uses the `catalog` cache
> profile in `next.config.ts`, scoped tags in `lib/data/catalog.ts`, and the protected publisher
> endpoint in `app/api/revalidate/route.ts`. Use `docs/university-pipeline-architecture.md` for current
> operations.

Multi-layer caching for maximum performance and minimal database load.

## 🎯 Overview

Our caching strategy uses three layers:
1. **Vercel Edge Cache** - Global CDN
2. **Next.js ISR** - Incremental Static Regeneration
3. **Redis Cache** - Hot data storage

This achieves **~95% cache hit rate** and **50-500ms page loads**.

---

## 📊 Caching Layers

```
┌─────────────────────────────────────┐
│      User Request                    │
└──────────┬──────────────────────────┘
           │
    ┌──────▼──────┐
    │ Vercel Edge │ ← Layer 1: Global CDN
    │  (100+ POP) │   (Cached HTML/Assets)
    └──────┬──────┘
           │ MISS
    ┌──────▼──────┐
    │  Next.js    │ ← Layer 2: ISR
    │  ISR Cache  │   (Generated Pages)
    └──────┬──────┘
           │ MISS
    ┌──────▼──────┐
    │   Redis     │ ← Layer 3: Hot Data
    │   Cache     │   (Search, Catalog)
    └──────┬──────┘
           │ MISS
    ┌──────▼──────┐
    │  Database   │ ← Origin
    │  (Neon)     │   (Source of Truth)
    └─────────────┘
```

---

## 🏗️ Layer 1: Vercel Edge Cache

### What It Caches
- Static pages (after first request)
- API route responses (if configured)
- Static assets (CSS, JS, images)

### Configuration
Automatic - no setup needed!

### Headers
```http
# First visit
x-vercel-cache: MISS

# Subsequent visits
x-vercel-cache: HIT

# After revalidation period
x-vercel-cache: STALE
```

### Benefits
- **Fastest**: 10-50ms response time
- **Global**: 100+ edge locations
- **Free**: Included with Vercel

---

## 🏗️ Layer 2: Next.js ISR

### What It Is
Incremental Static Regeneration - pages are statically generated on-demand and cached.

### Configuration
Every dynamic page has:

```typescript
// Revalidate every hour
export const revalidate = 3600;

// Generate missing pages on-demand
export const dynamicParams = true;
```

### How It Works

1. **First Request**:
   - Page doesn't exist
   - Next.js generates it
   - Page cached for 1 hour
   - Returns to user (slower)

2. **Subsequent Requests** (within 1 hour):
   - Serve cached page
   - Super fast (50-200ms)

3. **After 1 Hour**:
   - Serve stale page (still fast)
   - Regenerate in background
   - Next request gets fresh page

### Pages Using ISR

| Route | Sample Size | On-Demand | Revalidate |
|-------|-------------|-----------|------------|
| `/universities/[slug]` | 24 | ✅ | 1 hour |
| `/countries/[slug]` | All | ✅ | 1 hour |
| `/courses/[slug]` | All | ✅ | 1 hour |
| `/cities/[slug]` | None | ✅ | 1 hour |
| `/blog/[slug]` | None | ✅ | 1 hour |
| `/[slug]` (landing) | None | ✅ | 1 hour |

### Cache Tags

```typescript
async function getUniversityPageData(slug: string) {
  "use cache";

  cacheLife("hours");          // ← 1 hour cache
  cacheTag("catalog");         // ← Tag for invalidation
  cacheTag("universities");    // ← Specific tag

  return await getUniversityBySlug(slug);
}
```

### Manual Invalidation

```bash
# Invalidate by tag
curl -X POST https://your-site.com/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["universities"],
    "secret": "your-revalidate-secret"
  }'
```

---

## 🏗️ Layer 3: Redis Cache

### What It Caches
- Search results
- Catalog lookups
- Hot queries
- Session data

### Configuration

```typescript
import { getOrSet, cacheKeys } from '@/lib/redis-cache';

// Cache search results for 5 minutes
const results = await getOrSet(
  cacheKeys.search(query),
  () => searchDatabase(query),
  { ttl: 300, tags: ['search'] }
);
```

### Cache Keys

```typescript
export const cacheKeys = {
  search: (query: string) => `search:${query}`,
  university: (slug: string) => `university:${slug}`,
  country: (slug: string) => `country:${slug}`,
  programs: (filters: string) => `programs:${filters}`,
};
```

### TTL (Time To Live)

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Search results | 5 min | Changes frequently |
| University data | 1 hour | Syncs with ISR |
| Country data | 1 hour | Rarely changes |
| User sessions | 24 hours | Long-lived |

### Tag-Based Invalidation

```typescript
// Set cache with tags
await setCached(
  'university:harvard',
  universityData,
  { ttl: 3600, tags: ['catalog', 'universities'] }
);

// Invalidate all universities
await invalidateByTag('universities');
```

---

## 📈 Performance Metrics

### Before Caching
- Page load: 2-5 seconds
- Database queries: 5-10 per page
- Cache hit rate: ~20%

### After Caching
- Page load: 50-500ms ⚡
- Database queries: 0-1 per page 📉
- Cache hit rate: ~95% 🎯

### Monitoring

```bash
# Check cache headers
curl -I https://your-site.com/universities/harvard

# Look for:
x-vercel-cache: HIT           # ← Good!
age: 45                       # ← Seconds since cached
cache-control: s-maxage=3600  # ← Cache for 1 hour
```

---

## 🔧 Usage Examples

### Cache Page Data

```typescript
// app/universities/[slug]/page.tsx
async function getUniversityPageData(slug: string) {
  "use cache"; // ← Enable caching

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("universities");

  return await getUniversityBySlug(slug);
}
```

### Cache API Route

```typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // Try Redis first
  const cached = await getCached(cacheKeys.search(query));
  if (cached) {
    return Response.json(cached);
  }

  // Cache miss - query database
  const results = await searchDatabase(query);

  // Store in Redis for next time
  await setCached(cacheKeys.search(query), results, {
    ttl: 300,
    tags: ['search'],
  });

  return Response.json(results);
}
```

### Invalidate Cache

```typescript
// After updating database
import { revalidateTag } from 'next/cache';
import { invalidateByTag } from '@/lib/redis-cache';

// Update database
await updateUniversity(slug, newData);

// Invalidate Next.js cache
revalidateTag('universities', { expire: 0 });

// Invalidate Redis cache
await invalidateByTag('universities');
```

---

## 🎯 Best Practices

### ✅ DO

- Cache expensive queries
- Use cache tags for invalidation
- Set appropriate TTLs
- Monitor cache hit rates
- Invalidate after updates

### ❌ DON'T

- Cache user-specific data in shared cache
- Use very long TTLs for frequently updated data
- Forget to invalidate after writes
- Cache without tags (hard to invalidate)
- Ignore cache misses in monitoring

---

## 🔄 Cache Invalidation Strategies

### 1. Time-Based (TTL)
Best for: Data that changes on a schedule

```typescript
// Cache for 1 hour
cacheLife("hours");
```

### 2. Tag-Based (Manual)
Best for: Data that changes on admin action

```typescript
// Tag all related data
cacheTag("universities");

// Invalidate when updated
revalidateTag("universities");
```

### 3. On-Demand (API)
Best for: External triggers

```typescript
// POST /api/cache/invalidate
{
  "tags": ["blog"],
  "secret": "..."
}
```

### 4. Stale-While-Revalidate
Best for: Maximum uptime

```typescript
// Serve stale content while regenerating
export const revalidate = 3600;
```

---

## 🚨 Common Issues

### Cache Not Hitting

**Symptom**: Always seeing `x-vercel-cache: MISS`

**Causes**:
1. Page not static (uses cookies/headers)
2. Revalidate too short
3. In development mode (ISR disabled)

**Solution**:
```typescript
// Make sure page is static
export const dynamic = 'force-static';
export const revalidate = 3600;
```

### Stale Data Showing

**Symptom**: Old content showing after update

**Causes**:
1. Cache not invalidated
2. Multiple cache layers

**Solution**:
```typescript
// Invalidate all layers
await Promise.all([
  revalidateTag('universities', { expire: 0 }),
  invalidateByTag('universities'),
  fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ tags: ['universities'] })
  })
]);
```

### Redis Cache Misses

**Symptom**: Low cache hit rate

**Causes**:
1. TTL too short
2. Cache keys not consistent
3. High cardinality (too many unique keys)

**Solution**:
```typescript
// Normalize cache keys
function normalizeSearchQuery(q: string) {
  return q.toLowerCase().trim();
}

const key = cacheKeys.search(normalizeSearchQuery(query));
```

---

## 📊 Monitoring

### Vercel Analytics

Monitor cache performance:
1. Go to Vercel dashboard
2. Select project
3. Check "Analytics" tab
4. Look for:
   - Cache hit rate
   - Response times
   - Edge vs Origin ratio

### Custom Monitoring

```typescript
// Track cache hits/misses
export async function getCached<T>(key: string): Promise<T | null> {
  const start = performance.now();
  const cached = await redis.get(key);
  const duration = performance.now() - start;

  // Log to monitoring service
  console.log('[cache]', {
    key,
    hit: !!cached,
    duration,
  });

  return cached;
}
```

---

## 💰 Cost Optimization

### Vercel Bandwidth

Caching reduces bandwidth usage:
- Before: 100 GB/month
- After: 10 GB/month
- Savings: 90%

### Database Costs

Caching reduces queries:
- Before: 1M queries/day
- After: 100K queries/day
- Savings: 90%

### Redis Costs

Efficient caching reduces Redis calls:
- Use longer TTLs
- Cache aggregated data
- Invalidate smartly

---

## 🔗 Related

- [Rate Limiting](./rate-limiting.md)
- [Database Monitoring](./database-monitoring.md)
- [Environment Variables](../reference/environment-variables.md)

---

**Last Updated**: May 2026
