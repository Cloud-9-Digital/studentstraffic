# Troubleshooting Guide

Common issues and solutions for deploying and running the application.

## 🚨 Deployment Issues

### "Both middleware.ts and proxy.ts detected" Error

**Error Message**:
```
Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.
Please use "./proxy.ts" only.
```

**Cause**: Next.js 16 renamed `middleware.ts` to `proxy.ts`

**Solution**: ✅ Already fixed! File is now `proxy.ts`

**If you see this again**:
```bash
# Remove old middleware.ts if it exists
rm middleware.ts

# Ensure proxy.ts exists
ls proxy.ts
```

---

### Build Fails with TypeScript Errors

**Symptom**: Build fails during `npm run build`

**Common Errors**:

1. **Type errors in proxy.ts**:
   ```
   Type '{ limit: 60 }' is not assignable to type '{ limit: 100 }'
   ```

   **Solution**: Add type annotation
   ```typescript
   let config: { limit: number; window: number } = rateLimitConfigs.api;
   ```

2. **Missing environment variables**:
   ```
   Invalid environment variables
   ```

   **Solution**: Check all required vars are set in Vercel

3. **Sentry configuration errors**:
   ```
   Property 'hideSourceMaps' does not exist
   ```

   **Solution**: Use updated Sentry config (already fixed in `next.config.ts`)

---

### Vercel Deployment Stuck

**Symptom**: Deployment hangs or times out

**Causes**:
1. Large build output
2. Too many static pages
3. Database connection timeout

**Solutions**:

1. **Check build logs**:
   ```
   Vercel → Deployments → Click deployment → View logs
   ```

2. **Reduce static generation**:
   ```typescript
   // Reduce sample size temporarily
   const STATIC_UNIVERSITY_SAMPLE_SIZE = 10; // was 24
   ```

3. **Check database connectivity**:
   ```bash
   # Test database connection
   curl -X POST https://your-site.vercel.app/api/suggestions?q=test
   ```

---

## 🔧 Rate Limiting Issues

### Rate Limit Too Strict (Users Blocked)

**Symptom**: Legitimate users getting 429 errors

**Check**:
```bash
# Test current limit
for i in {1..150}; do
  curl https://your-site.com/api/suggestions?q=test
done
```

**Solution 1**: Increase limits in `lib/rate-limit.ts`
```typescript
export const rateLimitConfigs = {
  api: {
    limit: 200, // ← Increase from 100
    window: 60 * 1000,
  },
};
```

**Solution 2**: Add IP whitelist in `proxy.ts`
```typescript
const WHITELISTED_IPS = ["your-office-ip"];

if (WHITELISTED_IPS.includes(identifier)) {
  return NextResponse.next(); // Skip rate limiting
}
```

---

### Rate Limiting Not Working

**Symptom**: No 429 errors even after many requests

**Check**:
1. Is `proxy.ts` in project root? ✅
2. Are Redis credentials set? ✅
3. Is the path matching?

**Debug**:
```typescript
// Add to proxy.ts temporarily
console.log('[rate-limit]', {
  path: pathname,
  ip: identifier,
  limit: config.limit,
  result: result,
});
```

**Common Causes**:
- Proxy function not exported correctly
- Matcher config not matching your routes
- Redis connection failing (using in-memory fallback)

---

### Redis Connection Errors

**Symptom**: Rate limiting works but inconsistent

**Test Connection**:
```bash
curl "https://close-buzzard-88151.upstash.io/ping" \
  -H "Authorization: Bearer gQAAAAAAAVhXAAIgcDI1Y2U4ZjFkN2FmMTk0YjZiYWIxMDdkODkwMThhYzA4Nw"

# Should return: {"result":"PONG"}
```

**If fails**:
1. Check URL format (must include `https://`)
2. Verify token is correct
3. Check Upstash dashboard for service status

**Fallback**: System automatically uses in-memory rate limiting if Redis fails

---

## 🎯 Caching Issues

### Pages Not Caching (Always MISS)

**Symptom**: `x-vercel-cache: MISS` on every request

