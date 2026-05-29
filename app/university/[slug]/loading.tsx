export default function UniversityDetailLoading() {
  return (
    <div className="container-shell py-10 md:py-14">
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
