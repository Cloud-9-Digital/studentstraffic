export default function SearchLoading() {
  return (
    <section className="section-space">
      <div className="container-shell max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="h-10 w-48 rounded-2xl bg-muted animate-pulse" />
          <div className="h-5 w-80 rounded-full bg-muted/70 animate-pulse" />
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="h-12 rounded-xl bg-muted animate-pulse" />
          <div className="h-12 w-36 rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
