# Mobile Versioning

This project uses Expo/EAS versioning for the mobile app in `/mobile`.

## Source of truth

- User-facing app version: `mobile/app.json`
- Build pipeline and auto-increment rules: `mobile/eas.json`

## Two version numbers

### 1. Marketing version

This is the version users see in the Play Store and in app metadata.

Example:

```json
"version": "1.0.0"
```

Update this in `mobile/app.json`.

Use semantic versioning:

- `1.0.0`: first production release
- `1.0.1`: bug fixes only
- `1.1.0`: new features or meaningful UX improvements
- `2.0.0`: major repositioning, redesign, or breaking product change

### 2. Build version

This is the internal version Play Console uses to accept a new upload.

For Android, EAS manages this through `autoIncrement: true` in `mobile/eas.json`.

That means:

- every production build must have a higher internal build number
- we do not need to manually bump Android `versionCode` for normal releases

## Release policy

Use this default policy:

1. Keep the same marketing version during closed testing if changes are small and only internal builds are changing.
2. Bump the patch version for bug-fix releases.
3. Bump the minor version when users will notice new features, new screens, or better workflows.
4. Bump the major version only when the app meaningfully changes identity or behavior.

## Recommended workflow

### Closed testing

- Keep `version` stable if you are only fixing tester feedback.
- Let EAS auto-increment the build number.
- Upload each new AAB to the same Play Console testing track.

Example:

- Build 1: `1.0.0`
- Build 2: `1.0.0`
- Build 3: `1.0.0`

The visible version stays the same while the internal build number increases.

### Public release

Bump the visible version when the release meaningfully changes for users.

Examples:

- `1.0.0` -> `1.0.1` for launch bug fixes
- `1.0.1` -> `1.1.0` for new calling/search/application features

## Pre-release checklist

Before creating a production build:

1. Decide whether the change deserves a visible version bump.
2. Update `mobile/app.json` if needed.
3. Confirm `mobile/eas.json` still has `autoIncrement: true`.
4. Build the production Android app bundle.
5. Record the release notes.

## Release notes template

Keep release notes short and operational. Add entries to your preferred release log using this format:

```md
## 1.0.1 - 2026-06-03

- Fixed login edge cases on Android
- Improved push token registration
- Polished shortlist and application flows
```

## Current recommendation

For this repository:

- App name: `Students Traffic`
- Android package: `com.studentstraffic.app`
- First public launch version: `1.0.0`

Then follow with:

- `1.0.1` for launch fixes
- `1.1.0` for the first substantial feature release
