import { notFound, redirect } from "next/navigation";

import { AgoraVoiceRoom } from "@/components/site/agora-voice-room";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { getAuthorizedPeerCallSession } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export default async function PeerCallPage({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  if (!env.hasAgoraVoice) {
    notFound();
  }

  const session = await auth();
  const { callId } = await params;

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/calls/${callId}`)}`);
  }

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/calls/${callId}`)}`);
  }

  const call = await getAuthorizedPeerCallSession(callId, userId);
  if (!call) {
    notFound();
  }

  const counterpartName = call.isPeerParticipant ? call.callerName?.trim() || "the student" : call.peerName;
  const backHref = call.isPeerParticipant ? "/dashboard/peer" : `/dashboard?peer=${call.peerId}`;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{call.universityName}</p>
          <h2 className="text-3xl font-semibold text-foreground">
            {call.isPeerParticipant ? "Incoming student call" : `Call ${counterpartName}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {call.isPeerParticipant
              ? `${counterpartName} is trying to reach you through Students Traffic.`
              : `You are joining a secure in-app call with ${counterpartName}.`}
          </p>
        </div>

        <AgoraVoiceRoom
          callId={call.id}
          title={counterpartName}
          subtitle={call.universityName}
          backHref={backHref}
        />
      </div>
    </main>
  );
}
