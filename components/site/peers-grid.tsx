import { getActivePeersForUniversity } from "@/lib/university-community";

import { StudentCard } from "./student-card";

export async function PeersGrid({
  universitySlug,
}: {
  universitySlug: string;
  universityName: string;
}) {
  const peers = await getActivePeersForUniversity(universitySlug);

  if (peers.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-medium text-white/80">
        Choose a student to talk to
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {peers.map((peer) => (
          <StudentCard key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
}
