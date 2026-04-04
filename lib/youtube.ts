const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function isValidVideoId(value: string) {
  return YOUTUBE_ID_PATTERN.test(value);
}

export function getYouTubeVideoId(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtu.be") {
      const candidate = url.pathname.slice(1).split("/")[0] ?? "";
      return isValidVideoId(candidate) ? candidate : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const candidate = url.searchParams.get("v") ?? "";
        return isValidVideoId(candidate) ? candidate : null;
      }

      if (url.pathname.startsWith("/embed/")) {
        const candidate = url.pathname.split("/")[2] ?? "";
        return isValidVideoId(candidate) ? candidate : null;
      }

      if (url.pathname.startsWith("/shorts/")) {
        const candidate = url.pathname.split("/")[2] ?? "";
        return isValidVideoId(candidate) ? candidate : null;
      }
    }
  } catch {}

  return null;
}

export function getYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Calls YouTube's oEmbed endpoint (no API key required) and returns whether
 * the video is portrait/short (height > width). Returns null on any error.
 */
/**
 * Calls YouTube's oEmbed endpoint using the /shorts/ URL (no API key required).
 * The /shorts/ URL returns portrait dimensions for Shorts and landscape for
 * regular videos, making it the reliable way to detect aspect ratio.
 */
export async function getYouTubeIsShort(videoId: string): Promise<boolean | null> {
  try {
    const shortsUrl = `https://www.youtube.com/shorts/${encodeURIComponent(videoId)}`;
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(shortsUrl)}&format=json`;
    const res = await fetch(oEmbedUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json() as { width?: number; height?: number };
    if (typeof data.width === "number" && typeof data.height === "number") {
      return data.height > data.width;
    }
    return null;
  } catch {
    return null;
  }
}
