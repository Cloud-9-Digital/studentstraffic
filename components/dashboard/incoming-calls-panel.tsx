"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, PhoneCall, Radio } from "lucide-react";

type IncomingPeerCallSummary = {
  id: string;
  callerName: string;
  universityName: string;
  createdAt: string | null;
  status: string;
};

export function IncomingCallsPanel({
  initialCalls,
}: {
  initialCalls: IncomingPeerCallSummary[];
}) {
  const [calls, setCalls] = useState(initialCalls);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refreshCalls() {
      setIsRefreshing(true);
      try {
        const response = await fetch("/api/peer-calls/incoming", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { calls?: IncomingPeerCallSummary[] };
        if (!cancelled && payload.calls) {
          setCalls(payload.calls);
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      }
    }

    const interval = window.setInterval(() => {
      void refreshCalls();
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0f1f1c]">
            <Radio className="size-4 text-[#0f3d37]" />
            Incoming calls
          </div>
          <p className="mt-1 text-xs text-[#6b7280]">
            Keep this page open to catch live student call requests.
          </p>
        </div>
        {isRefreshing ? <Loader2 className="size-4 animate-spin text-[#9ca3af]" /> : null}
      </div>

      {calls.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-[#e5e7eb] px-4 py-6 text-center">
          <PhoneCall className="mx-auto size-5 text-[#cbd5e1]" />
          <p className="mt-2 text-sm text-[#374151]">No live calls right now</p>
          <p className="mt-1 text-xs text-[#9ca3af]">New requests appear here automatically.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {calls.map((call) => (
            <div
              key={call.id}
              className="flex flex-col gap-3 rounded-lg border border-[#e5e7eb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#0f1f1c]">{call.callerName}</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">{call.universityName}</p>
              </div>
              <Link
                href={`/calls/${call.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-[#0f3d37] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#184a43]"
              >
                Join call
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
