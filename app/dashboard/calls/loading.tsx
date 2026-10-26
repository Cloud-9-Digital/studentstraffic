import { DashboardPage } from "@/components/dashboard/ui";

/** Loading state for My Calls: header, booked guides card and the call log grouped by day. */
export default function CallsLoading() {
  return (
    <DashboardPage wide>
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading calls">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-lg bg-[#eceeee]" />
          <div className="h-4 w-80 max-w-full rounded bg-[#f0f1f1]" />
        </div>
        {[2, 5].map((count, section) => (
          <div key={section} className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
            <div className="border-b border-[#f0f0f0] px-5 py-4">
              <div className="h-4 w-28 rounded bg-[#eceeee]" />
            </div>
            {section === 1 && <div className="h-7 border-b border-[#f0f0f0] bg-[#fafafa]" />}
            {Array.from({ length: count }, (_, row) => (
              <div key={row} className="flex items-center gap-3 border-b border-[#f0f0f0] px-5 py-4 last:border-0">
                <div className="size-9 shrink-0 rounded-full bg-[#eceeee]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-[#eceeee]" />
                  <div className="h-3 w-1/2 rounded bg-[#f0f1f1]" />
                </div>
                <div className="hidden h-8 w-24 rounded-lg bg-[#f0f1f1] sm:block" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </DashboardPage>
  );
}
