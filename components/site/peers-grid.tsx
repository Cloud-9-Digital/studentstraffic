import { getActivePeersForUniversity } from "@/lib/university-community";

import { StudentCard } from "./student-card";

export async function PeersGrid({
  universitySlug,
  cols = 1,
}: {
  universitySlug: string;
  universityName: string;
  cols?: 1 | 2 | 3;
}) {
  const peers = await getActivePeersForUniversity(universitySlug);

  if (peers.length === 0) return null;

  const gridClass = cols === 2
    ? "grid grid-cols-2 gap-3 items-stretch"
    : cols === 3
    ? "grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch"
    : "grid grid-cols-1 gap-2";

  return (
    <div className={gridClass}>
      {peers.map((peer) => (
        <StudentCard key={peer.id} peer={peer} />
      ))}
    </div>
  );
}
