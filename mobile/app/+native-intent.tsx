import { mapWebLinkPath } from "../src/navigation/webLinkPath";

// Rewrites incoming Universal Links / App Links from studentstraffic.com to
// app routes (Expo Router calls this for every native deep link).
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    return mapWebLinkPath(path);
  } catch {
    // Never throw here: an exception would leave the link unhandled.
    return "/";
  }
}
