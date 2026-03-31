export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid items-center gap-8 py-10 md:grid-cols-[1fr_auto] md:gap-12 md:py-14 lg:gap-16 lg:py-16">
            <div className="min-w-0 space-y-4">
              <div className="h-5 w-24 rounded-full bg-white/10" />
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
            <div className="h-[220px] w-full rounded-2xl bg-white/[0.07] md:h-[260px] md:w-[380px] lg:h-[300px] lg:w-[440px] shrink-0" />
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
