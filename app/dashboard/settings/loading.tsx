import { DashboardPage } from "@/components/dashboard/ui";

/** Settings skeleton: header and the three form sections. */
export default function SettingsLoading() {
  return (
    <DashboardPage>
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading settings">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-[#eceeee]" />
          <div className="h-4 w-64 max-w-full rounded bg-[#f0f1f1]" />
        </div>
        {[2, 3, 1].map((fields, section) => (
          <div key={section} className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
            <div className="border-b border-[#f0f0f0] px-5 py-4">
              <div className="h-4 w-32 rounded bg-[#eceeee]" />
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {Array.from({ length: fields }, (_, field) => (
                <div key={field} className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-[#f0f1f1]" />
                  <div className="h-11 rounded-lg bg-[#f3f4f4]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardPage>
  );
}
