export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />

        {/* Mobile: cover image skeleton */}
        <div className="md:hidden px-5 sm:px-6 pt-6">
          <div className="aspect-[16/9] rounded-2xl bg-white/[0.07]" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-8 py-10 md:grid-cols-[1fr_auto] md:gap-12 md:py-14 lg:gap-16 lg:py-16">
            {/* Text skeleton */}
            <div className="min-w-0 space-y-4">
              <div className="space-y-3">
                <div className="h-8 w-full rounded-lg bg-white/10" />
                <div className="h-8 w-4/5 rounded-lg bg-white/10" />
                <div className="h-8 w-3/5 rounded-lg bg-white/10" />
              </div>
              <div className="h-4 w-full rounded bg-white/[0.06]" />
              <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
              <div className="flex gap-4 pt-2">
                <div className="h-3 w-28 rounded bg-white/[0.06]" />
                <div className="h-3 w-20 rounded bg-white/[0.06]" />
              </div>
            </div>

            {/* Desktop: right-side image skeleton */}
            <div className="hidden md:block w-[380px] lg:w-[440px] shrink-0 self-start">
              <div className="aspect-[16/9] rounded-2xl bg-white/[0.07]" />
            </div>
          </div>
        </div>
      </div>

      {/* Article skeleton */}
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-24 md:px-6 space-y-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-11/12 rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="mt-6 h-4 w-full rounded bg-muted" />
        <div className="h-4 w-11/12 rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
