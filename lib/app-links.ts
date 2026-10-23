// Universal Links (iOS) and App Links (Android) for the Students Traffic app.
// Only paths with a matching app screen are claimed: universities and
// countries. Programme, guide and blog URLs stay on the web.

export const appBundleId = "com.studentstraffic.app";
export const appleTeamId = "9562R6BVH7";

// SHA-256 of the EAS upload keystore, which signs locally installed builds.
const easKeystoreSha256 =
  "DC:39:D5:AC:85:3C:09:F0:94:21:B8:B9:77:FF:BF:23:26:28:2A:F5:E2:AA:9A:05:E2:E1:A3:73:AD:BF:D5:56";

// SHA-256 of Google's Play App Signing key (Play Console → App integrity →
// App signing), which signs every Play-installed build. Further keys can be
// added through ANDROID_APP_LINK_SHA256 (comma-separated).
const playAppSigningSha256 =
  "6E:88:6E:DC:03:C8:EF:76:F9:F7:37:AA:A1:31:AB:11:38:8C:05:1E:A7:26:32:CE:D8:0C:14:40:97:39:8B:EA";

export function getAndroidCertFingerprints() {
  const extra = (process.env.ANDROID_APP_LINK_SHA256 ?? "")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  return [...new Set([easKeystoreSha256, playAppSigningSha256, ...extra])];
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
