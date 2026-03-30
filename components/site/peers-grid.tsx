import { getActivePeersForUniversity } from "@/lib/university-community";

import { PeerCard } from "./peer-card";

export async function PeersGrid({
  universitySlug,
  universityName,
}: {
  universitySlug: string;
  universityName: string;
}) {
  const peers = await getActivePeersForUniversity(universitySlug);

  if (peers.length === 0) return null;

  const sourcePath = `/universities/${universitySlug}`;

  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-medium text-white/80">
        Choose a student to talk to
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {peers.map((peer) => (
          <PeerCard
            key={peer.id}
            peer={peer}
            universitySlug={universitySlug}
            universityName={universityName}
            sourcePath={sourcePath}
          />
        ))}
      </div>
    </div>
  );
}
