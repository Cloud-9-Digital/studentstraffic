# Environment Variables Reference

Complete list of all environment variables used in the application.

## 📋 Quick Reference Table

| Variable | Service | Required | Default | Where Used |
|----------|---------|----------|---------|------------|
| `DATABASE_URL` | Neon | ✅ Yes | - | Database connection |
| `NEXT_PUBLIC_SITE_URL` | App | ✅ Yes | `http://localhost:3000` | Canonical URLs |
| `REVALIDATE_SECRET` | App | ✅ Yes | - | Cache invalidation |
| `UPSTASH_REDIS_REST_URL` | Upstash | ⚠️ Optional* | - | Rate limiting, caching |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | ⚠️ Optional* | - | Rate limiting, caching |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry | ⚠️ Optional | - | Error tracking |
| `NEXT_PUBLIC_AGORA_APP_ID` | Agora | ⚠️ Optional | - | Browser/mobile voice calls |
| `AGORA_APP_CERTIFICATE` | Agora | ⚠️ Optional | - | Server-side Agora token minting |
| `SENTRY_ORG` | Sentry | ⚠️ Optional | - | Source map uploads |
| `SENTRY_PROJECT` | Sentry | ⚠️ Optional | - | Source map uploads |
| `SENTRY_AUTH_TOKEN` | Sentry | ❌ No | - | Source map uploads |
| `CRON_SECRET` | Vercel | ❌ No | - | Cron job auth |

*Optional but highly recommended for production

---

## 🔑 Core Variables

### DATABASE_URL
```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Purpose**: PostgreSQL database connection string

**Required**: Yes

**Format**:
- Use Neon's **pooled** connection string (includes `-pooler` in hostname)
- Must include `?sslmode=require` for security

**Example**:
```bash
DATABASE_URL=postgresql://user:pass@ep-example-pooler.region.aws.neon.tech/studentstraffic?sslmode=require
```

**Where to get it**:
1. Go to Neon dashboard
2. Select your project
3. Copy "Pooled connection" string

---

### NEXT_PUBLIC_SITE_URL
```bash
NEXT_PUBLIC_SITE_URL=https://studentstraffic.com
```

**Purpose**: Base URL for canonical links, OG tags, sitemaps

**Required**: Yes (Production), Optional (Development)

**Default**: `http://localhost:3000` (development)

**Format**: Full URL without trailing slash

