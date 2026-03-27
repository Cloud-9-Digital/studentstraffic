import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

type SeoImageInput = {
  eyebrow: string;
  title: string;
  description: string;
  accentLabel?: string;
  tags?: string[];
};

export function createSeoImage(input: SeoImageInput) {
  const tags = input.tags?.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top left, #2f8f83 0%, #103c37 40%, #071a18 100%)",
          color: "#f7f7f3",
          padding: "48px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "28px",
            padding: "40px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(247,247,243,0.72)",
              }}
            >
              <span>{input.eyebrow}</span>
            </div>
            {input.accentLabel ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "12px 18px",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {input.accentLabel}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "900px",
            }}
          >
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              {input.title}
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgba(247,247,243,0.82)",
                maxWidth: "860px",
              }}
            >
              {input.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(247,247,243,0.86)",
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                Students Traffic
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(247,247,243,0.66)",
                }}
              >
                Compare universities, fees, admissions, and guidance.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    ogImageSize
  );
}
