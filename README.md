# DIY Electrician Academy

Android-first Expo app for learning residential electrical concepts from the bottom up. The app is local-first, has no login, no backend, no analytics, no ads, and no push notifications.

## Safety Disclaimer

DIY Electrician Academy is educational only. It does not replace a licensed electrician, local electrical code, permits, inspections, or formal apprenticeship instruction. Electrical work can cause shock, fire, injury, or death. If unsure, stop and call a licensed electrician.

The app does not encourage panel work, service work, live work, new circuits, EV chargers, generator interlocks, subpanels, outdoor or wet-location circuits, aluminum wiring repair, knob-and-tube modifications, permit-required work, or uncertain wiring.

## Infrastructure

- Expo + React Native + TypeScript
- Expo Router routes under `src/app`
- EAS Build preview APK workflow
- EAS Update preview branch workflow
- AsyncStorage local persistence for non-sensitive progress
- Vitest domain tests
- ESLint, Prettier, TypeScript strict mode

## Install Prerequisites

- Node.js
- npm
- Expo account for EAS Build and EAS Update
- Android phone or emulator
- EAS CLI available globally or through `npx`

## Local Dev Commands

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run format
npx expo start
```

On this Windows machine, PowerShell may block `npm.ps1`; use:

```bash
cmd /c npm install
cmd /c npm test
cmd /c npx expo start
```

## Android Build Commands

```bash
eas login
eas project:init --non-interactive
eas build:configure
eas build --platform android --profile preview
```

The preview profile builds an APK for internal distribution. If EAS asks to create or link a project, accept the project it creates for `diy-electrician-academy`.

## Install APK on Android

After the preview build finishes:

```bash
eas build:list --platform android --limit 1
eas build:download --platform android --latest --output diy-electrician-academy-preview.apk
adb install -r diy-electrician-academy-preview.apk
```

You can also install from the EAS build page QR/link if preferred.

## EAS Update Workflow

Use this after a compatible APK is installed:

```bash
npm run typecheck
npm run lint
npm test
eas update --branch preview --message "Update DIY Electrician Academy"
```

EAS Update is appropriate for JavaScript, TypeScript, curriculum, styling, copy, and compatible asset changes. A new APK build is required for native dependencies, permissions, app config changes, icon/splash config changes, SDK upgrades, or runtime version changes.

## Dependency Audit

```bash
npm run audit
npm run audit:prod
```

The initial Expo template dependency tree reported 4 moderate audit findings. Review before distribution and avoid `npm audit fix --force` unless you are prepared to test breaking dependency changes.

## Curriculum Editing

Edit seed curriculum in `src/data/curriculum.ts`. Keep these rules:

- Every topic needs checklist items, safety notes, call-pro notes, and resources.
- Label YouTube searches as searches unless a specific video was manually verified.
- Dangerous topics must use `pro-only-awareness`.
- Do not add step-by-step instructions for live, panel, service, new-circuit, wet-location, or uncertain wiring work.

## Known Limitations

- Progress is local to one device.
- No cloud backup or sync.
- YouTube search results are not manually verified and can change.
- Completion is a learning marker, not competence, certification, or permission to perform electrical work.
- Local legal and apprenticeship requirements vary.

## Security Notes

- No hardcoded secrets.
- No backend or account system.
- No personal data collection.
- No analytics/tracking SDKs.
- External URLs are HTTPS-only and allowlisted.
- Stored data is non-sensitive local progress.

See `SECURITY.md`, `docs/threat-model.md`, `docs/security-checklist.md`, and `docs/update-workflow.md`.
