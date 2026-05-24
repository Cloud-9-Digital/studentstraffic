/**
 * Generate a simple blur placeholder for Next.js Image
 * Creates a tiny base64-encoded SVG for instant blur effect
 */

export function getImageBlurDataURL(width = 8, height = 8): string {
  // Create a simple gradient blur placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a4a43;stop-opacity:1" />
          <stop offset="45%" style="stop-color:#0f3d37;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c2610;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get blur placeholder for university cover images
 */
export const universityImageBlurDataURL = getImageBlurDataURL(320, 180);

/**
 * Get blur placeholder for university logos
 */
export const universityLogoBlurDataURL = getImageBlurDataURL(40, 40);
