import { DashboardPage } from "@/components/dashboard/ui";

/** Loading state for the messages pages: header, inbox list and (on desktop) an empty thread pane. */
export function ChatWorkspaceSkeleton() {
  const rows = [0, 1, 2, 3, 4];
  return (
    <DashboardPage wide>
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading chats">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-[#eceeee]" />
          <div className="h-4 w-80 max-w-full rounded bg-[#f0f1f1]" />
        </div>
        <div
          className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white lg:grid lg:grid-cols-[300px_minmax(0,1fr)]"
          style={{ minHeight: "min(74vh, 560px)" }}
        >
          <div className="lg:border-r lg:border-[#eaeaea]">
            <div className="border-b border-[#eaeaea] px-4 py-3.5">
              <div className="h-4 w-16 rounded bg-[#eceeee]" />
            </div>
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3 border-b border-[#f0f0f0] px-4 py-3.5 last:border-0">
                <div className="size-10 shrink-0 rounded-full bg-[#eceeee]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/2 rounded bg-[#eceeee]" />
                  <div className="h-3 w-3/4 rounded bg-[#f0f1f1]" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden flex-col lg:flex">
            <div className="flex items-center gap-3 border-b border-[#eaeaea] px-5 py-3">
              <div className="size-9 rounded-full bg-[#eceeee]" />
              <div className="h-4 w-40 rounded bg-[#eceeee]" />
            </div>
            <div className="flex-1 space-y-3 p-5">
              <div className="h-9 w-1/2 rounded-2xl bg-[#f3f4f6]" />
              <div className="ml-auto h-9 w-2/5 rounded-2xl bg-[#e6eeec]" />
              <div className="mx-auto h-6 w-48 rounded-full bg-[#edf5f2]" />
              <div className="h-9 w-1/3 rounded-2xl bg-[#f3f4f6]" />
            </div>
            <div className="border-t border-[#edf2f1] p-4">
              <div className="h-10 rounded-[20px] bg-[#f4f9f7]" />
            </div>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
