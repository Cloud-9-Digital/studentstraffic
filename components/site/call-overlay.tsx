"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  ChevronUp,
  Loader2,
  Mic, MicOff,
  PhoneOff,
  Volume2, VolumeX,
} from "lucide-react";

type Phase = "connecting" | "ringing" | "connected" | "ended" | "error";
type NetQuality = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=unknown, 1=excellent … 6=disconnected

const JOIN_TIMEOUT_MS = 30_000;
const RING_TIMEOUT_MS = 60_000;
const CALL_STATUS_POLL_MS = 3_000;
const FINISHED_CALL_STATUSES = new Set(["ended", "expired", "declined", "missed"]);

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

type AudioDevice = { deviceId: string; label: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return <span className="text-4xl font-bold text-white">{initials}</span>;
}

function SignalBars({ quality }: { quality: NetQuality }) {
  if (quality === 0) return null;
  const poor = quality >= 5;
  const color = quality <= 2 ? "bg-emerald-400" : quality === 3 ? "bg-amber-400" : "bg-red-400";
  const filled = quality <= 2 ? 3 : quality === 3 ? 2 : 1;
  if (poor) return <span className="text-[10px] font-medium text-red-400">No signal</span>;
  return (
    <span className="flex items-end gap-[2px] h-3">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1 rounded-sm transition-all ${i <= filled ? color : "bg-white/20"}`}
          style={{ height: `${30 + i * 23}%` }}
        />
      ))}
    </span>
  );
}

function DeviceList({
  devices,
  selected,
  onSelect,
  label,
  icon: Icon,
}: {
  devices: AudioDevice[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
  icon: React.ElementType;
}) {
  if (devices.length <= 1) return null;
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <div className="space-y-1">
        {devices.map((d) => (
          <button
            key={d.deviceId}
            type="button"
            onClick={() => onSelect(d.deviceId)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
              selected === d.deviceId
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-white/60 hover:bg-white/10"
            }`}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{d.label}</span>
            {selected === d.deviceId && <span className="ml-auto size-1.5 rounded-full bg-emerald-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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
  const remoteAudioTracksRef = useRef<Map<string | number, IRemoteAudioTrack>>(new Map());
  const mountedRef = useRef(true);

  const volumeRef = useRef(100);
  const selectedOutputIdRef = useRef<string>("default");

  const [phase, setPhase] = useState<Phase>("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  // Speaker output
  const [volume, setVolumeState] = useState(100);
  const [outputDevices, setOutputDevices] = useState<AudioDevice[]>([]);
  const [selectedOutputId, setSelectedOutputId] = useState("default");
  const [showSpeakerPanel, setShowSpeakerPanel] = useState(false);

  // Mic input
  const [inputDevices, setInputDevices] = useState<AudioDevice[]>([]);
  const [selectedInputId, setSelectedInputId] = useState("default");
  const [showMicPanel, setShowMicPanel] = useState(false);

  // Network quality
  const [netQuality, setNetQuality] = useState<NetQuality>(0);

  const timer = useCallTimer(phase === "connected");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (phase !== "connected" && phase !== "ringing") return;
    const guard = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [phase]);

  // The caller joins Agora before the recipient accepts. Poll the session only
  // while ringing so a remote decline/expiry dismisses this overlay even if a
  // realtime event is missed or the other client never joins the channel.
  useEffect(() => {
    if (phase !== "ringing") return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const startedAt = Date.now();

    const finish = () => {
      if (cancelled) return;
      setPhase("ended");
      window.setTimeout(() => {
        if (!cancelled) onClose();
      }, 500);
    };

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/peer-calls/${callId}/status`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as { status?: string };
        if (FINISHED_CALL_STATUSES.has(payload.status ?? "")) {
          finish();
          return;
        }
      } catch {
        // Keep ringing through a transient network failure; the timeout below
        // remains the final safety net.
      }

      if (Date.now() - startedAt >= RING_TIMEOUT_MS) {
        finish();
        return;
      }
      timeout = setTimeout(checkStatus, CALL_STATUS_POLL_MS);
    };

    timeout = setTimeout(checkStatus, CALL_STATUS_POLL_MS);
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [callId, onClose, phase]);

  // ── Agora join ──────────────────────────────────────────────────────────────
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
        AgoraRTC.setLogLevel(0);
        console.log("[agora] joining channel", payload.channelName, "uid", payload.uid, "appId", payload.appId);

        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        async function subscribeAudio(user: IAgoraRTCRemoteUser) {
          try {
            await client.subscribe(user, "audio");
            const track = user.audioTrack as IRemoteAudioTrack | undefined;
            if (track) {
              remoteAudioTracksRef.current.set(user.uid, track);
              track.setVolume(volumeRef.current);
              if (selectedOutputIdRef.current !== "default") {
                await track.setPlaybackDevice(selectedOutputIdRef.current).catch(() => undefined);
              }
              track.play();
            }
          } catch { /* ignore */ }
        }

        client.on("connection-state-change", (curState: string, prevState: string, reason?: string) => {
          console.log("[agora] connection-state-change", prevState, "→", curState, reason ?? "");
          if (curState === "FAILED" && !cancelled && mountedRef.current) {
            setErrorMsg(`Connection failed${reason ? `: ${reason}` : ""}. Check your network and try again.`);
            setPhase("error");
          }
        });

        client.on("network-quality", (stats: { uplinkNetworkQuality: NetQuality }) => {
          if (mountedRef.current) setNetQuality(stats.uplinkNetworkQuality);
        });

        client.on("user-published", (user: IAgoraRTCRemoteUser, mediaType) => {
          if (mediaType !== "audio") return;
          if (!cancelled && mountedRef.current) setPhase("connected");
          void subscribeAudio(user);
        });

        client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType) => {
          if (mediaType === "audio") remoteAudioTracksRef.current.delete(user.uid);
        });

        client.on("user-left", (user: IAgoraRTCRemoteUser) => {
          remoteAudioTracksRef.current.delete(user.uid);
          if (mountedRef.current && remoteAudioTracksRef.current.size === 0) {
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

        if (cancelled) return;

        for (const user of client.remoteUsers) {
          if (user.hasAudio && !remoteAudioTracksRef.current.has(user.uid)) {
            void subscribeAudio(user);
          }
        }

        if (!cancelled && mountedRef.current) {
          setPhase(remoteAudioTracksRef.current.size > 0 ? "connected" : "ringing");
        }

        const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
        if (cancelled) { localTrack.stop(); localTrack.close(); return; }
        localTrackRef.current = localTrack;
        await client.publish([localTrack]);

        // Enumerate devices once connected
        if (!cancelled && mountedRef.current) {
          try {
            const [outputList, inputList] = await Promise.all([
              AgoraRTC.getPlaybackDevices(),
              AgoraRTC.getMicrophones(),
            ]);
            if (mountedRef.current) {
              setOutputDevices(outputList.map((d) => ({
                deviceId: d.deviceId,
                label: d.label || `Speaker ${d.deviceId.slice(0, 6)}`,
              })));
              setInputDevices(inputList.map((d) => ({
                deviceId: d.deviceId,
                label: d.label || `Microphone ${d.deviceId.slice(0, 6)}`,
              })));
            }
          } catch { /* device enumeration not supported */ }
        }
      } catch (err) {
        console.error("[agora] join failed", err);
        const client = clientRef.current;
        if (client) {
          clientRef.current = null;
          void client.leave().catch(() => undefined);
        }
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
      remoteAudioTracksRef.current.clear();
    };
  }, [callId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Control handlers ────────────────────────────────────────────────────────

  async function toggleMute() {
    const track = localTrackRef.current;
    if (!track) return;
    const next = !isMuted;
    await track.setEnabled(!next);
    setIsMuted(next);
  }

  function toggleSpeaker() {
    const next = volume === 0 ? 100 : 0;
    setVolumeState(next);
    volumeRef.current = next;
    for (const track of remoteAudioTracksRef.current.values()) {
      track.setVolume(next);
    }
  }

  async function endCall() {
    if (isEnding) return;
    setIsEnding(true);
    await fetch(`/api/peer-calls/${callId}/end`, { method: "POST" }).catch(() => undefined);
    setPhase("ended");
    setTimeout(onClose, 1800);
  }

  function handleVolumeChange(v: number) {
    setVolumeState(v);
    volumeRef.current = v;
    for (const track of remoteAudioTracksRef.current.values()) {
      track.setVolume(v);
    }
  }

  async function handleOutputDeviceChange(deviceId: string) {
    setSelectedOutputId(deviceId);
    selectedOutputIdRef.current = deviceId;
    for (const track of remoteAudioTracksRef.current.values()) {
      await track.setPlaybackDevice(deviceId).catch(() => undefined);
    }
  }

  async function handleInputDeviceChange(deviceId: string) {
    setSelectedInputId(deviceId);
    const track = localTrackRef.current;
    if (!track) return;
    await (track as IMicrophoneAudioTrack & { setDevice?: (id: string) => Promise<void> }).setDevice?.(deviceId).catch(() => undefined);
  }

  function closePanels() {
    setShowSpeakerPanel(false);
    setShowMicPanel(false);
  }

  const statusLine = () => {
    if (phase === "connecting") return null;
    if (phase === "ringing")   return "Ringing…";
    if (phase === "connected") return timer;
    if (phase === "ended")     return "Call ended";
    return errorMsg ?? "Something went wrong";
  };

  const isLive = phase !== "ended" && phase !== "error";
  const isSpeakerMuted = volume === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh flex-col items-center justify-between overflow-hidden px-6 py-14 sm:py-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #1d6b5f33 0%, transparent 70%), linear-gradient(160deg, #0d3530 0%, #071a17 45%, #020c0b 100%)",
      }}
      onClick={closePanels}
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Top: identity */}
      <div className="relative flex flex-col items-center gap-6 text-center">
        {/* Avatar */}
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

        {/* Status + signal strength together */}
        <div className="flex min-h-[28px] items-center gap-3">
          {phase === "connecting" && <Loader2 className="size-4 animate-spin text-white/40" />}
          {phase === "connected" && <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />}
          <p className={`text-base font-medium tabular-nums ${phase === "error" ? "text-red-400" : "text-white/60"}`}>
            {statusLine()}
          </p>
          {phase === "connected" && netQuality > 0 && (
            <SignalBars quality={netQuality} />
          )}
        </div>
      </div>

      {/* Bottom: controls */}
      <div className="relative flex w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>

        {/* Speaker panel */}
        {showSpeakerPanel && isLive && (
          <div className="absolute bottom-full mb-4 left-0 w-64 rounded-2xl bg-white/10 backdrop-blur-sm p-4 space-y-4 ring-1 ring-white/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">Volume</span>
                <span className="text-xs tabular-nums text-white/40">{volume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="size-4 shrink-0 text-white/30" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="flex-1 h-1.5 appearance-none rounded-full bg-white/20 accent-emerald-400 cursor-pointer"
                />
                <Volume2 className="size-4 shrink-0 text-white/30" />
              </div>
            </div>
            <DeviceList
              devices={outputDevices}
              selected={selectedOutputId}
              onSelect={(id) => void handleOutputDeviceChange(id)}
              label="Audio output"
              icon={Volume2}
            />
          </div>
        )}

        {/* Mic panel */}
        {showMicPanel && isLive && (
          <div className="absolute bottom-full mb-4 right-0 w-64 rounded-2xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/10">
            <DeviceList
              devices={inputDevices}
              selected={selectedInputId}
              onSelect={(id) => void handleInputDeviceChange(id)}
              label="Microphone input"
              icon={Mic}
            />
            {inputDevices.length <= 1 && (
              <p className="text-xs text-white/40">Only one microphone detected.</p>
            )}
          </div>
        )}

        {isLive && (
          <div className="flex w-full items-end justify-center gap-8 py-2">

            {/* Speaker group */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {/* Chevron pill — opens speaker panel */}
                <button
                  type="button"
                  onClick={() => { setShowMicPanel(false); setShowSpeakerPanel((p) => !p); }}
                  disabled={phase === "connecting"}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 px-2 py-0.5 disabled:opacity-30 transition"
                  aria-label="Speaker options"
                >
                  <ChevronUp className={`size-3 text-white/60 transition-transform ${showSpeakerPanel ? "rotate-180" : ""}`} />
                </button>
                {/* Main button: mute/unmute speaker */}
                <button
                  type="button"
                  onClick={toggleSpeaker}
                  disabled={phase === "connecting"}
                  className={`mt-4 flex size-16 items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                    isSpeakerMuted
                      ? "bg-white text-[#0a1f1c] shadow-lg shadow-white/20"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSpeakerMuted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
                </button>
              </div>
              <span className="text-xs text-white/40">
                {isSpeakerMuted ? "Unmute" : "Speaker"}
              </span>
            </div>

            {/* End call */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => void endCall()}
                disabled={isEnding}
                className="flex size-16 items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30 transition-all hover:scale-105 hover:bg-red-600 disabled:opacity-60"
              >
                {isEnding ? <Loader2 className="size-6 animate-spin" /> : <PhoneOff className="size-6" />}
              </button>
              <span className="text-xs text-white/40">End call</span>
            </div>

            {/* Mic group */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {/* Chevron pill — opens mic panel */}
                <button
                  type="button"
                  onClick={() => { setShowSpeakerPanel(false); setShowMicPanel((p) => !p); }}
                  disabled={phase === "connecting"}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 px-2 py-0.5 disabled:opacity-30 transition"
                  aria-label="Mic options"
                >
                  <ChevronUp className={`size-3 text-white/60 transition-transform ${showMicPanel ? "rotate-180" : ""}`} />
                </button>
                {/* Main button: mute/unmute mic */}
                <button
                  type="button"
                  onClick={() => void toggleMute()}
                  disabled={phase === "connecting"}
                  className={`mt-4 flex size-16 items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                    isMuted
                      ? "bg-white text-[#0a1f1c] shadow-lg shadow-white/20"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
                </button>
              </div>
              <span className="text-xs text-white/40">{isMuted ? "Unmute mic" : "Mute"}</span>
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
