import { Users } from "lucide-react";

import { PeerRequestForm } from "@/components/site/peer-request-form";
import { getUniversityPeerAvailability } from "@/lib/university-community";

export async function UniversityPeerSection({
  universitySlug,
  universityName,
}: {
  universitySlug: string;
  universityName: string;
}) {
  const availability = await getUniversityPeerAvailability(universitySlug);

  return (
    <div id="talk-to-peers" className="deferred-render py-10">
      <div className="rounded-[1.75rem] bg-accent p-6 sm:p-8">

        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <Users className="size-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Talk to a student at {universityName}
              </h2>
              {availability.hasPeers ? (
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/90">
                  <span className="size-1.5 animate-pulse rounded-full bg-white" />
                  Available
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-white/70">
              Get honest answers about academics, hostel life, and daily experience before you decide.
            </p>
          </div>
        </div>

        <PeerRequestForm
          sourcePath={`/universities/${universitySlug}`}
          universitySlug={universitySlug}
          universityName={universityName}
        />

      </div>
    </div>
  );
}
