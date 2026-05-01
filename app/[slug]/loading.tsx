export default function LandingGuideLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-dark pt-12 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
        <div className="container-shell">
          <div className="space-y-5">
            <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-16 w-full max-w-3xl rounded-3xl bg-white/10 animate-pulse" />
            <div className="h-6 w-full max-w-2xl rounded-full bg-white/[0.08] animate-pulse" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 rounded-2xl bg-white/[0.08] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-10 md:py-14">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-60 rounded-3xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
