# Students Traffic Mobile

Native mobile app built with Expo Router and React Native.

## Test Locally

From the repo root:

```bash
npm run mobile:typecheck
npm run mobile:web
```

For a real phone:

```bash
cd mobile
EXPO_PUBLIC_API_URL=http://YOUR_MAC_LAN_IP:3000 npx expo start -c
```

Then scan the QR code:

- iPhone: use the Camera app or Expo Go.
- Android: use the Expo Go scanner.

The API URL must point at the Next.js server that exposes `/api/mobile/v1`.
For local iPhone testing, run the web app separately from the repo root:

```bash
npm run dev
```

Then use your Mac's LAN IP, not `localhost`, because `localhost` on the phone
means the phone itself.

For simulators:

```bash
npm run ios
npm run android
```

This app is currently pinned to Expo SDK 54 so it can run in the App Store version of Expo Go on physical iPhones during Expo's 2026 SDK 55/56 transition. If Expo prints engine warnings or behaves oddly, use Node 20.19.4 or newer before debugging app code.

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
- `src/api/` contains the mobile API adapter. It currently uses mock data and is designed to switch to `/api/mobile/v1`.
- `src/components/` contains reusable app UI primitives.
- `src/theme/` contains shared mobile design tokens.
- `src/types/` contains domain types used by screens and API adapters.
