# DIY Electrician Academy

DIY Electrician Academy is an Android-first Expo learning app for residential electrical education. It is a local-first, no-login MVP that teaches concepts in a conservative trade-school sequence while repeatedly warning that real electrical work can cause shock, fire, injury, or death.

## Infrastructure Model

- Expo, React Native, TypeScript
- Expo Router with file-based routes in `src/app`
- EAS Build for Android APK/internal distribution
- EAS Update for post-install JavaScript and asset updates
- AsyncStorage local persistence for MVP progress
- No backend, login, analytics, ads, push notifications, paid APIs, or cloud sync

## Product Shape

- Home screen shows exactly 3 active topics when enough uncompleted topics remain.
- Topic detail teaches one topic with objectives, checklist, safety notes, call-pro notes, resources, and completion.
- Curriculum screen shows module progress and locked/unlocked/completed states.
- Completed screen acts as a local transcript.
- Safety screen is persistent and intentionally conservative.
- Settings screen supports daily refresh timing and reset.

## Build Policy

The app must prefer boring, proven Expo conventions over custom architecture. Domain logic lives in pure functions and is tested before the UI depends on it.
