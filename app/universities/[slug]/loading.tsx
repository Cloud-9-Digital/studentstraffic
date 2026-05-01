export default function UniversityDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="container-shell py-12 md:py-16">
          <div className="space-y-4">
            <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-12 w-full max-w-3xl rounded-2xl bg-white/10 animate-pulse" />
            <div className="h-6 w-full max-w-2xl rounded-full bg-white/[0.08] animate-pulse" />
            <div className="h-11 w-48 rounded-xl bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container-shell py-10 md:py-14">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-3xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
