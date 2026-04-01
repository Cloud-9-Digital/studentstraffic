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
    <div className="grid grid-cols-1 gap-2">
      {peers.map((peer) => (
        <StudentCard key={peer.id} peer={peer} />
      ))}
    </div>
  );
}
