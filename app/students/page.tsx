import { Suspense } from "react";
import type { Metadata } from "next";

import { StudentsExplorer } from "@/components/site/students-explorer";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getAllActivePeers } from "@/lib/university-community";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Talk to Students Studying Abroad | Students Traffic",
  description:
    "Connect directly on WhatsApp with Indian students already studying MBBS abroad. Get honest answers on fees, hostel life, and daily experience — from peers, not agents.",
  path: "/students",
});

export default async function StudentsPage() {
  const peers = await getAllActivePeers();
  return (
    <Suspense>
      <StudentsExplorer peers={peers} />
    </Suspense>
  );
}