**Causes**:
1. Running in development mode (caching disabled)
2. Page uses cookies/headers (not static)
3. Revalidate time too short

**Solutions**:

1. **Verify production deployment**:
   ```bash
   # Check environment
   curl -I https://your-site.vercel.app/
   # Should NOT be preview URL
   ```

2. **Check page configuration**:
   ```typescript
   // Ensure these exports exist
   export const revalidate = 3600;
   export const dynamic = 'force-static';
   ```

3. **Wait for cache to populate**:
   - First visit: MISS (expected)
   - Wait 30 seconds
   - Second visit: Should be HIT

---

### Stale Data Showing

**Symptom**: Old content displaying after update

**Cause**: Cache not invalidated after database update

**Solution 1**: Manual invalidation via API
```bash
curl -X POST https://your-site.com/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["universities"],
    "secret": "your-revalidate-secret"
  }'
```

**Solution 2**: Invalidate in code after updates
```typescript
import { revalidateTag } from 'next/cache';
import { invalidateByTag } from '@/lib/redis-cache';

// After updating database
await updateUniversity(slug, data);

// Invalidate all caches
revalidateTag('universities', { expire: 0 });
await invalidateByTag('universities');
```

---

### Cache Headers Missing

**Symptom**: No `x-vercel-cache` header

**Cause**: Route is dynamic or using server-side rendering

**Check**:
```typescript
// Make sure page doesn't use these:
// - cookies()
// - headers()
// - searchParams (without generateStaticParams)

// Should have:
export const dynamic = 'force-static';
export const revalidate = 3600;
```

---

## 🔍 Database Issues

### Slow Queries (>1 second)

**Symptom**: Logs show `[db-slow]` messages

**Debug**:
1. Find the slow query in logs
2. Copy query to Neon SQL editor
3. Run `EXPLAIN ANALYZE <query>`
4. Look for "Seq Scan" (bad - table scan)

**Solution**: Add index
```typescript
// In lib/db/schema.ts
export const programOfferings = pgTable(
  "program_offerings",
  {
    // ... fields
  },
  (table) => [
    // Add index for slow JOIN
    index("program_offerings_university_idx").on(table.universityId),
  ]
);
```

**Apply**:
```bash
npm run db:generate
npm run db:push
```

---

### Database Connection Timeouts

**Symptom**: `Connection timeout` errors in logs

**Causes**:
1. Using non-pooled connection string
2. Too many concurrent connections
3. Network issues

**Solution**:
1. **Use pooled connection**:
   ```bash
   # Correct (includes -pooler):
   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db

   # Wrong (no pooler):
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/db
   ```

2. **Check connection limits**:
   - Go to Neon dashboard
   - Check "Monitoring" → "Connections"
   - Should be <100

---

### "Too many connections" Error

**Symptom**: Database rejects new connections

**Cause**: Connection pool exhausted

**Immediate Fix**:
```bash
# Restart Neon compute (in dashboard)
Neon → Project → Operations → Suspend → Resume
```

**Long-term Solution**:
- Use connection pooling (already configured)
- Reduce concurrent requests
- Add connection pool monitoring

---

## 🐛 Sentry Issues

### Errors Not Appearing in Sentry

**Symptom**: No errors in Sentry dashboard

**Check**:
1. Is `NEXT_PUBLIC_SENTRY_DSN` set?
2. Is DSN correct format?
3. Are errors actually happening?

**Test**:
```typescript
// Add temporarily to any page
<button onClick={() => {
  throw new Error("Test Sentry!");
}}>
  Test Error
</button>
```

**Common Issues**:
- DSN missing `NEXT_PUBLIC_` prefix
- DSN not in Vercel environment variables
- Sentry project is paused

---

### Source Maps Not Uploading

**Symptom**: Stack traces show minified code

**Cause**: `SENTRY_AUTH_TOKEN` not set or invalid

**Solution**:
1. Create new auth token: https://sentry.io/settings/account/api/auth-tokens/
2. Scopes: `project:releases`, `project:write`
3. Add to Vercel (Production only, not Preview/Development)

