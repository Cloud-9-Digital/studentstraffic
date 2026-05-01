export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-tr from-primary/10 via-background to-accent/5 pt-20 pb-28 md:pt-32 md:pb-40">
        <div className="container-shell flex flex-col items-center text-center">
          <div className="h-8 w-40 rounded-full bg-muted animate-pulse" />
          <div className="mt-8 h-16 w-full max-w-2xl rounded-3xl bg-muted animate-pulse" />
          <div className="mt-6 h-6 w-full max-w-3xl rounded-full bg-muted/70 animate-pulse" />
          <div className="mt-10 flex gap-4">
            <div className="h-12 w-44 rounded-xl bg-muted animate-pulse" />
            <div className="h-12 w-40 rounded-xl bg-muted/70 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-3xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
