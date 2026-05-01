export default function CountryDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="container-shell py-12 md:py-16">
          <div className="space-y-5">
            <div className="h-4 w-44 rounded-full bg-white/10 animate-pulse" />
            <div className="h-16 w-full max-w-2xl rounded-3xl bg-white/10 animate-pulse" />
            <div className="h-6 w-full max-w-3xl rounded-full bg-white/[0.08] animate-pulse" />
            <div className="flex gap-3">
              <div className="h-12 w-44 rounded-xl bg-white/10 animate-pulse" />
              <div className="h-12 w-40 rounded-xl bg-white/[0.08] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell py-10 md:py-14">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-56 rounded-3xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