**Verify**:
```bash
# Check Sentry release
# After deployment, go to:
# Sentry → Releases
# Should see new release with source maps
```

---

### Too Many Sentry Events

**Symptom**: Hitting Sentry quota quickly

**Cause**: High error rate or sampling too high

**Solution 1**: Reduce sample rates
```typescript
// In sentry.client.config.ts
Sentry.init({
  tracesSampleRate: 0.1, // 10% instead of 100%
  replaysSessionSampleRate: 0.05, // 5% instead of 10%
});
```

**Solution 2**: Filter errors
```typescript
// In sentry.client.config.ts
ignoreErrors: [
  /ChunkLoadError/i,
  /NetworkError/i,
  // Add patterns to ignore
],
```

---

## 🌐 Environment Variable Issues

### "Invalid environment variables" Error

**Symptom**: Build fails with validation error

**Cause**: Missing or malformed env var

**Check**:
```typescript
// Look at lib/env.ts for required format
// Common issues:
DATABASE_URL=postgresql://...  // Must be URL format
UPSTASH_REDIS_REST_URL=https://...  // Must include https://
```

**Debug**:
```typescript
// Add temporarily to verify
console.log('Env check:', {
  hasDatabase: !!process.env.DATABASE_URL,
  hasRedis: !!process.env.UPSTASH_REDIS_REST_URL,
  hasSentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

---

### Variables Not Available in Browser

**Symptom**: `process.env.SENTRY_DSN` is undefined in client

**Cause**: Missing `NEXT_PUBLIC_` prefix

**Solution**:
```bash
# Wrong:
SENTRY_DSN=...

# Correct:
NEXT_PUBLIC_SENTRY_DSN=...
```

**Rule**: Only `NEXT_PUBLIC_*` vars are available in browser

---

## 🔄 Background Job Issues

### Jobs Not Processing

**Symptom**: Jobs stuck in "pending" status

**Check**:
1. Is cron job running? (Vercel → Cron Jobs)
2. Is `CRON_SECRET` or `REVALIDATE_SECRET` set?
3. Check cron logs for errors

**Debug**:
```bash
# Manually trigger job processing
curl -X POST "https://your-site.com/api/jobs/process?limit=10&secret=your-secret"
```

**Common Causes**:
- Cron schedule incorrect in `vercel.json`
- Job secret doesn't match
- Job processing throws error

---

### Jobs Timing Out

**Symptom**: Jobs marked as failed after 10s

**Cause**: Vercel function timeout (default 10s on Hobby)

**Solution**:
1. Upgrade to Vercel Pro (60s timeout)
2. Or optimize job processing
3. Or break into smaller jobs

---

## 📱 Development Issues

### Hot Reload Not Working

**Symptom**: Changes don't appear after save

**Solutions**:
1. **Check file watcher limit** (Mac/Linux):
   ```bash
   # Increase limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart dev server**:
   ```bash
   # Stop (Ctrl+C) and restart
   npm run dev
   ```

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### TypeScript Errors in IDE

**Symptom**: VSCode shows errors but build works

**Cause**: Stale TypeScript cache

**Solution**:
1. **Reload VSCode window**: Cmd+Shift+P → "Reload Window"
2. **Restart TS server**: Cmd+Shift+P → "TypeScript: Restart TS Server"
3. **Regenerate types**:
   ```bash
   npm run typecheck
   ```

---

## 🆘 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check Vercel deployment logs
3. ✅ Check Sentry error details
4. ✅ Test locally with `npm run build`
5. ✅ Verify environment variables

### Useful Debug Info

When reporting issues, include:
```bash
# Version info
next --version
node --version
npm --version

# Environment
echo $NODE_ENV

# Build output
npm run build 2>&1 | head -50

# Deployment URL
# Browser console errors
# Vercel function logs
```

---

## 🔗 Related Documentation

- [Deployment Guide](../getting-started/deployment.md)
- [Environment Variables](../reference/environment-variables.md)
- [Rate Limiting](../features/rate-limiting.md)
- [Caching](../features/caching.md)
- [Error Tracking](../features/error-tracking.md)

---

**Last Updated**: May 2026
