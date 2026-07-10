# Rate Limiting

Protect your API routes from abuse with intelligent rate limiting powered by Upstash Redis.

## 🎯 Overview

Rate limiting prevents API abuse, DDoS attacks, and excessive resource usage by limiting requests per IP address.

**Implementation**: `proxy.ts` (runs before the Next.js app)

**Storage**: Upstash Redis in production; in-memory fallback for development/public reads

**Coverage**: All `/api/*` routes automatically

---

## 📊 Rate Limit Configurations

| Endpoint Type | Limit | Window | Use Case |
|---------------|-------|--------|----------|
| General API | 100 req | 1 minute | Default for all API routes |
| Search/Finder | 60 req | 1 minute | Autocomplete, search queries |
| Lead Submission | 10 req | 1 minute | Form submissions |
| Admin/Cron | 10 req | 1 minute | Cache invalidation, jobs |
| Contact Tracking | 300 req | 1 minute | Click tracking |

---

## 🏗️ Architecture

```
User Request
    ↓
Vercel Edge Network
    ↓
Proxy (rate-limit.ts)
    ↓
Check Redis for IP count
    ↓
┌─────────────┬─────────────┐
│  Under      │    Over     │
│  Limit      │   Limit     │
└──────┬──────┴──────┬──────┘
       │             │
   Allow (200)   Block (429)
       │             │
   Next.js App   Rate Limit
                  Response
```

---

## 📁 Files

### `/proxy.ts`
The Next.js proxy intercepts API requests:

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    // Determine rate limit config
    let config = rateLimitConfigs.api;

    if (pathname.startsWith("/api/suggestions")) {
      config = rateLimitConfigs.search;
    }

    // Get IP and check rate limit
    const identifier = getRateLimitIdentifier(request);
    const result = await rateLimit(identifier, config);

    if (!result.success) {
      return createRateLimitResponse(result);
    }

    // Add headers and continue
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    return response;
  }

  return NextResponse.next();
}
```

### `/lib/rate-limit.ts`
Core rate limiting logic with Redis and in-memory fallback:

```typescript
export async function rateLimit(
  identifier: string,
  config: { limit: number; window: number }
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(); // Redis or in-memory
  return limiter.limit(identifier, config.limit, config.window);
}
```

---

## 🔧 How It Works

### 1. IP Identification
```typescript
function getRateLimitIdentifier(request: Request): string {
  // Try Vercel headers first
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
```

### 2. Redis Fixed Window
```typescript
// Store: ratelimit:{ip}:{window}
// Key expires after window duration
// Count increments on each request
// Limit checked before allowing request
```

### 3. Response Headers
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1735689600000
```

### 4. Blocked Response
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
Content-Type: application/json

{
  "error": "Too many requests. Please try again later."
}
```

---

## ⚙️ Configuration

### Customize Limits

Edit `/lib/rate-limit.ts`:

```typescript
export const rateLimitConfigs = {
  api: {
    limit: 100,      // ← Change limit
    window: 60 * 1000, // ← Change window (ms)
  },
  leads: {
    limit: 5,         // ← Stricter for forms
    window: 60 * 1000,
  },
};
```

### Add New Endpoint Rules

Edit `/proxy.ts`:

```typescript
if (pathname.startsWith("/api/premium-feature")) {
  config = { limit: 10, window: 60 * 1000 }; // Custom limit
}
```

### Whitelist IPs

```typescript
const WHITELISTED_IPS = ["1.2.3.4", "5.6.7.8"];

export async function middleware(request: NextRequest) {
  const ip = getRateLimitIdentifier(request);

  if (WHITELISTED_IPS.includes(ip)) {
    return NextResponse.next(); // Skip rate limiting
  }

  // ... normal rate limiting
}
```

---

## 🧪 Testing

### Test Rate Limiting Locally

```bash
# Should work ~100 times, then fail
for i in {1..150}; do
  echo "Request $i:"
  curl -w "\nStatus: %{http_code}\n" \
    http://localhost:3000/api/suggestions?q=test
  sleep 0.1
done
```

### Test Specific Endpoint

```bash
# Lead submission (limit: 10/min)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/leads \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com"}'
done
```

### Check Headers

```bash
curl -I http://localhost:3000/api/suggestions?q=test
# Look for:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 59
```

---

## 📊 Monitoring

### Vercel Logs

Search for rate limit blocks:
```
429
X-RateLimit-Limit
```

### Upstash Dashboard

Monitor Redis usage:
1. Go to https://console.upstash.com/
2. Select your database
3. Check "Requests" graph
4. Look for spikes during attacks

### Create Alerts

In Upstash:
- Alert on > 8,000 requests/day (80% of free tier)
- Alert on connection errors

---

## 🚨 Common Issues

### Rate Limit Too Strict

**Symptom**: Legitimate users getting blocked

**Solution**: Increase limits in `rate-limit.ts`

```typescript
api: {
  limit: 200, // ← Increased from 100
  window: 60 * 1000,
}
```

### Rate Limit Not Working

**Check**:
1. Is `proxy.ts` in project root? ✅
2. Are Redis credentials correct? ✅
3. Is path matching in middleware? ✅

**Debug**:
```typescript
// Add logging in proxy.ts
console.log('[rate-limit]', {
  path: pathname,
  ip: identifier,
  result: result,
});
```

### Redis Connection Fails

**Symptom**: Rate limiting works but slow

**Cause**: Using in-memory fallback (less reliable in serverless)

**Solution**:
1. Verify `UPSTASH_REDIS_REST_URL` is set
2. Test connection:
   ```bash
   curl "${UPSTASH_REDIS_REST_URL}/ping" \
     -H "Authorization: Bearer ${UPSTASH_REDIS_REST_TOKEN}"
   # Should return: {"result":"PONG"}
   ```

---

## 🔒 Security Considerations

### IP Spoofing

**Risk**: Attackers can spoof `X-Forwarded-For` header

**Mitigation**: Vercel sets trusted headers automatically

**Additional**: Implement API keys for sensitive endpoints

### Distributed Attacks

**Risk**: Attacker uses many IPs

**Mitigation**:
- Rate limit by endpoint globally
- Add authentication
- Use Vercel DDoS protection

### Legitimate High Traffic

**Risk**: Rate limiting blocks real users during traffic spikes

**Solution**:
- Increase limits temporarily
- Add authenticated bypass
- Use exponential backoff in client

---

## 🎯 Best Practices

### ✅ DO

- Use different limits for different endpoint types
- Monitor rate limit metrics
- Provide clear error messages
- Include `Retry-After` header
- Whitelist known good IPs

### ❌ DON'T

- Set limits too low (frustrates users)
- Block without warning
- Use same limit for all endpoints
- Ignore monitoring
- Forget to test before deployment

---

## 📈 Scaling

### Free Tier (10K req/day)

- Good for: 100K-300K users/month
- Cost: $0

### Paid Tier ($10/month)

- Capacity: 100K req/day
- Good for: 1M-3M users/month

### Enterprise

- Custom pricing
- Dedicated Redis
- Higher limits

---

## 🔗 Related

- [Environment Variables](../reference/environment-variables.md)
- [Caching Strategy](./caching.md)
- [Troubleshooting](../guides/troubleshooting.md)

---

**Last Updated**: May 2026
