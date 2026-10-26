import { DashboardPage } from "@/components/dashboard/ui";

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[#eef0f2] ${className}`} />;
}

export default function ApplicationLoading() {
  return (
    <DashboardPage className="pb-8">
      <div role="status" aria-label="Loading application" className="space-y-6">
        <Bar className="h-4 w-28" />
        <div className="flex items-center gap-3">
          <Bar className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bar className="h-7 w-2/3" />
            <Bar className="h-4 w-1/2" />
          </div>
        </div>
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 rounded-xl border border-[#eaeaea] bg-white p-5">
            <Bar className="h-4 w-24" />
            <Bar className="h-5 w-full" />
            <Bar className="h-4 w-3/4" />
          </div>
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    </DashboardPage>
  );
}
