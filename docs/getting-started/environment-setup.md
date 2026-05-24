# Environment Variables Setup Guide

This guide shows you how to get all the environment variables needed for the scaling optimizations.

## 🎯 Quick Overview

| Service | Required? | Free Tier | Purpose |
|---------|-----------|-----------|---------|
| **Upstash Redis** | Optional | 10K req/day | Rate limiting + caching |
| **Sentry** | Recommended | 5K errors/month | Error tracking |
| **Existing Secrets** | Required | N/A | Cache revalidation |

---

## 1️⃣ Upstash Redis (Optional but Recommended)

### Why You Need It
- **Rate limiting**: Without Redis, rate limiting uses in-memory storage (less reliable in serverless)
- **Caching**: Speed up search queries and hot catalog data
- **Free tier**: 10K requests/day (enough for 100K-500K users/month)

### Setup Steps

1. **Create Account**
   - Go to: https://console.upstash.com/
   - Sign up with GitHub or Email (free)

2. **Create Redis Database**
   - Click "Create Database"
   - Choose:
     - **Type**: Regional
     - **Region**: Choose closest to your Vercel region (e.g., `us-east-1` if deploying to US East)
     - **Name**: `studentstraffic-cache`
   - Click "Create"

3. **Get Credentials**
   - Click on your database
   - Go to "REST API" tab
   - Copy:
     - `UPSTASH_REDIS_REST_URL` (e.g., `https://us1-proper-slug-12345.upstash.io`)
     - `UPSTASH_REDIS_REST_TOKEN` (long string)

4. **Add to Vercel**
   ```bash
   # In Vercel Dashboard:
   # Project → Settings → Environment Variables → Add

   UPSTASH_REDIS_REST_URL=https://us1-your-slug.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

5. **Add to Local Development** (`.env.local`):
   ```bash
   UPSTASH_REDIS_REST_URL=https://us1-your-slug.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

### Cost at Scale
- Free: Up to 10K commands/day
- $10/month: 100K commands/day (enough for 1M users/month)
- $50/month: 1M commands/day (enough for 5M+ users/month)

---

## 2️⃣ Sentry (Recommended for Production)

### Why You Need It
- **Error tracking**: Know immediately when something breaks
- **Stack traces**: Full context for debugging
- **Alerts**: Get notified of critical errors
- **Free tier**: 5K errors/month (perfect for getting started)

### Setup Steps

1. **Create Account**
   - Go to: https://sentry.io/signup/
   - Sign up with GitHub or Email (free)

2. **Create Project**
   - Click "Create Project"
   - Choose:
     - **Platform**: Next.js
     - **Project Name**: `studentstraffic`
   - Click "Create Project"

3. **Get DSN**
   - After project creation, you'll see your DSN
   - Format: `https://abc123@o456.ingest.sentry.io/789`
   - Copy this entire URL

4. **Get Auth Token** (Optional - for source maps)
   - Go to: https://sentry.io/settings/account/api/auth-tokens/
   - Click "Create New Token"
   - Scopes: `project:releases`
   - Copy the token

5. **Add to Vercel**
   ```bash
   # In Vercel Dashboard:
   # Project → Settings → Environment Variables → Add

   NEXT_PUBLIC_SENTRY_DSN=https://abc123@o456.ingest.sentry.io/789
   SENTRY_AUTH_TOKEN=your-token-here
   ```

6. **Add to Local Development** (`.env.local`):
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://abc123@o456.ingest.sentry.io/789
   SENTRY_AUTH_TOKEN=your-token-here
   ```

### Cost at Scale
- Free: 5K errors/month
- $26/month: 50K errors/month
- $80/month: 500K errors/month

---

## 3️⃣ Revalidate Secret (Required)

### Why You Need It
- **Cache invalidation**: Secure endpoint to clear cache
- **Already configured**: Just needs a strong secret

### Setup Steps

1. **Generate Secret**
   ```bash
   # Option 1: OpenSSL
   openssl rand -base64 32

   # Option 2: Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Example output:
   # K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
   ```

2. **Add to Vercel**
   ```bash
   # In Vercel Dashboard:
   # Project → Settings → Environment Variables → Add
   # If REVALIDATE_SECRET already exists, update it with a strong value

   REVALIDATE_SECRET=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
   ```

3. **Add to Local Development** (`.env.local`):
   ```bash
   REVALIDATE_SECRET=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
   ```

---

## 📋 Complete Environment Variables Checklist

### Minimum Required (Free)
```bash
# These must be in Vercel + .env.local

