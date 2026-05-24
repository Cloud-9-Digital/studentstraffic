import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this value in production, or use tracesSampler for finer control.
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay configuration
  replaysOnErrorSampleRate: 1.0,

  // Session replay sample rate when no error occurs
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out noise
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^Non-Error promise rejection captured/i,
    // Network errors
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    // React hydration errors (usually harmless)
    "Hydration failed",
    "Text content does not match",
  ],

  // Environment
  environment: process.env.NODE_ENV,
});
