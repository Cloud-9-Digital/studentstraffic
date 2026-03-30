import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

const PRIMARY = "#0f3d37";
const HEADING = "#155e53";
const ACCENT = "#c2410c";
const MUTED = "#6b7280";
const BORDER = "rgba(15, 63, 55, 0.10)";
const GRID = "rgba(15, 63, 55, 0.06)";

type SeoImageInput = {
  eyebrow?: string;
  title: string;
  /** Second headline line rendered in italic accent color — used for the homepage hero layout */
  accentTitle?: string;
  description?: string;
  accentLabel?: string;
  tags?: string[];
};

async function loadGoogleFont(
  family: string,
  variant: string
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:${variant}&display=swap`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    ).then((r) => r.text());

    const matches = [...css.matchAll(/url\(([^)]+\.woff2)\)/g)];
    if (!matches.length) return null;
    const url = matches[matches.length - 1][1];
    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function createSeoImage(input: SeoImageInput) {
  const [jakartaBold, frauncesNormal, frauncesItalic] = await Promise.all([
    loadGoogleFont("Plus+Jakarta+Sans", "wght@800"),
    loadGoogleFont("Fraunces", "ital,wght@0,600"),
    loadGoogleFont("Fraunces", "ital,wght@1,600"),
  ]);

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal" | "italic";
  }[] = [];
  if (jakartaBold)
    fonts.push({
      name: "Plus Jakarta Sans",
      data: jakartaBold,
      weight: 800,
      style: "normal",
    });
  if (frauncesNormal)
    fonts.push({
      name: "Fraunces",
      data: frauncesNormal,
      weight: 600,
      style: "normal",
    });
  if (frauncesItalic)
    fonts.push({
      name: "Fraunces",
      data: frauncesItalic,
      weight: 600,
      style: "italic",
    });

  const tags = input.tags?.slice(0, 4) ?? [];
  const isHeroLayout = !!input.accentTitle;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: PRIMARY,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          position: "relative",
        }}
      >
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 72px",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top row: brand name + accent label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                fontWeight: 800,
                color: PRIMARY,
                letterSpacing: "-0.02em",
              }}
            >
              Students Traffic
            </div>
            {input.accentLabel && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: `1.5px solid ${BORDER}`,
                  fontSize: 20,
                  fontWeight: 700,
                  color: HEADING,
                  background: "rgba(21, 94, 83, 0.06)",
                }}
              >
                {input.accentLabel}
              </div>
            )}
          </div>

          {/* Headline — two layouts */}
          {isHeroLayout ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "920px",
              }}
            >
              {input.eyebrow && (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    marginBottom: "20px",
                  }}
                >
                  {input.eyebrow}
                </div>
              )}
              <div
                style={{
                  fontSize: 88,
                  fontWeight: 600,
                  lineHeight: 1.0,
                  color: HEADING,
                  fontFamily: '"Fraunces", Georgia, serif',
                  letterSpacing: "-0.03em",
                }}
              >
                {input.title}
              </div>
              <div
                style={{
                  fontSize: 84,
                  fontWeight: 600,
                  fontStyle: "italic",
                  lineHeight: 1.05,
                  color: ACCENT,
                  fontFamily: '"Fraunces", Georgia, serif',
                  letterSpacing: "-0.03em",
                }}
              >
                {input.accentTitle}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "900px",
              }}
            >
              {input.eyebrow && (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: ACCENT,
                  }}
                >
                  {input.eyebrow}
                </div>
              )}
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  lineHeight: 1.02,
                  color: HEADING,
                  fontFamily: '"Fraunces", Georgia, serif',
                  letterSpacing: "-0.03em",
                }}
              >
                {input.title}
              </div>
              {input.description && (
                <div
                  style={{
                    fontSize: 26,
                    lineHeight: 1.4,
                    color: MUTED,
                    maxWidth: "780px",
                  }}
                >
                  {input.description}
                </div>
              )}
            </div>
          )}

          {/* Bottom row: tags + domain */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    border: `1.5px solid ${BORDER}`,
                    background: "rgba(15, 63, 55, 0.05)",
                    color: HEADING,
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: MUTED,
                letterSpacing: "0.01em",
              }}
            >
              studentstraffic.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize, fonts }
  );
}
