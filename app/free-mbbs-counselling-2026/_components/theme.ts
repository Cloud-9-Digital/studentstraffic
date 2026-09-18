/**
 * Brand palette for this landing page, mirroring the tokens in app/globals.css
 * so the ad page reads as the same product as the rest of the site.
 * Values are inlined (rather than `var(--token)`) to match the styling
 * convention already used by the shared `components/site/mbbs-lp` components.
 */
export const BRAND = {
  /** --primary: deep brand green. Dark surfaces and headings. */
  green: "#0f3d37",
  /** --surface-dark-2: the lighter end of the dark-green surface gradient. */
  greenLight: "#184a43",
  /** --heading: green used for section headings on light backgrounds. */
  heading: "#155e53",
  /** --accent: coral orange. Buttons and emphasis on light backgrounds. */
  coral: "#c2410c",
  /** Lighter coral from the site's warm surface gradients — legible on green. */
  coralLight: "#f08a4b",
  /** Soft tint of coralLight for gradient text ends. */
  coralSoft: "#f7b183",
  /** Warm off-white for alternating light sections. */
  surface: "#f7f9f8",
} as const;

/** The dark-green surface gradient used by the hero, CTA band and header. */
export const GREEN_SURFACE = `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.greenLight} 100%)`;

/** Coral gradient for highlighted headline text on the green surface. */
export const CORAL_TEXT_GRADIENT = `linear-gradient(90deg, ${BRAND.coralLight} 0%, ${BRAND.coralSoft} 100%)`;

export const HAIRLINE = "rgba(0,0,0,0.07)";