# Already have these:
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Update/add this:
REVALIDATE_SECRET=<your-generated-secret>
```

### Recommended (Free Tier)
```bash
# Add these for rate limiting and error tracking:

# Upstash Redis (free tier):
UPSTASH_REDIS_REST_URL=https://us1-your-slug.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Sentry (free tier):
NEXT_PUBLIC_SENTRY_DSN=https://abc123@sentry.io/789
SENTRY_AUTH_TOKEN=your-sentry-token
```

---

## 🚀 Deployment Steps

### Step 1: Add to Vercel

1. Go to your Vercel project
2. Click "Settings" → "Environment Variables"
3. Add each variable for **Production**, **Preview**, and **Development**
4. Click "Save"

### Step 2: Redeploy

```bash
# Trigger a new deployment to pick up env variables
git commit --allow-empty -m "Update environment variables"
git push
```

Or click "Redeploy" in Vercel dashboard.

### Step 3: Verify

1. **Check Rate Limiting**:
   ```bash
   # Should work for ~100 requests, then return 429
   for i in {1..150}; do
     curl https://your-site.com/api/suggestions?q=test
   done
   ```

2. **Check Caching**:
   - Visit any university page
   - Open DevTools → Network
   - Reload page
   - Look for `x-vercel-cache: HIT` header

3. **Check Sentry**:
   - Go to Sentry dashboard
   - Should see "Waiting for errors" or first test error
   - To test: Trigger an error in your app

4. **Check Redis** (if configured):
   - Go to Upstash dashboard
   - Click on your database
   - Should see "Requests" graph with activity

---

## 🔧 Troubleshooting

### "Cannot connect to Redis"
- **Check URL format**: Must start with `https://`
- **Verify token**: Should be a long string
- **Test connection**:
  ```bash
  curl https://us1-your-slug.upstash.io/ping \
    -H "Authorization: Bearer your-token"
  # Should return: {"result":"PONG"}
  ```

### "Sentry not receiving errors"
- **Check DSN format**: Must start with `https://` and end with project ID
- **Verify environment**: DSN must be in `NEXT_PUBLIC_` variable
- **Test manually**:
  ```typescript
  import { captureMessage } from '@/lib/sentry';
  await captureMessage('Test error');
  ```

### "Rate limiting not working"
- **Without Redis**: Still works with in-memory storage, but less reliable
- **Check middleware**: Should be file `middleware.ts` in project root
- **Verify deployment**: Check Vercel Functions logs for rate limit messages

---

## 📊 Monitoring Your Services

### Upstash Dashboard
- https://console.upstash.com/
- Check: Requests/day, Latency, Hit rate
- Alert at: 80% of free tier usage

### Sentry Dashboard
- https://sentry.io/
- Check: Error rate, Resolved errors, Performance
- Set up: Alert rule for >10 errors/min

### Vercel Dashboard
- https://vercel.com/dashboard
- Check: Bandwidth, Functions, Build time
- Monitor: Edge Network cache hit rate

---

## 💡 Tips

1. **Start with free tiers**: All services offer generous free tiers
2. **Monitor usage**: Set up alerts before hitting limits
3. **Upgrade gradually**: Only upgrade when you see sustained traffic
4. **Use staging environment**: Test config in Vercel Preview first

---

## 🎯 Next Steps

After setting up environment variables:

1. ✅ Verify all services are working
2. 📊 Set up monitoring alerts
3. 🚀 Deploy to production
4. 📈 Monitor for 24 hours
5. 🔧 Adjust based on real traffic

Read `SCALING.md` for complete implementation details.
