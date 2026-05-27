"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { Loader2, Mic, MicOff, PhoneOff } from "lucide-react";

type Phase = "connecting" | "ringing" | "connected" | "ended" | "error";

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

function useCallTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="text-4xl font-bold text-white">{initials}</span>
  );
}

export function CallOverlay({
  callId,
  displayName,
  universityName,
  onClose,
}: {
  callId: string;
  displayName: string;
  universityName: string;
  onClose: () => void;
}) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const mountedRef = useRef(true);
  const remoteTracksRef = useRef<Map<string | number, boolean>>(new Map());

  const [phase, setPhase] = useState<Phase>("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const timer = useCallTimer(phase === "connected");

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function joinCall() {
      try {
        const res = await fetch(`/api/peer-calls/${callId}/token`, { method: "POST" });
        const payload = (await res.json()) as AgoraJoinPayload | { error?: string };

        if (!res.ok || !("appId" in payload)) {
          throw new Error("error" in payload ? (payload.error ?? "Unable to join.") : "Unable to join.");
        }

        if (cancelled) return;

        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
            remoteTracksRef.current.set(user.uid, true);
            if (!cancelled && mountedRef.current) setPhase("connected");
          }
        });

        client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType) => {
          if (mediaType === "audio") remoteTracksRef.current.delete(user.uid);
        });

        client.on("user-left", (user: IAgoraRTCRemoteUser) => {
          remoteTracksRef.current.delete(user.uid);
          if (mountedRef.current && remoteTracksRef.current.size === 0) {
            setPhase("ended");
            setTimeout(() => { if (mountedRef.current) onClose(); }, 2000);
          }
        });

        await Promise.race([
          client.join(payload.appId, payload.channelName, payload.token, payload.uid),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Connection timed out. Please try again.")), JOIN_TIMEOUT_MS)
          ),
        ]);

        const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTrackRef.current = localTrack;
        await client.publish([localTrack]);

        if (!cancelled && mountedRef.current) setPhase("ringing");
      } catch (err) {
        if (mountedRef.current) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to join the call.");
          setPhase("error");
        }
      }
    }

    void joinCall();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      localTrackRef.current?.stop();
      localTrackRef.current?.close();
      localTrackRef.current = null;
      void clientRef.current?.leave().catch(() => undefined);
      clientRef.current = null;
    };
  }, [callId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleMute() {
    const track = localTrackRef.current;
    if (!track) return;
    const next = !isMuted;
    await track.setEnabled(!next);
    setIsMuted(next);
  }

  async function endCall() {
    if (isEnding) return;
    setIsEnding(true);
    await fetch(`/api/peer-calls/${callId}/end`, { method: "POST" }).catch(() => undefined);
    setPhase("ended");
    setTimeout(onClose, 1800);
  }

  const statusLine = () => {
    if (phase === "connecting") return null;
    if (phase === "ringing")   return "Ringing…";
    if (phase === "connected") return timer;
    if (phase === "ended")     return "Call ended";
    return errorMsg ?? "Something went wrong";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0a1f1c] px-6 py-16 sm:py-20">
      {/* Top: identity */}
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Avatar with pulse rings when ringing */}
        <div className="relative flex items-center justify-center">
          {phase === "ringing" && (
            <>
              <span className="absolute size-40 animate-ping rounded-full bg-white/5" style={{ animationDuration: "1.8s" }} />
              <span className="absolute size-52 animate-ping rounded-full bg-white/[0.03]" style={{ animationDuration: "1.8s", animationDelay: "0.6s" }} />
            </>
          )}
          {phase === "connected" && (
            <span className="absolute size-40 rounded-full bg-emerald-500/10" />
          )}
          <div className="relative flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-[#1d6b5f] to-[#0f3d37] shadow-2xl ring-2 ring-white/10">
            <Avatar name={displayName} />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-2xl font-semibold tracking-tight text-white">{displayName}</p>
          <p className="text-sm text-white/50">{universityName}</p>
        </div>

        {/* Status */}
        <div className="flex min-h-[28px] items-center gap-2">
          {phase === "connecting" && (
            <Loader2 className="size-4 animate-spin text-white/40" />
          )}
          {phase === "connected" && (
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          )}
          <p
            className={`text-base font-medium tabular-nums ${
              phase === "error" ? "text-red-400" : "text-white/60"
            }`}
          >
            {statusLine()}
          </p>
        </div>
      </div>

      {/* Bottom: controls */}
      <div className="flex flex-col items-center gap-10 w-full">
        {phase !== "ended" && phase !== "error" && (
          <div className="flex items-center gap-10">
            {/* Mute */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => void toggleMute()}
                disabled={phase === "connecting"}
                className={`flex size-16 items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                  isMuted
                    ? "bg-white text-[#0a1f1c] shadow-lg shadow-white/20"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
              </button>
              <span className="text-xs text-white/40">{isMuted ? "Unmute" : "Mute"}</span>
            </div>

            {/* End call */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => void endCall()}
                disabled={isEnding}
                className="flex size-20 items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30 transition-all hover:scale-105 hover:bg-red-600 disabled:opacity-60"
              >
                {isEnding
                  ? <Loader2 className="size-7 animate-spin" />
                  : <PhoneOff className="size-7" />
                }
              </button>
              <span className="text-xs text-white/40">End call</span>
            </div>
          </div>
        )}

        {phase === "error" && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white/20"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
