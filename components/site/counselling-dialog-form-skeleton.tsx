export function CounsellingDialogFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-14 rounded bg-muted/70" />
          <div className="h-11 rounded-xl bg-muted/70" />
        </div>
      </div>
      <div className="h-11 rounded-xl bg-muted/70" />
    </div>
  );
}
