# CTA Conversion Status - Contact Links to Dialogs

> Reviewed July 2026. This document is an active backlog for CTA conversion work. The original May 2026 completion notes below are retained as history.

## ✅ Completed

### Components Created
1. **CounsellingCtaButton** - Reusable client component for triggering lead capture dialogs
   - Location: `components/site/counselling-cta-button.tsx`
   - Props: label, title, description, className, countrySlug, courseSlug, ctaVariant
   - Usage: Drop-in replacement for contact page links

### Pages Fully Updated

#### Russia SEO Pages (StudyAbroadGuidePage)
- ✅ `/lowest-mbbs-fees-in-russia`
- ✅ `/mbbs-admission-in-russia`
- ✅ `/mbbs-from-russia-valid-in-india`
- ✅ `/mbbs-in-russia-duration`
- ✅ `/mbbs-in-russia-eligibility-for-indian-students`
- ✅ `/mbbs-in-russia-fees-in-rupees`
- ✅ `/mbbs-in-russia-with-scholarship`
- ✅ `/top-mbbs-colleges-in-russia`

#### Custom Layout Pages
- ✅ `/disadvantages-of-studying-mbbs-in-russia`
- ✅ `/is-mbbs-in-russia-worth-it`

**Changes:**
- Removed `secondaryHref` prop from StudyAbroadGuidePage
- Main hero CTA triggers CounsellingDialog instead of navigating
- Dialog pre-filled with page context (countrySlug, courseSlug)
- Custom title/description for each page

## 🔄 Remaining Pages (Need Manual Update)

### Current remaining commercial/listing work
The following still contain primary `/contact` links and should be reviewed:

1. `/free-mbbs-in-abroad-for-indian-students`
2. `/cities`
3. `/compare`

### Listing/Comparison Pages
These may need different treatment:

1. `/cities/page.tsx` — city listing context
2. `/compare/page.tsx` — university comparison context

### Static/Informational Pages
These can keep /contact links (not primary CTAs):

1. `/editorial-policy/page.tsx` (line 313)
   - Context: Footer/informational link
   - Action: Keep as-is (not a CTA)

## 📋 Action Plan for Remaining Pages

### Step 1: Update Vietnam Commercial Pages
Pattern to follow (similar to Russia pages):

```tsx
import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";

// Replace:
<Link href="/contact">Get help</Link>

// With:
<CounsellingCtaButton
  label="Get help"
  title="MBBS in Vietnam Counselling"
  description="Context-specific description here"
  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
  countrySlug="vietnam"
  courseSlug="mbbs"
  ctaVariant="page-specific-variant"
/>
```

Files:
- `app/disadvantages-of-studying-mbbs-in-vietnam/page.tsx`
- `app/is-neet-required-for-mbbs-in-vietnam/page.tsx`
- `app/is-mbbs-in-vietnam-good-for-indian-students/page.tsx`
- `app/is-mbbs-in-vietnam-valid-in-india/page.tsx`
- `app/is-neet-required-for-mbbs-in-russia/page.tsx`
- `app/free-mbbs-in-abroad-for-indian-students/page.tsx`

### Step 2: Update Listing Pages

#### Cities Page
```tsx
// Current:
<Link href="/contact">Browse cities</Link>

// Update to:
<CounsellingCtaButton
  label="Browse cities"
  title="Find the Right City for Your MBBS"
  description="Tell us your preferences and we'll recommend cities that match your lifestyle and budget."
  ctaVariant="cities-listing"
/>
```

#### Compare Page
```tsx
// Current:
<Link href="/contact">Submit your details</Link>

// Update to:
<CounsellingCtaButton
  label="Get comparison help"
  title="Compare Universities With Expert Guidance"
  description="Share which universities you're comparing and we'll help you make the right choice."
  ctaVariant="compare-tool"
/>
```

#### Country Dynamic Page
Needs server-side country slug passed to client component:

```tsx
// In page.tsx (server component):
<ClientCta countrySlug={params.slug} />

// In new client component:
"use client";
export function ClientCta({ countrySlug }: { countrySlug: string }) {
  return (
    <CounsellingCtaButton
      label="Talk to our team"
      title={`MBBS in ${countryName} - Get Expert Guidance`}
      description="..."
      countrySlug={countrySlug}
      ctaVariant="country-page"
    />
  );
}
```

## 🎯 Benefits of This Conversion

### User Experience
- ✅ No page navigation (stay in context)
- ✅ Instant form popup (faster)
- ✅ Mobile-friendly modal
- ✅ Reduced friction

### Conversion Optimization
- ✅ Higher completion rates (no page load)
- ✅ Better tracking (ctaVariant shows source)
- ✅ Context preservation (user doesn't lose place)
- ✅ Lower bounce rate

### Developer Experience
- ✅ Reusable component (CounsellingCtaButton)
- ✅ Consistent behavior
- ✅ Easy to update
- ✅ Type-safe props

## 📊 Impact

### Before
- 20 pages redirecting to `/contact`
- Average conversion: ~2-3% (assumed)
- Page navigation required
- Context loss on mobile

### After
- 10 pages converted (50%)
- Expected conversion: ~4-6% (2x improvement typical for inline forms)
- Instant dialog
- Context preserved

### Current status
- Most Vietnam/Russia commercial pages listed in the original report are now converted.
- Three primary CTA locations remain to review: one general page and two listing/tool pages.
- `/editorial-policy` remains informational and should keep its `/contact` link.

## 🔧 Technical Details

### Import Required
```tsx
import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";
```

### Props Interface
```tsx
type CounsellingCtaButtonProps = {
  label: string;                    // Button text
  title?: string;                   // Dialog title
  description?: string;             // Dialog description
  className?: string;               // Button styling
  countrySlug?: string;             // For tracking
  courseSlug?: string;              // For tracking
  ctaVariant?: string;              // For analytics
};
```

### CTA Variant Naming Convention
Format: `{page-type}-{section}`

Examples:
- `seo-guide-hero` - Hero CTA on SEO guide pages
- `disadvantages-hero` - Hero on disadvantages pages
- `worth-it-hero` - Hero on "worth it" pages
- `cities-listing` - CTA on cities listing page
- `compare-tool` - CTA in comparison tool
- `country-page` - CTA on country overview pages

This helps track which CTAs perform best in analytics.

## ✅ Next Steps

1. **Immediate:** Update remaining 6 Vietnam/Russia commercial pages
2. **Soon:** Update 3 listing pages with custom implementations
3. **Later:** Monitor conversion rate improvements
4. **Future:** Apply same pattern to other high-traffic pages

## 📝 Notes

- All CTAs maintain their visual design (className preserved)
- Server components passing to client components need wrapper pattern
- ctaVariant helps track performance by page type
- Keep `/contact` page for organic traffic and direct visits
- Dialog still submits to same lead capture endpoint
