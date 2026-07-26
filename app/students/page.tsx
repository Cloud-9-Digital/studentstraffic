import { Suspense } from "react";
import type { Metadata } from "next";

import { StudentsExplorer } from "@/components/site/students-explorer";
import { env } from "@/lib/env";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getAllActivePeers } from "@/lib/university-community";
import { auth } from "@/lib/auth";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Talk to Students Studying Abroad | Students Traffic",
  description:
    "Connect with students at listed universities for practical answers on fees, accommodation, campus life, and daily experience.",
  path: "/students",
});

export default async function StudentsPage() {
  const [peers, session] = await Promise.all([
    getAllActivePeers(),
    auth(),
  ]);
  return (
    <Suspense>
      <StudentsExplorer
        peers={peers}
        isLoggedIn={!!session?.user}
        voiceCallsEnabled={env.hasAgoraVoice}
      />
    </Suspense>
  );
}
