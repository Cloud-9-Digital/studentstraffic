"use client";

import { useState, useTransition } from "react";
import { Loader2, PhoneCall, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

import { startPeerCallAction } from "@/app/_actions/start-peer-call";

export function StartPeerCallCard({
  peer,
}: {
  peer: {
    id: number;
    fullName: string;
    universityName: string;
    universitySlug: string;
    courseName: string | null;
    currentYearOrBatch: string | null;
    canReceiveCalls: boolean;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const firstName = peer.fullName.split(" ")[0] || peer.fullName;

  function handleStartCall() {
    startTransition(async () => {
      setError(null);
      const result = await startPeerCallAction(peer.id, peer.universitySlug);

      if (result.callId) {
        router.push(`/calls/${result.callId}`);
        router.refresh();
        return;
      }

      setError(result.error ?? "Unable to start the call right now.");
    });
  }

  return (
    <section className="rounded-2xl border border-[#cfe7e2] bg-[#f5fbf9] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f3d37]">
            <Radio className="size-3.5" />
            Voice call from dashboard
          </div>
          <h2 className="mt-3 text-lg font-semibold text-[#0f1f1c]">{peer.fullName}</h2>
          <p className="mt-1 text-sm text-[#4b5563]">{peer.universityName}</p>
          <p className="mt-1 text-xs text-[#6b7280]">
            {[peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ") || "Student guide"}
          </p>
          <p className="mt-3 text-sm text-[#4b5563]">
            Start the secure in-app call here when you are ready. {firstName} can answer from their guide dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCall}
          disabled={isPending || !peer.canReceiveCalls}
          className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-4" />}
          {isPending ? "Starting call..." : "Start voice call"}
        </button>
      </div>

      {!peer.canReceiveCalls ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This student has not enabled dashboard calling yet.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
