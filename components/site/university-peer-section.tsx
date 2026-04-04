import { Suspense } from "react";
import { Users } from "lucide-react";

import { PeerRequestForm } from "@/components/site/peer-request-form";
import { PeersGrid } from "@/components/site/peers-grid";
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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid md:grid-cols-[5fr_6fr] md:items-stretch">

        {/* Left — student list */}
        <div className="flex flex-col border-b border-border bg-muted/20 p-5 md:border-b-0 md:border-r">
          <div className="mb-1 flex items-center gap-2">
            <Users className="size-4 text-accent" />
            <p className="text-sm font-semibold text-foreground">
              Talk to a student
            </p>
          </div>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            These students studied here and can answer your real questions about academics, hostel life, and daily experience.
          </p>
          {availability.hasPeers ? (
            <div className="flex-1 overflow-y-auto min-h-0">
              <Suspense fallback={null}>
                <PeersGrid
                  universitySlug={universitySlug}
                  universityName={universityName}
                  cols={2}
                />
              </Suspense>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No student contacts listed yet for this university.
            </p>
          )}
        </div>

        {/* Right — request form */}
        <div className="p-5 flex flex-col justify-center">
          <p className="mb-4 text-sm font-semibold text-foreground">
            Request a student conversation
          </p>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Share your details and we&apos;ll match you with a registered student who can answer your questions directly.
          </p>
          <PeerRequestForm
            sourcePath={`/universities/${universitySlug}`}
            universitySlug={universitySlug}
            universityName={universityName}
          />
        </div>

      </div>
    </div>
  );
}
