"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeIframeApiPromise: Promise<void> | null = null;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube iframe API requires a browser"));
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeIframeApiPromise) {
    return youtubeIframeApiPromise;
  }

  youtubeIframeApiPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-youtube-iframe-api="true"]'
    );
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve();
    };

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.dataset.youtubeIframeApi = "true";
    script.onerror = () => {
      youtubeIframeApiPromise = null;
      reject(new Error("Failed to load YouTube iframe API"));
    };

    document.head.appendChild(script);
  });

  return youtubeIframeApiPromise;
}

export function YouTubePlayer({
  videoId,
  isShort = false,
  className,
  startMuted = true,
}: {
  videoId: string;
  isShort?: boolean;
  className?: string;
  startMuted?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const hideRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(startMuted);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const showControls = useCallback(() => {
    clearTimeout(hideRef.current);
    setControlsVisible(true);
  }, []);

  const nudgeControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setControlsVisible(false), 2500);
  }, []);

  useEffect(() => {
    let active = true;

    async function mountPlayer() {
      try {
        await loadYouTubeIframeApi();

        const YTApi = window.YT;

        if (!active || !mountRef.current || !YTApi?.Player) {
          return;
        }

        const player = new YTApi.Player(mountRef.current, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            autoplay: YTApi.AutoPlay.AutoPlay,
            controls: YTApi.Controls.Hide,
            disablekb: YTApi.KeyboardControls.Disable,
            enablejsapi: YTApi.JsApi.Enable,
            iv_load_policy: YTApi.IvLoadPolicy.Hide,
            loop: YTApi.Loop.Loop,
            modestbranding: YTApi.ModestBranding.Modest,
            mute: startMuted ? YTApi.Mute.Muted : YTApi.Mute.NotMuted,
            origin: window.location.origin,
            playlist: videoId,
            playsinline: YTApi.PlaysInline.Inline,
            rel: YTApi.RelatedVideos.Hide,
          },
          events: {
            onReady: (event) => {
              const iframe = event.target.getIframe();
              iframe.setAttribute(
                "allow",
                "autoplay; encrypted-media; picture-in-picture; fullscreen"
              );

              if (startMuted) {
                event.target.mute();
                setMuted(true);
              } else {
                event.target.unMute();
                event.target.setVolume(100);
                setMuted(false);
              }

              event.target.playVideo();
              setDuration(event.target.getDuration() || 0);
              setElapsed(event.target.getCurrentTime() || 0);
              setPlaying(true);
              setAutoplayBlocked(false);
              nudgeControls();
            },
            onStateChange: (event) => {
              if (event.data === YTApi.PlayerState.PLAYING) {
                setPlaying(true);
                setDuration(event.target.getDuration() || 0);
                setAutoplayBlocked(false);
                nudgeControls();
                return;
              }

              if (
                event.data === YTApi.PlayerState.PAUSED ||
                event.data === YTApi.PlayerState.ENDED ||
                event.data === YTApi.PlayerState.CUED
              ) {
                setPlaying(false);
                showControls();
              }
            },
            onAutoplayBlocked: (event) => {
              if (!startMuted) {
                event.target.mute();
                event.target.playVideo();
                setMuted(true);
                setPlaying(true);
                setAutoplayBlocked(true);
                nudgeControls();
                return;
              }

              setPlaying(false);
              setAutoplayBlocked(true);
              showControls();
            },
          },
        });

        playerRef.current = player;
      } catch {
        if (!active) return;
        setPlaying(false);
        setAutoplayBlocked(true);
        showControls();
      }
    }

    mountPlayer();

    return () => {
      active = false;
      clearInterval(tickRef.current);
      clearTimeout(hideRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [nudgeControls, showControls, startMuted, videoId]);

  useEffect(() => {
    clearInterval(tickRef.current);

    if (!playing) {
      return () => clearInterval(tickRef.current);
    }

    tickRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const nextElapsed = player.getCurrentTime();
      const nextDuration = player.getDuration();

      if (Number.isFinite(nextElapsed)) {
        setElapsed(nextElapsed);
      }

      if (Number.isFinite(nextDuration) && nextDuration > 0) {
        setDuration(nextDuration);
      }
    }, 250);

    return () => clearInterval(tickRef.current);
  }, [playing]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (autoplayBlocked && muted) {
      player.unMute();
      player.setVolume(100);
      player.playVideo();
      setMuted(false);
      setPlaying(true);
      setAutoplayBlocked(false);
      nudgeControls();
      return;
    }

    if (playing) {
      player.pauseVideo();
      setPlaying(false);
      showControls();
      return;
    }

    player.playVideo();
    setPlaying(true);
    setAutoplayBlocked(false);
    nudgeControls();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const player = playerRef.current;
    if (!player) return;

    if (muted) {
      player.unMute();
      player.setVolume(100);
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current;
    if (!player) return;

    const ratio = Number(e.target.value);
    const time = ratio * duration;
    player.seekTo(time, true);
    setElapsed(time);
  };

  const goFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    (e.currentTarget.closest("[data-yt-player]") as HTMLElement | null)
      ?.requestFullscreen?.();
  };

  const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;

  return (
    <div
      data-yt-player
      className={cn(
        "relative w-full overflow-hidden bg-black select-none cursor-pointer",
        className ?? (isShort ? "aspect-[9/16]" : "aspect-video")
      )}
      onMouseMove={nudgeControls}
      onTouchStart={nudgeControls}
      onClick={togglePlay}
    >
      <div
        ref={mountRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {autoplayBlocked && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <div className="rounded-full bg-black/60 px-2.5 py-1 text-[0.62rem] font-medium text-white/90 backdrop-blur-sm">
            Tap to resume audio
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
          controlsVisible && !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
          <Play className="size-6 fill-white text-white translate-x-0.5" />
        </div>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={seek}
          className="h-0.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
          aria-label="Seek"
        />

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-7 items-center justify-center text-white/90 transition-colors hover:text-white"
            >
              {playing ? (
                <Pause className="size-4 fill-white" />
              ) : (
                <Play className="size-4 fill-white translate-x-px" />
              )}
            </button>

            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex size-7 items-center justify-center text-white/90 transition-colors hover:text-white"
            >
              {muted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>

            {duration > 0 && (
              <span className="text-[0.6rem] tabular-nums text-white/70">
                {fmt(elapsed)} / {fmt(duration)}
              </span>
            )}
          </div>

          <button
            onClick={goFullscreen}
            aria-label="Fullscreen"
            className="flex size-7 items-center justify-center text-white/90 transition-colors hover:text-white"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
