"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import { Loader2, Mic, MicOff, PhoneOff, Radio, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const JOIN_TIMEOUT_MS = 15_000;

type AgoraJoinPayload = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  call: {
    id: string;
    status: string;
    peerName: string;
    callerName: string | null;
    universityName: string;
    isPeerParticipant: boolean;
  };
};

export function AgoraVoiceRoom({
  callId,
  title,
  subtitle,
  backHref,
}: {
  callId: string;
  title: string;
  subtitle: string;
  backHref: string;
}) {
  const router = useRouter();
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const remoteTracksRef = useRef<Map<string, IRemoteAudioTrack>>(new Map());
  const mountedRef = useRef(true);

  const [isJoining, setIsJoining] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteCount, setRemoteCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Connecting to the call room...");

  useEffect(() => {
    mountedRef.current = true;

    let cancelled = false;

    async function joinCall() {
      try {
        setIsJoining(true);
        setError(null);
        setStatus("Preparing your secure audio room...");

        const tokenResponse = await fetch(`/api/peer-calls/${callId}/token`, {
          method: "POST",
        });

        const payload = (await tokenResponse.json()) as AgoraJoinPayload | { error?: string };

        if (!tokenResponse.ok || !("appId" in payload)) {
          const message = "error" in payload ? payload.error : undefined;
          throw new Error(message || "Unable to start the call.");
        }

        if (cancelled) return;

        setStatus(payload.call.isPeerParticipant ? "Joining as the student guide..." : "Calling now...");

        const agoraModule = await import("agora-rtc-sdk-ng");
        const AgoraRTC = agoraModule.default;

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "audio" && user.audioTrack) {
            remoteTracksRef.current.set(user.uid.toString(), user.audioTrack);
            user.audioTrack.play();
            if (!cancelled && mountedRef.current) {
              setRemoteCount(remoteTracksRef.current.size);
              setStatus("Call connected");
            }
          }
        });

        client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType) => {
          if (mediaType === "audio") {
            remoteTracksRef.current.delete(user.uid.toString());
            if (mountedRef.current) {
              setRemoteCount(remoteTracksRef.current.size);
              setStatus("The other participant left the call.");
            }
          }
        });

        client.on("user-left", (user: IAgoraRTCRemoteUser) => {
          remoteTracksRef.current.delete(user.uid.toString());
          if (mountedRef.current) {
            setRemoteCount(remoteTracksRef.current.size);
            setStatus("The other participant left the call.");
          }
        });

        client.on("connection-state-change", (currentState) => {
          if (!mountedRef.current) return;
          if (currentState === "CONNECTED") {
            setStatus(remoteTracksRef.current.size > 0 ? "Call connected" : "Waiting for the other participant...");
          }
          if (currentState === "DISCONNECTED") {
            setStatus("Connection lost. Reconnect or rejoin the call.");
          }
        });

        await Promise.race([
          client.join(payload.appId, payload.channelName, payload.token, payload.uid),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Connection timed out — check your network and try again.")),
              JOIN_TIMEOUT_MS
            )
          ),
        ]);

        const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTrackRef.current = localTrack;
        await client.publish([localTrack]);

        if (!cancelled && mountedRef.current) {
          setStatus("Waiting for the other participant...");
          setIsJoining(false);
        }
      } catch (joinError) {
        console.error("[agora-voice-room] join failed", joinError);
        if (mountedRef.current) {
          setError(joinError instanceof Error ? joinError.message : "Unable to join the call.");
          setIsJoining(false);
        }
      }
    }

    void joinCall();

    return () => {
      cancelled = true;
      mountedRef.current = false;

      const localTrack = localTrackRef.current;
      localTrackRef.current = null;
      if (localTrack) {
        localTrack.stop();
        localTrack.close();
      }

      remoteTracksRef.current.forEach((track) => track.stop());
      remoteTracksRef.current.clear();

      const client = clientRef.current;
      clientRef.current = null;
      if (client) {
        void client.leave().catch(() => undefined);
      }
    };
  }, [callId]);

  async function toggleMute() {
    const localTrack = localTrackRef.current;
    if (!localTrack) return;

    const nextMuted = !isMuted;
    await localTrack.setEnabled(!nextMuted);
    setIsMuted(nextMuted);
    setStatus(nextMuted ? "Your microphone is muted." : "Microphone is live.");
  }

  async function endCall() {
    if (isEnding) return;
    setIsEnding(true);

    await fetch(`/api/peer-calls/${callId}/end`, {
      method: "POST",
    }).catch(() => undefined);

    router.push(backHref);
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Radio className="size-3.5" />
            Voice call
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{status}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Stay on this screen while you talk. Both sides need microphone access.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Users className="size-3.5" />
              {remoteCount > 0 ? `${remoteCount + 1} joined` : "1 joined"}
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => void toggleMute()}
            disabled={isJoining || Boolean(error)}
            className="gap-2"
          >
            {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <Button
            type="button"
            onClick={() => void endCall()}
            disabled={isEnding}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            {isEnding ? <Loader2 className="size-4 animate-spin" /> : <PhoneOff className="size-4" />}
            End call
          </Button>
        </div>

        {isJoining ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Connecting audio...
          </div>
        ) : null}
      </div>
    </div>
  );
}
