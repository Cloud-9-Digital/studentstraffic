import { DashboardPage } from "@/components/dashboard/ui";

/** Skeleton shared by the guide pages: page header, optional stat cards, and list sections. */
export function GuideSkeleton({
  label,
  sections = [4],
  stats = 0,
  tabs = false,
  wide = false,
}: {
  label: string;
  sections?: number[];
  stats?: number;
  tabs?: boolean;
  wide?: boolean;
}) {
  return (
    <DashboardPage wide={wide}>
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-[#eceeee]" />
          <div className="h-4 w-80 max-w-full rounded bg-[#f0f1f1]" />
        </div>
        {stats > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: stats }, (_, i) => (
              <div key={i} className="h-[88px] rounded-xl border border-[#eaeaea] bg-white p-4">
                <div className="h-3 w-20 rounded bg-[#f0f1f1]" />
                <div className="mt-3 h-6 w-10 rounded bg-[#eceeee]" />
              </div>
            ))}
          </div>
        ) : null}
        {sections.map((rows, section) => (
          <div key={section} className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
            <div className="flex gap-4 border-b border-[#f0f0f0] px-5 py-4">
              {tabs && section === 0 ? (
                [0, 1, 2].map((t) => <div key={t} className="h-4 w-20 rounded bg-[#eceeee]" />)
              ) : (
                <div className="h-4 w-32 rounded bg-[#eceeee]" />
              )}
            </div>
            {Array.from({ length: rows }, (_, row) => (
              <div key={row} className="flex items-center gap-3 border-b border-[#f0f0f0] px-5 py-4 last:border-0">
                <div className="size-9 shrink-0 rounded-full bg-[#eceeee]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-[#eceeee]" />
                  <div className="h-3 w-2/3 rounded bg-[#f0f1f1]" />
                </div>
                <div className="hidden h-8 w-28 rounded-lg bg-[#f0f1f1] sm:block" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </DashboardPage>
  );
}
