"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";


export function YouTubePlayer({
  videoId,
  isShort = false,
  className,
  muted: startMuted = false,
}: {
  videoId: string;
  isShort?: boolean;
  className?: string;
  muted?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(startMuted);
  const [showControls, setShowControls] = useState(true);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: startMuted ? "1" : "0",
    controls: "0",
    disablekb: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
    loop: "1",
    modestbranding: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
  });

  const src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

  // Listen to state/info messages from the YT iframe
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      let data: Record<string, unknown>;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!data || typeof data !== "object") return;
      } catch {
        return;
      }

      if (data.event === "onReady") {
        setReady(true);
      }

      if (data.event === "onStateChange") {
        const state = data.info as number;
        if (state === 1) {
          setPlaying(true);
          nudge();
        } else if (state === 2 || state === 0) {
          setPlaying(false);
          setShowControls(true);
          clearTimeout(hideTimer.current);
        }
      }

      if (data.event === "infoDelivery") {
        const info = data.info as Record<string, unknown> | undefined;
        if (!info) return;
        if (typeof info.muted === "boolean") setMuted(info.muted);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [startMuted]); // eslint-disable-line react-hooks/exhaustive-deps

  function send(func: string, args: unknown[] = []) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }

  function nudge() {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  }

  const togglePlay = () => {
    if (playing) { send("pauseVideo"); setPlaying(false); }
    else { send("playVideo"); setPlaying(true); nudge(); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (muted) { send("unMute"); send("setVolume", [100]); setMuted(false); }
    else { send("mute"); setMuted(true); }
  };

  const goFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    (e.currentTarget.closest("[data-yt-player]") as HTMLElement)?.requestFullscreen?.();
  };

  const aspectClass = isShort ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      data-yt-player
      className={cn("relative w-full overflow-hidden bg-black select-none cursor-pointer", className ?? aspectClass)}
      onMouseMove={nudge}
      onTouchStart={nudge}
      onPointerUp={togglePlay}
    >
      {/* iframe — pointer-events none so clicks hit our overlay */}
      <iframe
        ref={iframeRef}
        src={src}
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: "none" }}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={() => {
          setReady(true);
          setPlaying(true);
          nudge();
        }}
      />

      {/* Spinner */}
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}

      {/* Centre play/pause */}
      {ready && (
        <div className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex size-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            {playing
              ? <Pause className="size-6 fill-white text-white" />
              : <Play className="size-6 fill-white text-white translate-x-0.5" />}
          </div>
        </div>
      )}

      {/* Bottom controls */}
      {ready && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button type="button" onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                aria-label={playing ? "Pause" : "Play"}
                className="flex size-7 items-center justify-center text-white/90 hover:text-white">
                {playing ? <Pause className="size-4 fill-white" /> : <Play className="size-4 fill-white translate-x-px" />}
              </button>
              <button type="button" onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="flex size-7 items-center justify-center text-white/90 hover:text-white">
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
            <button type="button" onClick={goFullscreen} aria-label="Fullscreen"
              className="flex size-7 items-center justify-center text-white/90 hover:text-white">
              <Maximize2 className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
