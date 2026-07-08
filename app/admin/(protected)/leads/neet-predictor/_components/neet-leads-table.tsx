import { LeadActionsMenu } from "../../_components/leads-table";

type NeetLeadRow = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  userState: string | null;
  neetScore: number | null;
  neetCategory: string | null;
  createdAt: Date | null;
};

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const fmtTime = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
});

export function NeetLeadsTable({
  rows,
  hasActiveFilters,
  canDelete,
}: {
  rows: NeetLeadRow[];
  hasActiveFilters: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="w-56 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Student
                </th>
                <th className="w-56 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  State
                </th>
                <th className="w-28 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  NEET Score
                </th>
                <th className="w-28 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>
                <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5">
                    <div className="min-w-0">
                      <p className="font-medium text-[#0b312b]">{lead.fullName}</p>
                      <p className="mt-1 text-xs text-slate-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    <span className="text-xs">{lead.email || "—"}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    <span className="text-xs">{lead.userState || "—"}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-[#0b312b]">
                      {lead.neetScore ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    <span className="text-xs">{lead.neetCategory || "—"}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {lead.createdAt ? (
                      <>
                        <div>{fmtDate.format(lead.createdAt)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-300">
                          {fmtTime.format(lead.createdAt)}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <LeadActionsMenu
                      leadId={lead.id}
                      leadName={lead.fullName}
                      canDelete={canDelete}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    {hasActiveFilters
                      ? "No NEET predictor leads match your search."
                      : "No NEET predictor leads yet."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {rows.map((lead) => (
          <div key={lead.id} className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#0b312b]">{lead.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{lead.phone}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Score: {lead.neetScore ?? "—"}</span>
                  <span>•</span>
                  <span>{lead.neetCategory || "—"}</span>
                  {lead.userState ? (
                    <>
                      <span>•</span>
                      <span>{lead.userState}</span>
                    </>
                  ) : null}
                </div>
                {lead.createdAt ? (
                  <div className="mt-2 text-[11px] text-slate-400">
                    {fmtDate.format(lead.createdAt)} · {fmtTime.format(lead.createdAt)}
                  </div>
                ) : null}
              </div>

              <LeadActionsMenu leadId={lead.id} leadName={lead.fullName} canDelete={canDelete} />
            </div>
          </div>
        ))}

        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-400">
            {hasActiveFilters
              ? "No NEET predictor leads match your search."
              : "No NEET predictor leads yet."}
          </div>
        ) : null}
      </div>
    </div>
  );
}
