# Discovery Rollout Checklist

This project now exposes the main technical building blocks for organic discovery:

- `robots.txt` at `/robots.txt`
- complete root sitemap at `/sitemap.xml`
- `llms.txt` at `/llms.txt`
- page-level metadata and JSON-LD

Use this checklist after each production deploy.

## Search engines

- Set `NEXT_PUBLIC_SITE_URL` correctly in production so canonicals and sitemap URLs are absolute and correct.
- Verify the production domain in Google Search Console.
- Submit `/sitemap.xml` in Google Search Console.
- Verify the production domain in Bing Webmaster Tools.
- Submit `/sitemap.xml` in Bing Webmaster Tools.
- Monitor coverage, crawl, and enhancement reports for missing canonicals, soft 404s, and structured-data issues.

## AI search and agents

- Do not block `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, or `Claude-User` at the CDN, WAF, or firewall layer.
- If you are not on Vercel, review OpenAI ChatGPT Agent allowlisting at the CDN layer so signed agent requests are not challenged.
- Review whether you want to allow or block training crawlers such as `GPTBot`, `ClaudeBot`, and `Google-Extended`. That is a separate policy decision from search visibility.
- `llms.txt` is now available at `/llms.txt` with preferred route patterns and trust-page links.

## Submission helpers

- IndexNow ownership file is published at `/41c071d78fa6ee664777ef8ed5c6b312.txt`.
- First-run full submission: `npm run seo:indexnow -- --all`
- Ongoing changed-only submission: `npm run seo:indexnow`
- Manual changed URLs: `npm run seo:indexnow -- --url=/mbbs-in-vietnam --url=/universities/can-tho-university-medicine-pharmacy`
- Inspect the exact payload before submission with `npx tsx scripts/submit-indexnow.ts --dry-run`

## Content quality

- Replace placeholder imagery with real university logos, covers, and galleries because image sitemaps and structured data are only as strong as the underlying assets.
- Add or refresh “last updated” dates, recognition details, and admissions guidance on high-value landing pages.
- Prioritize pages that answer comparison, budget, eligibility, intake, and recognition intent.

## Measurement

- Track referrers such as `google`, `bing`, `chatgpt.com`, and `claude.ai`.
- Track lead conversion by landing page, not just click volume.
- Review server logs periodically to confirm expected crawlers receive `200` responses on key pages.
