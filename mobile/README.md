# Students Traffic Mobile

Native mobile app built with Expo Router and React Native.

## Test locally

Use the Students Traffic development build for calls and push notifications.
Expo Go has no Firebase, Agora, Notifee or CallKeep native modules. Installing a
matching Expo Go version only enables a limited browsing/chat preview.

From the repository root, run the Next.js API separately with `npm run dev`.
Then, from `mobile/`, use a Mac LAN address that the phone can reach:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_MAC_LAN_IP:3000 npm start
```

Install a native development build first (USB device and native tooling required):

```bash
npm run android:device
npm run ios:device
```

Open **Students Traffic** on the phone, not Expo Go. JavaScript-only changes can
use the existing build; native dependency/configuration changes require rebuilding.
The EAS `development` profile is also configured for internal device builds.
Physical iOS push testing requires configured Apple/APNs signing credentials.

The project currently uses SDK 54. Android Expo Go must match SDK 54 for the
limited preview; the current store client may support a different SDK.
`npm run start:go` explicitly starts that preview mode. Its New Architecture
warning reflects Expo Go's architecture, not the configured native build.
Native builds currently retain `newArchEnabled: false`; migrating native modules
and architecture is a separate compatibility change, not a fix for missing modules
inside Expo Go. Do not enable it merely to silence the warning.

Run `npm run typecheck` and `npm run web` for TypeScript and browser checks.
Never use a phone's `localhost` as the Mac API address.

## Versioning

Use the shared release/versioning policy here:

- [Mobile Versioning Guide](../docs/mobile-versioning.md)

Quick rule:

- update `version` in `mobile/app.json` only when users should see a new release version
- let EAS auto-increment internal Android build numbers for production builds

## Current Architecture

- `app/` contains Expo Router routes.
- `app/(auth)/` contains welcome, login, and register flows.
- `app/(tabs)/` contains Home, Search, Saved, Applications, and Profile.
- `app/university/[slug].tsx` contains the university detail flow.
- `src/api/` contains the mobile API adapter. It calls the authenticated `/api/mobile/v1` backend.
- `src/components/` contains reusable app UI primitives.
- `src/theme/` contains shared mobile design tokens.
- `src/types/` contains domain types used by screens and API adapters.
