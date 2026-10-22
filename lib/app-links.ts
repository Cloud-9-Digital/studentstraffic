// Universal Links (iOS) and App Links (Android) for the Students Traffic app.
// Only paths with a matching app screen are claimed: universities and
// countries. Programme, guide and blog URLs stay on the web.

export const appBundleId = "com.studentstraffic.app";
export const appleTeamId = "9562R6BVH7";

// SHA-256 of the EAS upload keystore. With Play App Signing, Play-installed
// builds are signed by Google's key instead: add its fingerprint (Play Console
// → App integrity) through ANDROID_APP_LINK_SHA256 (comma-separated).
const easKeystoreSha256 =
  "DC:39:D5:AC:85:3C:09:F0:94:21:B8:B9:77:FF:BF:23:26:28:2A:F5:E2:AA:9A:05:E2:E1:A3:73:AD:BF:D5:56";

export function getAndroidCertFingerprints() {
  const extra = (process.env.ANDROID_APP_LINK_SHA256 ?? "")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  return [...new Set([easKeystoreSha256, ...extra])];
}

export function getAppleAppSiteAssociation() {
  return {
    applinks: {
      details: [
        {
          appIDs: [`${appleTeamId}.${appBundleId}`],
          components: [
            // Markdown views are for agents, not the app.
            { "/": "/university/*.md", exclude: true },
            { "/": "/university/*" },
            { "/": "/countries" },
            { "/": "/countries/*" },
          ],
        },
      ],
    },
  };
}

export function getAndroidAssetLinks() {
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: appBundleId,
        sha256_cert_fingerprints: getAndroidCertFingerprints(),
      },
    },
  ];
}
