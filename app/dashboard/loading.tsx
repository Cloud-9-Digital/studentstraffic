import { DashboardPage } from "@/components/dashboard/ui";

/** Generic dashboard skeleton: header, a row of stat cards and a list card. */
export default function DashboardLoading() {
  return (
    <DashboardPage>
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-[#eceeee]" />
          <div className="h-4 w-72 max-w-full rounded bg-[#f0f1f1]" />
        </div>
        <div className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
          <div className="border-b border-[#f0f0f0] px-5 py-4">
            <div className="h-4 w-24 rounded bg-[#eceeee]" />
          </div>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-4 border-b border-[#f0f0f0] px-5 py-4 last:border-0">
              <div className="size-9 shrink-0 rounded-lg bg-[#eceeee]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-[#eceeee]" />
                <div className="h-3 w-1/2 rounded bg-[#f0f1f1]" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((card) => (
            <div key={card} className="h-[92px] rounded-xl border border-[#eaeaea] bg-white p-4">
              <div className="h-3 w-20 rounded bg-[#f0f1f1]" />
              <div className="mt-3 h-6 w-10 rounded bg-[#eceeee]" />
            </div>
          ))}
        </div>
      </div>
    </DashboardPage>
  );
}