**Examples**:
```bash
# Production
NEXT_PUBLIC_SITE_URL=https://studentstraffic.com

# Staging
NEXT_PUBLIC_SITE_URL=https://staging.studentstraffic.com

# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where it's used**:
- SEO canonical URLs
- Open Graph tags
- Sitemap generation
- Email templates

---

### REVALIDATE_SECRET
```bash
REVALIDATE_SECRET=your-random-secret-here
```

**Purpose**: Secure cache invalidation API endpoint

**Required**: Yes

**Format**: Strong random string (min 32 characters)

**Generate**:
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Where it's used**:
- `/api/revalidate` - Cache invalidation
- `/api/cache/invalidate` - Redis cache invalidation
- `/api/jobs/process` - Background job processing

---

## 🚀 Scaling Infrastructure

### UPSTASH_REDIS_REST_URL
```bash
UPSTASH_REDIS_REST_URL=https://region-name-12345.upstash.io
```

**Purpose**: Redis REST API endpoint for rate limiting and caching

**Required**: Optional (falls back to in-memory)

**Recommended**: Yes for production

**Format**: Full HTTPS URL from Upstash dashboard

**Where to get it**:
1. Go to https://console.upstash.com/
2. Create database
3. Copy "REST URL" from "REST API" tab

**Where it's used**:
- Rate limiting (middleware)
- Search result caching
- Session storage

---

### UPSTASH_REDIS_REST_TOKEN
```bash
UPSTASH_REDIS_REST_TOKEN=your-long-token-here
```

**Purpose**: Authentication token for Upstash Redis

**Required**: Optional (must be set if URL is set)

**Format**: Long alphanumeric string from Upstash

**Where to get it**:
1. Same location as REST URL
2. Copy "REST TOKEN" from dashboard

**Security**: Keep secret, never commit to git

---

## 🔍 Error Tracking

### NEXT_PUBLIC_SENTRY_DSN
```bash
NEXT_PUBLIC_SENTRY_DSN=https://key@org-id.ingest.sentry.io/project-id
```

**Purpose**: Sentry Data Source Name for error tracking

**Required**: Optional (errors won't be tracked without it)

**Recommended**: Yes for production

**Format**: Full DSN URL from Sentry

**Where to get it**:
1. Go to https://sentry.io/
2. Create/select project
3. Copy DSN from project settings

**Where it's used**:
- Client-side error tracking
- Server-side error tracking
- Edge runtime error tracking

---

## 📞 Voice Calling

### NEXT_PUBLIC_AGORA_APP_ID
```bash
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
```

**Purpose**: Public Agora application identifier used by the web client when joining voice calls.

**Required**: Optional overall, but required if you want in-app voice calling enabled.

**Where it's used**:
- `/calls/[callId]` voice room
- Agora web client initialization

---

### AGORA_APP_CERTIFICATE
```bash
AGORA_APP_CERTIFICATE=your-agora-app-certificate
```

**Purpose**: Private Agora certificate used only on the server to generate RTC tokens.

**Required**: Optional overall, but required together with `NEXT_PUBLIC_AGORA_APP_ID` for voice calling.

**Security**: Keep secret, never expose it in browser code.

**Where it's used**:
- `/api/peer-calls/[callId]/token`

---

### SENTRY_ORG
```bash
SENTRY_ORG=your-org-slug
```

**Purpose**: Sentry organization slug for builds

**Required**: Optional (needed for source maps)

**Format**: Organization slug from Sentry URL

**Example**:
```bash
# If your Sentry URL is:
# https://your-org.sentry.io/
# Then:
SENTRY_ORG=your-org
```

---

### SENTRY_PROJECT
```bash
SENTRY_PROJECT=your-project-slug
```

**Purpose**: Sentry project slug for builds

**Required**: Optional (needed for source maps)

**Format**: Project slug from Sentry URL

**Example**:
```bash
# If your project URL is:
# https://org.sentry.io/projects/my-project/
# Then:
SENTRY_PROJECT=my-project
```

---

### SENTRY_AUTH_TOKEN
```bash
SENTRY_AUTH_TOKEN=sntrys_your_token_here
```

**Purpose**: Authentication for uploading source maps

**Required**: No (source maps won't upload without it)

**Format**: Auth token from Sentry

**Where to get it**:
1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Create new token
3. Scopes: `project:releases`, `project:write`

**Security**: Keep secret, add to Vercel only (not .env.local)

---

## ⚙️ Optional Variables

### CRON_SECRET
```bash
CRON_SECRET=your-cron-secret
```

**Purpose**: Authenticate Vercel cron jobs

**Required**: No (falls back to REVALIDATE_SECRET)

**Format**: Random secret string

**Where it's used**:
- `/api/jobs/process` - Background job processing

---

### LOG_DB_SLOW_QUERIES
```bash
LOG_DB_SLOW_QUERIES=1
```

**Purpose**: Enable slow query logging in development

**Required**: No

**Default**: `0` (disabled in dev, always on in production)

**Format**: `0` or `1`

**When to use**: Debugging slow database queries locally

---

### LOG_DB_QUERIES
```bash
LOG_DB_QUERIES=1
```

**Purpose**: Print every successful database request with timing and a shortened query summary

**Required**: No

**Default**: `0` (disabled)

**When to use**: Short, focused database diagnostics only. Keep disabled during builds and normal production traffic.

---

### ENABLE_INLINE_JOB_PROCESSING
```bash
ENABLE_INLINE_JOB_PROCESSING=1
```

**Purpose**: Process background jobs inline (for development)

**Required**: No

**Default**: `0`

**Format**: `0` or `1`

**When to use**: Testing background jobs without cron

**Warning**: Never enable in production!

---

## 🔒 Security Best Practices

### Secrets Management

✅ **DO**:
- Use strong random secrets (min 32 characters)
- Store secrets in Vercel environment variables
- Use different secrets for different environments
- Rotate secrets periodically

❌ **DON'T**:
- Commit secrets to git
- Share secrets in plain text
- Use weak/predictable secrets
- Reuse secrets across services

### Environment-Specific Values

**Development** (`.env.local`):
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost/dev_db
ENABLE_INLINE_JOB_PROCESSING=1
```

