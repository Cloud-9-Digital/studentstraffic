export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Masthead skeleton */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 py-10 md:flex-row md:items-end md:justify-between md:py-14">
            <div className="space-y-3">
              <div className="h-9 w-72 rounded-lg bg-white/10" />
              <div className="h-9 w-48 rounded-lg bg-white/10" />
            </div>
            <div className="h-4 w-48 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[16/9] bg-muted" />
              <div className="flex flex-col p-5 gap-3">
                <div className="h-4 w-20 rounded-full bg-muted" />
                <div className="h-5 w-full rounded bg-muted" />
                <div className="h-5 w-4/5 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/60" />
                <div className="h-3 w-3/4 rounded bg-muted/60" />
                <div className="mt-auto h-3 w-32 rounded bg-muted/40 pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
