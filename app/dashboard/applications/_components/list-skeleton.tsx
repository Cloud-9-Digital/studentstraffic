import { DashboardPage } from "@/components/dashboard/ui";

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[#eef0f2] ${className}`} />;
}

/** Skeleton matching PageHeader + a flush Section of rows, used by the list pages' loading.tsx. */
export function ListPageSkeleton({ rows = 4, label }: { rows?: number; label: string }) {
  return (
    <DashboardPage className="pb-8">
      <div role="status" aria-label={label} className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Bar className="h-7 w-40" />
            <Bar className="h-4 w-56" />
          </div>
          <Bar className="h-9 w-44 rounded-lg" />
        </div>
        <div className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
          <ul className="divide-y divide-[#f0f0f0]">
            {Array.from({ length: rows }, (_, index) => (
              <li key={index} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <Bar className="size-12 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Bar className="h-4 w-3/5" />
                    <Bar className="h-3 w-2/5" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Bar className="h-9 flex-1 rounded-lg sm:w-36 sm:flex-none" />
                  <Bar className="h-9 flex-1 rounded-lg sm:w-16 sm:flex-none" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </DashboardPage>
  );
}