**Staging** (Vercel):
```bash
NEXT_PUBLIC_SITE_URL=https://staging.studentstraffic.com
DATABASE_URL=postgresql://staging-db-url
ENABLE_INLINE_JOB_PROCESSING=0
```

**Production** (Vercel):
```bash
NEXT_PUBLIC_SITE_URL=https://studentstraffic.com
DATABASE_URL=postgresql://production-db-url
ENABLE_INLINE_JOB_PROCESSING=0
```

---

## 📦 Variable Groups

### Minimal Setup (Development)
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_SECRET=dev-secret-12345
```

### Production Setup (Recommended)
```bash
# Core
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://studentstraffic.com
REVALIDATE_SECRET=strong-random-secret

# Scaling
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=token...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...sentry.io/...
SENTRY_ORG=org-name
SENTRY_PROJECT=project-name
```

### Full Setup (Production with Source Maps)
```bash
# All production variables above, plus:
SENTRY_AUTH_TOKEN=sntrys_token...
CRON_SECRET=cron-specific-secret
```

---

## 🧪 Testing Variables

To test if variables are set correctly:

```bash
# Check in terminal
echo $NEXT_PUBLIC_SENTRY_DSN

# Check in app (add temporarily)
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
console.log('Has Redis:', !!process.env.UPSTASH_REDIS_REST_URL);
```

In Next.js API route:
```typescript
export async function GET() {
  return Response.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasRedis: !!process.env.UPSTASH_REDIS_REST_URL,
    hasSentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
```

---

## 🔄 Migration Guide

### From .env to .env.local
```bash
# Copy your .env file
cp .env .env.local

# Add new variables
echo "UPSTASH_REDIS_REST_URL=..." >> .env.local
echo "UPSTASH_REDIS_REST_TOKEN=..." >> .env.local
```

### Adding to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Pull current env vars
vercel env pull

# Add new variable
vercel env add UPSTASH_REDIS_REST_URL production

# Push changes
vercel --prod
```

---

## 📊 Variable Priority

Next.js loads environment variables in this order (later overrides earlier):

1. `.env` - Defaults for all environments
2. `.env.local` - Local overrides (gitignored)
3. `.env.production` - Production defaults
4. `.env.production.local` - Local production overrides
5. Vercel Environment Variables - Platform overrides

**Recommendation**: Use `.env.local` for development, Vercel dashboard for production

---

## 🎯 Quick Checklist

Before deploying:

- [ ] `DATABASE_URL` is set (pooled connection)
- [ ] `NEXT_PUBLIC_SITE_URL` is correct
- [ ] `REVALIDATE_SECRET` is strong (32+ chars)
- [ ] `UPSTASH_REDIS_REST_URL` is set
- [ ] `UPSTASH_REDIS_REST_TOKEN` is set
- [ ] `NEXT_PUBLIC_SENTRY_DSN` is set
- [ ] `SENTRY_ORG` matches your org
- [ ] `SENTRY_PROJECT` matches your project
- [ ] No secrets committed to git
- [ ] All vars added to Vercel for all environments

---

## 🔗 Related Documentation

- [Environment Setup Guide](../getting-started/environment-setup.md)
- [Deployment Checklist](../getting-started/deployment.md)
- [Sentry Setup](../features/error-tracking.md)
- [Rate Limiting](../features/rate-limiting.md)

---

**Last Updated**: May 2026
